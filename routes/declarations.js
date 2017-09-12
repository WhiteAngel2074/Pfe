var express =require('express')
var url =require('url')
var fs =require('fs')
var router=express.Router()

var passport=require('passport')
var jwt=require('jsonwebtoken')

var User=require('../models/utilisateur')
var config=require('../config/db')
var Admin=require('../models/admin')
var Poste=require('../models/poste')
var Note=require('../models/notification')
var Decl=require('../models/declaration')
var Categ= require('../models/categorie')


router.post('/')



module.exports=router