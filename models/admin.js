var mongoose=require('mongoose')
var bcrypt=require('bcryptjs')
var config=require('../config/db')

//admin Schema 
var AdminSchema = mongoose.Schema({
	
	username:{
		type :String,
		required:true,
	},
	password:{ 
		type: String,
		required: true
	}

})

var Admin=module.exports=mongoose.model('Admin',AdminSchema)

module.exports.addAdmin=function(newAdmin,callback){
  bcrypt.genSalt(10,(err,salt)=>{ 
  bcrypt.hash(newAdmin.password,salt,(err,hash)=>{
  	if(err)throw err
    newAdmin.password=hash;
    newAdmin.save(callback)
  })
  })
  }
  module.exports.getAdminByUsername=function(username,callback){
	var query={username: username}
	Admin.findOne(query,callback)
}
module.exports.comparePassword=function(condiatePassword,hash,callback){
   bcrypt.compare(condiatePassword,hash,(err,isMatch)=>{
   	if(err) throw err
   		callback(null,isMatch)
   })
}
