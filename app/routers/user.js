const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({prefix:'/users'}) // 前缀方法

const {find,findbyId,create,update,deleted,login,checkOwer} = require("../controllers/user")
const {secret} = require('../config')

// 多中间件
// const auth = async (ctx,next) => {
//   const {authorization = ''} = ctx.request.header; //当没有authorization就设置问空
//   const token = authorization.replace('Bearer ','')
//   try {
//     const user = jsonwebtoken.verify(token,secret)
//     ctx.state.user = user//固定放这个用户信息
//   } catch (err) {
//     ctx.throw(401,err.message)
//   }
//   await next()
// }
const auth = jwt({secret});
router.get('/', find)
router.get('/:id', findbyId)
router.post('/', create)
router.patch('/:id',auth,checkOwer,update)
router.delete('/:id',auth,checkOwer,deleted)
router.post('/login',login)

module.exports = router;