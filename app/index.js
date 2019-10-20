const Koa = require('koa');
const bodyParser = require('koa-bodyparser') //获取路由参数json中间件
const app = new Koa();
const routing = require("./routers")  
const error = require('koa-json-error') // 错误报错中间件
const parameter = require("koa-parameter") //参数校验中间件

/**
 * 在所有中间件的最前面定义一个处理错误中建立，他能处理500，和项目内部抛出的错误处理412
 * 
 * 使用koa-json-error中间件，然后pro环境没有返回stack参数，本地环境有 
 */
app.use(error({
  postFormat:(e,{stack,...rest}) => process.env.NODE_ENV === 'pro' ? rest : {stack,...rest}
}))
app.use(bodyParser())
app.use(parameter(app))
routing(app)


app.listen(3000,()=>{
  console.log("程序启动在3000端口");
});