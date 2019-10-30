const Answer = require('../models/answers')

class AnswerCtl {
  // 查询所有的topic
  /**
   * limit == pageSize 10
   * skip == pageNum-1,从0个开始查询10个
   * 一页10项 limit10 skip 0,第二页，limit10，skip 从1 * 10 开始查询10个
   * find里面添加模糊搜索，用正则匹配
   * 
   */
  async find(ctx){
    const {per_page = 10} = ctx.query;
    const page = Math.max(ctx.query.page*1,1) - 1;
    const perPage = Math.max(per_page * 1,1)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer
    .find({content:q,questionid:ctx.params.questionid})
    .limit(perPage).skip(page * perPage)
  }
  async checkAnswerExist(ctx,next){
    const answer = await Answer.findById(ctx.params.id).select('+answerer')
    if(!answer){ctx.throw(404,'答案不存在')}
    if(answer.questionid !== ctx.params.questionid){
      ctx.throw(404,'该问题下没有此答案')
    }
    ctx.state.answer = answer
    await next()
  }
  async findById(ctx){
    const {fields = ''} = ctx.query;
    const selectFields = fields.split(';').filter(f=>f).map(f=>" +" + f).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    ctx.body = answer
  }
  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
    })
    // 创建的时候除了title和description 还有当前用户的id
    const answerer = ctx.state.user._id
    const {questionid} = ctx.params
    const answer = await new Answer({...ctx.request.body,answerer,questionid}).save()
    ctx.body = answer
  }
  async checkAnswerer(ctx,next){
    const {answer} = ctx.state;
    if(answer.answerer.toString() !== ctx.state.user._id){ctx.throw(403,'没有权限')}
    await next()
  }
  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false},
    })
    // checkAnswerExist  已经findbyid一次了 这里只要跟新answer就可以了
    await ctx.state.answer.update(ctx.request.body)
    ctx.body = ctx.state.answer
  }

  async delete(ctx){
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204;
  }
}

module.exports = new AnswerCtl()