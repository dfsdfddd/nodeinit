const jsonwebtoken = require('jsonwebtoken')
const {secret} = require('../config')
const User = require('../models/users')
const Question = require('../models/questions')

class UserCtl {
  async find(ctx){
    // 设置响应头部
    // ctx.set("Allow","GET,POST")
    // a.b //500

    const {per_page = 10} = ctx.query;
    const page = Math.max(ctx.query.page*1,1) - 1;
    const perPage = Math.max(per_page * 1,1);
    ctx.body = await User
    .find({name:new RegExp(ctx.query.q)})
    .limit(perPage).skip(page * perPage);
  }
  async findbyId(ctx){
    const {fields = ''} = ctx.query;
    const selectFields = fields.split(';').filter(f=>f).map(f=>" +"+f).join('')
    const populateStr = fields.split(';').filter(f=>f).map(f=>{
      if(f === 'employments'){
        return 'employments.company employments.job'
      }
      if(f === 'educations'){
        return 'educations.school educations.major'
      }
      return f
    }).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFields)
    .populate(populateStr);
    if(!user){ctx.throw(404,'用户不存在')};
    ctx.body = user;
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:"string",required:true},
      pass:{type:"string",required:true}
    })
    const {name} = ctx.request.body;
    const isRepeatUser = await User.findOne({name})
    if(isRepeatUser){
      ctx.throw(409,'用户已存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async checkOwer(ctx,next){
    if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'没有权限')}
    await next()
  }

  async update(ctx) {
    ctx.verifyParams({
      name:{type:"string",required:false},
      pass:{type:"string",required:false},
      avatar_url:{type:'string',required:false},
      gender:{type:'string',required:false},
      headline:{type:'string',required:false},
      locations:{type:'array',itemType:'string',required:false},
      business:{type:'string',required:false},
      employments:{type:'array',itemType:'object',required:false},
      educations:{type:'array',itemType:'object',required:false},
    })
    const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    if(!user){ctx.throw(404,'用不不存在')}
    ctx.body = await User.findById(ctx.params.id)
  }
  async deleted(ctx){
    const user  = await User.findByIdAndDelete(ctx.params.id)
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.status = 204
  }
  async login(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      pass:{type:'string',required:true}
    })
    const user =await User.findOne(ctx.request.body)
    if(!user){ctx.throw(401,'用户名或密码不正确')}
    const {_id,name} = user;
    const token = jsonwebtoken.sign({_id,name},secret,{expiresIn:'1d'}) //设置jwttoken和有效期
    ctx.body = {token}
  }
  async listFollowing(ctx){
    const user = await User.findById(ctx.params.id).select("+following").populate('following') //根据following里面的id 查询到这个id与其相关的信息
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body = user.following
  }
  async listFollowers(ctx){
    const users = await User.find({following:ctx.params.id})
    ctx.body = users
  }
  async checkUserExist(ctx,next){
    const user = await User.findById(ctx.params.id)
    if(!user){ctx.throw(404,'用户不存在')}
    await next()
  }
  async follow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    if(!me.following.map(id=>id.toString()).includes(ctx.params.id)){
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollow(ctx){
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.following.splice(index,1)
      me.save()
    }
    ctx.status = 204
  }



  async listFollowingTopics(ctx){
    const user = await User.findById(ctx.params.id).select("+followingTopics").populate('followingTopics') //根据following里面的id 查询到这个id与其相关的信息
    if(!user){ctx.throw(404,'用户不存在')}
    ctx.body = user.followingTopics
  }
  async followTopics(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    if(!me.followingTopics.map(id=>id.toString()).includes(ctx.params.id)){
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  async unfollowTopics(ctx){
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = me.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1){
      me.followingTopics.splice(index,1)
      me.save()
    }
    ctx.status = 204
  }
  async listQuestions(ctx){
    const questions = await Question.find({questioner:ctx.params.id})
    ctx.body = questions
  }


}

module.exports = new UserCtl()