var mongoose=require('mongoose')
var config=require('../config/db')
//Notification Schema 
var NotificationSchema = mongoose.Schema({
	
	date:{
		type :Date,
		default:Date.now
	},
	 idUserComm :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' 
	 },
     idPoste:{
   	  type: mongoose.Schema.Types.ObjectId,
		ref: 'Poste' 
      },
      idUser:{
      	type: mongoose.Schema.Types.ObjectId,
		ref: 'User' 
	},
     lu:{
      type: String
       }
})
var Notification=module.exports=mongoose.model('Notification',NotificationSchema)
module.exports.addNotif=function(newNot,callback){
    newNot.save(callback)
  }
  module.exports.allNot=function(idUser,callback){
  	 var query={idUser :idUser}
  	Notification.find(query,callback).populate('idUserComm').populate('idPoste')
  }
  module.exports.getByIdUser=function(idUser,callback){
	var query={idUser: idUser,
	            lu :"0"  }
	Notification.find(query,callback).populate('idUserComm').populate('idPoste')
} 
module.exports.getNotById=function(id,callback){
	Notification.findById(id,callback);
} 
module.exports.allNotbyIdUser=function(callback){
  	Notification.find(callback).populate('idPoste')
  }
  module.exports.getNotifNoLu=function(callback){
  	var query={lu:"0"}
  	Notification.find(query,callback)
  }