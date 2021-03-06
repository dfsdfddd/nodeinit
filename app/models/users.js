const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const userSchema = new Schema({
  __v:{type:Number,select:false},
  name:{type:String, required:true}, // required 为必传值 还可以设置默认值 default:0
  pass:{type:String,required:true,select:true},

  avatar_url:{type:String},// 头像
  gender:{type:String,enum:['male','female'],required:true,default:'male'},//性别
  headline:{type:String},// 一句话描述
  locations:{type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false}, // 多个地方的地址
  business:{type:Schema.Types.ObjectId,ref:'Topic',select:false},//职业
  employments:{ //职业经历
    type:[{
      company:{type:Schema.Types.ObjectId,ref:'Topic'},
      job:{type:Schema.Types.ObjectId,ref:'Topic'},
    }],
    select:false
  },
  educations:{ //教育经历
    type:[{
      school:{type:Schema.Types.ObjectId,ref:'Topic'},
      major:{type:Schema.Types.ObjectId,ref:'Topic'},
      diploma:{type:Number,enum:[1,2,3,4,5]},
      entrance_year:{type:Number},
      graduation_year:{type:Number}
    }],
    select:false
  },
  following:{
    type:[{type:Schema.Types.ObjectId,ref:'User'}], // 引用userid里面的用户信息
    select:false
  },
  followingTopics:{
    type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    select:false
  },

  linkingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
  },
  dislinkingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
  },
  collectingAnswers:{
    type:[{type:Schema.Types.ObjectId,ref:'Answer'}],
    select:false
  },

},{timestamps:true});

module.exports = model('User',userSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
