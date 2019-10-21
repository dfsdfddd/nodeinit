const User = require('../models/users')

class UserCtl {
  async find(ctx){
    // 设置响应头部
    // ctx.set("Allow","GET,POST")
    // a.b //500
    ctx.body = await User.find();
  }
  async findbyId(ctx){
    const user = await User.findById(ctx.params.id);
    if(!user){ctx.throw(404,'用户不存在')};
    ctx.body = user;
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:"string",required:true},
    })
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async update(ctx) {
    ctx.verifyParams({
      name:{type:"string",required:true},
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
}

module.exports = new UserCtl()