const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const topicSchema = new Schema({
  __v:{type:Number,select:false},
  name:{type:String,required:true},
  avatar_url:{type:String},
  introduction:{type:String,select:false}
},{timestamps:true});

module.exports = model('Topic',topicSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
