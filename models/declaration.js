var mongoose=require('mongoose')
var config=require('../config/db')


//declaration Schema 
var declarationSchema = mongoose.Schema({
	idCateg :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Categorie' 
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
	localisation:{
		city:{
			type:String,
			required:true
		}
	},
	lu:{
      type: String
       }
})

var Declaration=module.exports=mongoose.model('declaration',declarationSchema)

module.exports.addDeclaration=function(newDeclaration,callback){
	
    newDeclaration.save(callback)
  }
  module.exports.allDeclaration=function(callback){
  	Declaration.find(callback).sort({date: 'descending'}).populate('idUser').populate('idCateg')
  }
  module.exports.getNumberOfDeclaration=function(callback){
	Declaration.count(callback)
}
module.exports.getDeclarationById=function(id,callback){
	Declaration.findById(id,callback)
}
module.exports.getByIdUser=function(idUser,callback){
	var query={idUser: idUser}
	Declaration.find(query,callback).populate('idUser')
}
  module.exports.getAllDeclarationsByCity = function(callback) {
  	Declaration.aggregate([
	    {
	    	$group : {
		        _id : {
		            city : '$localisation.city'
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
module.exports.getAllDeclarationsByUser = function(callback) {
  	Declaration.aggregate([
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
	    Declaration.populate(docs, options, function (err, results) {
	       callback(err, results);
	    });
	})
}

module.exports.getAllDeclarationsByTypeCrime = function(callback) {
  	Declaration.aggregate([
	    {
	    	$group : {
		        _id : {
		            type : '$idCateg',
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
	          	model: 'Categorie'
	    	}
	   	];
	    Declaration.populate(docs, options, function (err, results) {
	       callback(err, results);
	    });
	})
}
module.exports.getAllDeclarationsByTypeCrimeAndCity = function(callback) {
  	Declaration.aggregate([
	    {
	    	$group : {
		        _id : {
		            type : '$idCateg',
		            city :'$localisation.city'
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
	          	model: 'Categorie'
	    	}
	   	];
	    Declaration.populate(docs, options, function (err, results) {
	       callback(err, results);
	    });
	})
}
// Monthly Declarations
module.exports.getMonthlyDeclarations= function(callback) {
  Declaration.aggregate([
    {$group: {
      _id: { 
        year :  {$year: new Date()},   
        month : { $month : new Date() },
        
       },
      declaration: {$sum: 1}
    }}
  ], (err, results) => {
    if(err) throw err;
    callback(null, results);
  })
}