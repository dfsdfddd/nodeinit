const db = [{name:'舒服'}] //重启服务 内存的内容就没了
class UserCtl {
  find(ctx){
    // 设置响应头部
    // ctx.set("Allow","GET,POST")
    ctx.body = db
  }
  findbyId(ctx){
    ctx.body = db[ctx.params.id*1]
  }
  create(ctx){
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  update(ctx) {
    db[ctx.params.id*1] = ctx.request.body
    ctx.body = ctx.request.body
  }
  deleted(ctx){
    db.splice(ctx.params.id*1,1)
    ctx.status = 204
  }
}

module.exports = new UserCtl()