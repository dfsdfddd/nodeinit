const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({prefix:'/topics'}) // 前缀方法

const {find,findById,create,update,checkTopicExist,listFollowers} = require("../controllers/topic")
const {secret} = require('../config')

const auth = jwt({secret});
router.get('/', find)
router.get('/:id',checkTopicExist, findById)
router.post('/',auth,create)
router.patch('/:id',auth,checkTopicExist,update)
router.get('/:id/followers',checkTopicExist, listFollowers)


module.exports = router;