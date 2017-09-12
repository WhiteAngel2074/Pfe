var mongoose=require('mongoose')
var config=require('../config/db')


//categorie Schema 
var categorieSchema = mongoose.Schema({

	name:{
		type: String,
		required:true
	},
	 idCateg :{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Categorie' 
	 }
})

var Categorie=module.exports=mongoose.model('Categorie', categorieSchema)

module.exports.addCategorie=function(newCategorie,callback){
    newCategorie.save(callback)
  }
  module.exports.allCategorie=function(callback){
  	Categorie.find(callback)
  }
  module.exports.getCategorieById=function(id,callback){
	Categorie.findById(id,callback)
}