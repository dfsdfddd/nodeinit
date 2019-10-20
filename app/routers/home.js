const Router = require('koa-router')
const router = new Router() // 前缀方法
const {index} = require("../controllers/home")

router.get('/',index)

module.exports = router;