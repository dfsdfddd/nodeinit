const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const commentSchema = new Schema({
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  commentator:{type:Schema.Types.ObjectId,ref:"User",required:true,select:false},
  questionid:{type:String,required:true},
  answerid:{type:String,required:true},
  rootCommentId:{type:String},
  replyTo:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});

module.exports = model('Comment',commentSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
