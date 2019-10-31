const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({prefix:'/questions/:questionid/answers/:answerid/comments'}) // 前缀方法

const {find,findById,create,update,checkCommentExist,checkCommenter,delete:del} = require("../controllers/comment")
const {secret} = require('../config')

const auth = jwt({secret});
router.get('/', find)
router.get('/:id',checkCommentExist, findById)
router.post('/',auth,create)
router.patch('/:id',auth,checkCommentExist,checkCommenter,update)
router.delete('/:id',auth,checkCommentExist,checkCommenter,del)


module.exports = router;