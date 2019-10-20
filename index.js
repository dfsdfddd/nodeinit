const Koa = require('koa');
const Router = require('koa-router')

const app = new Koa();
const router = new Router();
const userRouter = new Router({prefix:'/users'}) // 前缀方法

// 多中间件
const auth = async (ctx,next) => {
  console.log(ctx.url)
  // if(ctx.url != "/users"){
  //   ctx.throw(401)
  // }
  await next()
}


/**
 * 
 */
userRouter.get('/',auth, async (ctx,next) => {
  ctx.body = [{name:'asdf'},{name:'24234'}]
})
userRouter.get('/:id',auth, async (ctx,next) => {
  ctx.body = {name:'asdf'}
})
userRouter.post('/:id',auth, async (ctx,next) => {
  ctx.body = {name:'asdf'}
})
userRouter.put('/:id',auth, async (ctx,next) => {
  ctx.body = {name:'asdf2'}
})
userRouter.delete('/:id',auth, async (ctx,next) => {
  ctx.status = 204
})

 app.use(router.routes())
 app.use(userRouter.routes())
 app.use(userRouter.allowedMethods())// 响应options方法 告诉所支持的请求方法
 //405 状态吗 支持请求方法 但是没有定义
 // 501状态吗 根本就不支持请求方法

app.listen(4000);