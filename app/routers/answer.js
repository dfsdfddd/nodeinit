const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({prefix:'/questions/:questionid/answers'}) // 前缀方法

const {find,findById,create,update,checkAnswerExist,checkAnswerer,delete:del} = require("../controllers/answer")
const {secret} = require('../config')

const auth = jwt({secret});
router.get('/', find)
router.get('/:id',checkAnswerExist, findById)
router.post('/',auth,create)
router.patch('/:id',auth,checkAnswerExist,checkAnswerer,update)
router.delete('/:id',auth,checkAnswerExist,checkAnswerer,del)


module.exports = router;