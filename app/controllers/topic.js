const Topic = require('../models/topics')

class TopicCtl {
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
    ctx.body = await Topic
    .find({name:new RegExp(ctx.query.q)}).limit(perPage).skip(page * perPage)
  }
  async findById(ctx){
    const {fields = ''} = ctx.query;
    const selectFields = fields.split(';').filter(f=>f).map(f=>" +" + f).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  async create(ctx){
    ctx.verifyParams({
      name:{type:'string',required:true},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update(ctx){
    ctx.verifyParams({
      name:{type:'string',required:false},
      avatar_url:{type:'string',required:false},
      introduction:{type:'string',required:false}
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body = topic

  }
}

module.exports = new TopicCtl()