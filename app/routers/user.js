const jwt = require('koa-jwt')
const Router = require('koa-router')
const router = new Router({prefix:'/users'}) // 前缀方法

const {checkUserExist,listFollowers,find,findbyId,create,update
  ,deleted,login,checkOwer,listFollowing,follow,unfollow
,followTopics,unfollowTopics,listFollowingTopics,listQuestions
,listLinkingAnswers,linkAnswers,unLinkAnswers,listDisLinkingAnswers
,disLinkAnswers,unDisLinkAnswers,listCollectingAnswers,collectAnswers,unCollectAnswers} = require("../controllers/user")

const {checkTopicExist} = require('../controllers/topic')
const {checkAnswerExist} = require('../controllers/answer')

const {secret} = require('../config')

// 多中间件
// const auth = async (ctx,next) => {
//   const {authorization = ''} = ctx.request.header; //当没有authorization就设置问空
//   const token = authorization.replace('Bearer ','')
//   try {
//     const user = jsonwebtoken.verify(token,secret)
//     ctx.state.user = user//固定放这个用户信息
//   } catch (err) {
//     ctx.throw(401,err.message)
//   }
//   await next()
// }
const auth = jwt({secret});
router.get('/', find)
router.get('/:id', findbyId)
router.post('/', create)
router.patch('/:id',auth,checkOwer,update)
router.delete('/:id',auth,checkOwer,deleted)
router.post('/login',login)
router.get('/:id/following',listFollowing)
router.get('/:id/followers',listFollowers)
router.put('/following/:id',auth,checkUserExist,follow)
router.delete('/following/:id',auth,checkUserExist,unfollow)

router.get('/:id/followingTopics',listFollowingTopics)
router.put('/followingTopics/:id',auth,checkTopicExist,followTopics)
router.delete('/followingTopics/:id',auth,checkTopicExist,unfollowTopics)

router.get('/:id/questions',listQuestions)

router.get('/:id/linkingAnswers',listLinkingAnswers)
router.put('/linkingAnswers/:id',auth,checkAnswerExist,linkAnswers,unDisLinkAnswers)
router.delete('/linkingAnswers/:id',auth,checkAnswerExist,unLinkAnswers)

router.get('/:id/dislinkingAnswers',listDisLinkingAnswers)
router.put('/dislinkingAnswers/:id',auth,checkAnswerExist,disLinkAnswers,unLinkAnswers)
router.delete('/dislinkingAnswers/:id',auth,checkAnswerExist,unDisLinkAnswers)

router.get('/:id/collectAnswers',listCollectingAnswers)
router.put('/collectAnswers/:id',auth,checkAnswerExist,collectAnswers)
router.delete('/collectAnswers/:id',auth,checkAnswerExist,unCollectAnswers)


module.exports = router;