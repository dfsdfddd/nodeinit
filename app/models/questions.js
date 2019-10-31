const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const questionSchema = new Schema({
  __v:{type:Number,select:false},
  title:{type:String,required:true},
  description:{type:String},
  questioner:{type:Schema.Types.ObjectId,ref:"User",select:false},
  topics:{type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false}
},{timestamps:true});

module.exports = model('Question',questionSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
