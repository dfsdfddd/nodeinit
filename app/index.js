const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const app = new Koa();

const routing = require("./routers")

/**
 * 在所有中间件的最前面定义一个处理错误中建立，他能处理500，和项目内部抛出的错误处理412
 */
app.use(async (ctx,next) => {
  try {
    await next()
  } catch (err) {
      ctx.status = err.status||err.statusCode||500
      ctx.body = {
        message: err.message
      }
  }
})

app.use(bodyParser())
routing(app)


app.listen(3000,()=>{
  console.log("程序启动在3000端口");
});