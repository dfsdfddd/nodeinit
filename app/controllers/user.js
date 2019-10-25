const jsonwebtoken = require('jsonwebtoken')
const {secret} = require('../config')
const User = require('../models/users')

class UserCtl {
  async find(ctx){
    // 设置响应头部
    // ctx.set("Allow","GET,POST")
    // a.b //500
    ctx.body = await User.find();
  }
  async findbyId(ctx){
    const {fields = ''} = ctx.query;
    const selectFields = fields.split(';').filter(f=>f).map(f=>" +"+f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields);
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
}

module.exports = new UserCtl()