const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router')

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