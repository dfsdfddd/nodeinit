const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')

/**
 * koa async 的执行顺序 
 * koa的router就是一个中间件
 * 一个koa就是由多个中间件组件
 */
app.use(async (ctx,next) => {
  console.log(1)
  await next()
  console.log(2)

})
app.use(async (ctx,next) => {
  console.log(3)
  await next()
  console.log(4)
})
app.use(async (ctx,next) => {
  console.log(5);
})

app.listen(4000);