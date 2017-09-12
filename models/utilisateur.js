var mongoose=require('mongoose')
var bcrypt=require('bcryptjs')
var config=require('../config/db')

//user Schema 
var UserSchema = mongoose.Schema({
	name:{
		type: String
	},
	email:{
		type: String,
		required:true
	},
	username:{
		type :String,
		required:true,
	},
	password:{ 
		type: String,
		required: true
	},
	photo:{ 
		type: String,
	},
	sex:{
		type: String,
		required: true,
	},
	bloquer :{
		 type: String
	}

})

var User=module.exports=mongoose.model('User',UserSchema)

module.exports.getUserById=function(id,callback){
	User.findById(id,callback)
}

module.exports.getUserByUsername=function(username,callback){
	var query={username: username}
	User.findOne(query,callback)
}
module.exports.addUser=function(newUser,callback){
  bcrypt.genSalt(10,(err,salt)=>{ 
  bcrypt.hash(newUser.password,salt,(err,hash)=>{
  	if(err)throw err
    newUser.password=hash;
    newUser.save(callback)
  })
  })
  }
module.exports.getAll=function(callback){
	User.find(callback).sort({date: 'descending'})
}

module.exports.UpdatePassword=function(id,user,option,callback){
	var query={_id:id}
	     bcrypt.genSalt(10,(err,salt)=>{ 
		  bcrypt.hash(user.password,salt,(err,hash)=>{
		  	if(err)throw err
		    user.password=hash;
		User.findOneAndUpdate(query,user,option,callback)
	      })
		})
	

}
module.exports.deleteUser=function(user,callback){
	user.remove(callback)
	
}
module.exports.comparePassword=function(condiatePassword,hash,callback){
   bcrypt.compare(condiatePassword,hash,(err,isMatch)=>{
   	if(err) throw err
   		callback(null,isMatch)
   })
}
module.exports.UpdateProfil=function(id,user,option,callback){
	var query ={_id:id}
	
	var update={
		name:user.name,
		email:user.email,
	}
	User.findOneAndUpdate(query,update,option,callback)
}
module.exports.photoProfile=function(id,image,callback){
	var query={_id:id}
	var update={
		photo:image
	}
	User.findOneAndUpdate(query,update,callback)
}

module.exports.findUserByName=function(name,callback){
	var query={name:name}
	User.find(query,callback)
}
module.exports.getNumberOfUser=function(callback){
	User.count(callback)
}