const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const answerSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  answerer:{type:Schema.Types.ObjectId,ref:"User",required:true,select:false},
  questionid:{type:String,required:true},
  voteCount:{type:Number,required:true,default:0}
},{timestamps:true});

module.exports = model('Answer',answerSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
