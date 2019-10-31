const Comment = require('../models/comments')

class CommentCtl {
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
    const {questionid,answerid} = ctx.params;
    const{rootCommentId} = ctx.query
    ctx.body = await Comment
    .find({content:q,questionid,answerid,rootCommentId})
    .limit(perPage).skip(page * perPage).populate('commentator replyTo')
  }
  async checkCommentExist(ctx,next){
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if(!comment){ctx.throw(404,'评论不存在')}
    // 只有删改查答案的时候才检查这个逻辑，赞，踩答案的时候不检查
    if(ctx.params.questionid&&comment.questionid !== ctx.params.questionid){
      ctx.throw(404,'该问题下没有此评论')
    }
    if(ctx.params.answerid&&comment.answerid !== ctx.params.answerid){
      ctx.throw(404,'该答案下没有此评论')
    }
    ctx.state.comment = comment
    await next()
  }
  async findById(ctx){
    const {fields = ''} = ctx.query;
    const selectFields = fields.split(';').filter(f=>f).map(f=>" +" + f).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    ctx.body = comment
  }
  async create(ctx){
    ctx.verifyParams({
      content:{type:'string',required:true},
      rootCommentId:{type:'string',required:false},
      replyTo:{type:'string',required:false},
    })
    const commentator = ctx.state.user._id
    const {questionid,answerid} = ctx.params
    const comment = await new Comment({...ctx.request.body,commentator,questionid,answerid}).save()
    ctx.body = comment
  }
  async checkCommenter(ctx,next){
    const {comment} = ctx.state;
    if(comment.commentator.toString() !== ctx.state.user._id){ctx.throw(403,'没有权限')}
    await next()
  }
  async update(ctx){
    ctx.verifyParams({
      content:{type:'string',required:false},
    })
    const {content} = ctx.request.body
    await ctx.state.comment.update({content})
    ctx.body = ctx.state.comment
  }

  async delete(ctx){
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204;
  }
}

module.exports = new CommentCtl()