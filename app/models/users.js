const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const userSchema = new Schema({
  __v:{type:Number,select:false},
  name:{type:String, required:true}, // required 为必传值 还可以设置默认值 default:0
  pass:{type:String,required:true,select:true}
});

module.exports = model('User',userSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
