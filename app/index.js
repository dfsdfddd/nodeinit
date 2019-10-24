const Koa = require('koa');
const koaBody = require('koa-body') //获取路由参数json中间件
const koaStatic = require('koa-static')
const mongoose = require('mongoose')
const path = require('path')

const app = new Koa();
const routing = require("./routers")  
const error = require('koa-json-error') // 错误报错中间件
const parameter = require("koa-parameter") //参数校验中间件

const { connectionStr } = require("./config")

mongoose.connect(connectionStr,{ useNewUrlParser: true,useUnifiedTopology: true },()=>console.log('mongdb链接成功了'))
mongoose.connection.on('error',console.error)




app.use(koaStatic(path.join(__dirname,'public')));
/**
 * 在所有中间件的最前面定义一个处理错误中建立，他能处理500，和项目内部抛出的错误处理412
 * 
 * 使用koa-json-error中间件，然后pro环境没有返回stack参数，本地环境有 
 */
app.use(error({
  postFormat:(e,{stack,...rest}) => process.env.NODE_ENV === 'pro' ? rest : {stack,...rest}
}))
app.use(koaBody({
  multipart:true,//允许上传文件
  formidable:{
    uploadDir: path.join(__dirname, '/public/uploads'), // 设置保存文件的路径
    keepExtensions: true, //保留扩展名 文件后缀
  }
}))

app.use(parameter(app))
routing(app)


app.listen(3000,()=>{
  console.log("程序启动在3000端口");
});