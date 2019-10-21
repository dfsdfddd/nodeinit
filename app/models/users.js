const mongoose  = require('mongoose');

const { Schema,model} = mongoose; // schema 为设置的json的数据结构

const userSchema = new Schema({
  name:{type:String, required:true} // required 为必传值 还可以设置默认值 default:0
});

module.exports = model('User',userSchema) //User 为一个集合名称，文档的集合  model 为schema的用户模型
