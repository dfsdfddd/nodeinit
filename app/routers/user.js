const Router = require('koa-router')
const router = new Router({prefix:'/users'}) // 前缀方法

const {find,findbyId,create,update,deleted} = require("../controllers/user")

// 多中间件
const auth = async (ctx,next) => {
  console.log(ctx.url)
  // if(ctx.url != "/users"){
  //   ctx.throw(401)
  // }
  await next()
}
router.get('/',auth, find)
router.get('/:id',auth, findbyId)
router.post('/',auth, create)
router.put('/:id',auth,update)
router.delete('/:id',auth,deleted)

module.exports = router;