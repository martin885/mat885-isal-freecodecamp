const mongoose=require('mongoose');
const Schema=mongoose.Schema;

searchTerm=new Schema
({
term:String,
when:String
});

const modelClass=mongoose.model('searchTerm',searchTerm);

module.exports=modelClass;