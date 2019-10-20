const Koa = require('koa');
const Router = require('koa-router')

const app = new Koa();
const router = new Router();
const userRouter = new Router({prefix:'/users'}) // 前缀方法

// 多中间件
const auth = async (ctx,next) => {
  console.log(ctx.url)
  if(ctx.url != "/users"){
    ctx.throw(401)
  }
  await next()
}


/**
 * 
 */
userRouter.get('/',auth, async (ctx,next) => {
  ctx.body = '234'
})
userRouter.post('/:id',auth, async (ctx,next) => {
  ctx.body = 'id'+ ctx.params.id
})
userRouter.put('/:id',auth, async (ctx,next) => {
  ctx.body = 'ids'+ ctx.params.id
})
userRouter.delete('/:id',auth, async (ctx,next) => {
  ctx.body = 'delete' + ctx.params.id
})

 app.use(router.routes())
 app.use(userRouter.routes())

app.listen(4000);