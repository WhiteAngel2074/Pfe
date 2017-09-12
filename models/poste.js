var mongoose=require('mongoose')
var config=require('../config/db')


//Poste Schema 
var PosteSchema = mongoose.Schema({
	name:{
		type: String,
		required:true
	},
	description:{
		type: String,
		required:true
	},
	date:{
		type :Date,
		default:Date.now
	},
	 idUser :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' 
	 },
   commmentaire:[
	  {
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
		   }  
	  }
	],
	image:{
		type:String
	},
	localisation:{
		city:{
			type:String,
			required:true
		},
		lat:{
			type:Number,
			required:true
		},
		lng:{
            type:Number,
			required:true
		}
	}
})

var Poste=module.exports=mongoose.model('Poste',PosteSchema)

module.exports.addPoste=function(newPoste,callback){
    newPoste.save(callback)
  }
module.exports.allPoste=function(callback){
  	Poste.find(callback).sort({date: 'descending'}).populate('idUser').populate('commmentaire.idUserCom')
  }
module.exports.getByIdUser=function(idUser,callback){
	var query={idUser: idUser}
	Poste.find(query,callback).populate('idUser').populate('commmentaire.idUserCom')
} 
module.exports.getPostById=function(id,callback){
	Poste.findById(id,callback).populate('idUser').populate('commmentaire.idUserCom');

} 
module.exports.UpdatePost=function(id,poste,option,callback){
	var query ={_id:id}
	var update={
		name:poste.name,
		description:poste.description,
		localisation:{
        city:poste.city,
        lat:poste.lat,
        lng:poste.lng
          }

	}
	Poste.findOneAndUpdate(query,update,option,callback)
}

module.exports.UpdateComm=function(p,comm,option,callback){
	var update={
		contexte:comm.contexte,
	    }
	console.log(p)
	Poste.findOneAndUpdate(p,update,option,callback)
}
module.exports.getNumberOflocalisation=function(localisation,callback){
	Poste.count(localisation,callback)
}
module.exports.getNumberOfPoste=function(callback){
	Poste.count(callback)
}
module.exports.getAllPostesByUser = function(callback) {
  	Poste.aggregate([
	    {
	    	$group : {
		        _id : {
		            type : '$idUser'
		        },
		        count : {
		            $sum : 1
		        }
		    }
	    }
  	], function(err, docs) {
	    var options = [
	    	{
	          	path: '_id.type',
	          	model: 'User'
	    	}
	   	];
	    Poste.populate(docs, options, function (err, results) {
	       callback(err, results);
	    });
	})
}
module.exports.getAllPostesByCity = function(callback) {
  	Poste.aggregate([
	    {
	    	$group : {
		        _id : {
		            city : '$localisation.city',
		            lat : '$localisation.lat',
		            lng : '$localisation.lng'
		        },
		        count : {
		            $sum : 1
		        }
		    }
	    }
  	], (err, results) => {
    if(err) throw err;

    callback(null, results);
  })
}
// Monthly Poste
module.exports.getMonthlyPostes = function(callback) {
  Poste.aggregate([
    {$group: {
      _id: { 
        year :  {$year: new Date()},   
        month : { $month : new Date() }
       },
      poste: {$sum: 1}
    }}
  ], (err, results) => {
    if(err) throw err;
    callback(null, results);
  })
}