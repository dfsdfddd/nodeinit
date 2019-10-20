const db = [{name:'舒服'}] //重启服务 内存的内容就没了
class UserCtl {
  find(ctx){
    // 设置响应头部
    // ctx.set("Allow","GET,POST")
    // a.b //500
    ctx.body = db
  }
  findbyId(ctx){
    
    if(ctx.params.id*1>=db.length){
      ctx.throw(412,'先决条件失败，id不存在')
    }
    ctx.body = db[ctx.params.id*1]
  }
  create(ctx){
    ctx.verifyParams({
      name:{type:"string",required:true},
      age:{type:"number",required:false},
    })
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  update(ctx) {
    if(ctx.params.id*1>=db.length){
      ctx.throw(412,'先决条件失败，id不存在')
    }
    ctx.verifyParams({
      name:{type:"string",required:true},
      age:{type:"number",required:false},
    })
    db[ctx.params.id*1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  deleted(ctx){
    if(ctx.params.id*1>=db.length){
      ctx.throw(412,'先决条件失败，id不存在')
    }
    db.splice(ctx.params.id*1,1)
    ctx.status = 204
  }
}

module.exports = new UserCtl()