var mongoose=require('mongoose')
var config=require('../config/db')


//Poste Schema 
var CommSchema = mongoose.Schema({
	    contexte:{
			type: String,
			required:true
	     },
		 date:{
			type :Date,
		  	default:Date.now
		   },
		 idUserCom:{
		 	type: mongoose.Schema.Types.ObjectId,
		    ref: 'User'
		   }, 
		   idPoste:{
		 	type: mongoose.Schema.Types.ObjectId,
		    ref: 'Poste'
		   } 
	
})

var Comm=module.exports=mongoose.model('Comm',CommSchema)

module.exports.addComm=function(newComm,callback){
    newComm.save(callback)
  }

  module.exports.allComm=function(callback){
  	Comm.find(callback).populate('idUserCom').populate('idPoste')
  }