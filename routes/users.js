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


//uploid image
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/frontend/uploads/'+req.user.id);
  },
  filename: function (req, file, callback) {
   
    callback(null, Date.now()+'-' + file.fieldname+'-'+file. originalname);
  }
});
var upload = multer({ storage : storage}).single('myfile');

//inscription
router.post('/inscription',(req,res,next)=>{
  console.log(req.body)
  let newUser= new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password,
    sex:req.body.selectedName,
    bloquer : '0'
  })
  User.getUserByUsername(newUser.username,(err,user)=>{
    if(err) throw err;
    if(!user){
        User.addUser(newUser,(err,user)=>{
          if(err){
            res.json({success:false,msg:'failed to register user'})
          }else{
             
                var dir = 'public/frontend/uploads/'+user._id
               try {
                  fs.mkdirSync(dir);
                } catch(e) {
                  if (!e.code == 'EEXIST') throw e;
                  else
                    {
                     console.log("Directory already exist");
                    }
                  }
            res.json({success:true,msg:'user register'})
              }
          })
    }else{
      res.json({success:false,msg:'username deja uitliser'})
    }
  })
   
})

//login
router.post('/login',(req,res,next)=>{
  var username = req.body.username;
  var password = req.body.password;
  //console.log(req.body)
  User.getUserByUsername(username,(err,user)=>{
    if(err) throw err;
      if(!user){
        return res.json({success:false,msg:'User not found'});
      }
      User.comparePassword(password,user.password,(err,isMatch)=>{
        if(err) throw err
          if(isMatch){
            var token= jwt.sign(user,config.secret,{
              expiresIn:604800
            })
            if(user.bloquer==='1')
              res.json({success:false,msg:'bloqué'})
            else{res.json({success:true,token:'JWT '+token,
              user:{
                id:user._id,
                name:user.name,
                username:user.username,
                email:user.email,
                photo:user.photo
              }
            });
          }
            
          }

          else{
            return res.json({success:false,msg:'wrong password'})
          }
      })
  })

})

//profil 
router.get('/profile',
  passport.authenticate('jwt',{session:false})
  ,(req,res,next)=>{
  res.json({user:req.user})

})
//mot de pass oublié
router.post('/oublie',(req,res,next)=>{
  var username = req.body.username;
  User.getUserByUsername(username,(err,user)=>{
    if(err) throw err;
      if(user){
        return res.json({success:true,user});
      }
      else
        return res.json({success:false,msg:'User not found'})
    })
})
router.put('/modifierPassword/:id',(req,res,next)=>{
  var id = req.params.id;
  var user=req.body;
  User.UpdatePassword(id,user,{},(err,user)=>{
    if(err)throw err
       return res.json({success:true,msg:'modification avec succà'})
  })
})
// bloquee user 
router.get('/bloquee/:id',(req,res,next)=>{
  var id = req.params.id;
  User.getUserById(id,(err,user)=>{
    if(err)throw err
       user.bloquer='1'
     user.save()
       return res.json({success:true,msg:'modification avec succà'})
  })
})
// debloquee user 
router.get('/debloquee/:id',(req,res,next)=>{
  var id = req.params.id;
  User.getUserById(id,(err,user)=>{
    if(err)throw err
       user.bloquer='0'
     user.save()
       return res.json({success:true,msg:'modification avec succà'})
  })
})
//numberof
router.get('/numberOfUser',(req,res,next)=>{
  User.getNumberOfUser((err,rep)=>{
   Poste.getNumberOfPoste((err,reps)=>{
    Decl.getNumberOfDeclaration((err,decls)=>{
       res.json({nuberOfUser : rep , nuberOfPoste: reps , nuberOfdeclarations: decls})

    })
  })
  })
})
//numberdeDeclarationByTypedeCrime
router.get('/Crime/Type/',(req,res,next)=>{
  Decl.getAllDeclarationsByTypeCrime((err,decl)=>{
    if(err) throw err
      else
       res.json(decl)
  })
})
//numberdeDeclarationByTypedeCrimeAndCity
router.get('/Crime/Type/city',(req,res,next)=>{
  Decl.getAllDeclarationsByTypeCrimeAndCity((err,decl)=>{
    if(err) throw err
      else
       res.json(decl)
  })
})
//supprimerdeclaration
router.get('/deleteDeclaration/:id',(req,res,next)=>{
  var id = req.params.id
   Decl.getDeclarationById(id,(err,dec)=>{
    console.log(dec)
    if(err)throw err   
    else{
       dec.remove()
       return res.json({success:true,msg:'supprimer avec succà'}) 
       }
   })
})
router.get('/numberOfaa/:search',(req,res,next)=>{
  var search= req.params.search
  Poste.getNumberOflocalisation(search,(err,rep)=>{
    
     res.json(rep)
  })
})
router.put('/update/:id',(req,res,next)=>{
  var id = req.params.id;
  var user=req.body;
  User.UpdateProfil(id,user,{},(err,user)=>{
    if(err)throw err
       return res.json({success:true,msg:'modification avec succà'})
  })
})
//all 
router.get('/all',(req,res,next)=>{
  User.getAll((err,data)=>{
       if(err)
        throw err;
       else{
        res.json(data)
       }
  })

})
//remove user
router.get('/removeuser/:id',(req,res,next)=>{
  var id=req.params.id
  User.getUserById(id,(err,user)=>{
    if(err)throw err
      user.remove()
    res.json({msg:'success'})
  })
})
//find User By id
router.get('/user/:id',(req,res,next)=>{
  var id=req.params.id
  User.getUserById(id,(err,user)=>{
    if(err)throw err
    res.json(user)
  })
})
//find user
router.get('/findUser/:search',(req,res,next)=>{
  var query=req.params.search
  User.findUserByName(query,function(err,users){
    if(err) throw err
      res.json(users)
  })
})
//nbrposteByUser
router.get('/users/postes',(req,res,next)=>{
  
  Poste.getAllPostesByUser(function(err,postes){
    if(err) throw err
      res.json(postes)
  })
})
//nbrdedeclarationsByUsers
router.get('/users/Declarations',(req,res,next)=>{ 
      Decl.getAllDeclarationsByUser(function(err,decls){
        if(err) throw err
          else
        res.json(decls)
      })
  
})
//nbrpostebycity
router.get('/postes/city',(req,res,next)=>{
  
  Poste.getAllPostesByCity(function(err,postes){
    if(err) throw err
      res.json(postes)
  })
})
//nbrposteMonthly
router.get('/postes/Monthly',(req,res,next)=>{
  
  Poste.getMonthlyPostes(function(err,postes){
    if(err) throw err
      res.json(postes)
  })
})
//nbrDeclarationMonthly
router.get('/Declaration/Monthly',(req,res,next)=>{
  Decl.getMonthlyDeclarations((err,decls)=>{
    if(err) throw err
      res.json(decls)
  })
})
//nbrDeclarationByCity
router.get('/declaration/city',(req,res,next)=>{
  
  Decl.getAllDeclarationsByCity(function(err,postes){
    if(err) throw err
      res.json(postes)
  })
})
//
router.get('/up',(req,res,next)=>{
var query=(url.parse(req.url,true)).query
console.log(query.username)
User.find(query,(err,data)=>{
       if(err){
        res.send('err')
       }else{
        res.json(data)
       }
  })
})
//adddeclaration
router.post('/addDeclaration/:id',(req,res,next)=>{
  console.log(req.body)
  var id =req.params.id;
  console.log(id)
  let newDec= new Decl({
    idCateg:req.body.declaration.idCateg,
    description:req.body.declaration.description,
    idUser:id,
    localisation:{
        city:req.body.declaration.city
          },
    lu :'0'
  })
  Decl.addDeclaration(newDec,(err,dec)=>{
    if(err){
      res.json({success:false,msg:'declaration n est pas ajouter'})
    }
    else{
      res.json({success:true,msg:'declaration est ajouter'})
    }
  })
})
router.get('/allDeclaration',(req,res,next)=>{
  Decl.allDeclaration((err,decls)=>{
    if(err)throw err
      else
        res.json(decls)
  })
})
//remove categorie
router.get('/removecategorie/:id',(req,res,next)=>{
  var id=req.params.id
  Categ.getCategorieById(id,(err,categ)=>{
    if(err)throw err
      categ.remove()
    res.json({msg:'success'})
  })
})
//addpost
router.post('/poste/:id',(req,res,next)=>{
  
  var id = req.params.id;
  //console.log(req.body)
   let newPoste= new Poste({
    name:req.body.data.name,
     description:req.body.data.description,
     idUser:id,
     localisation:{
        city:req.body.data.localisation,
        lat:req.body.lat,
        lng:req.body.lng
          }
     })
   Poste.addPoste(newPoste,(err,poste)=>{
    if(err){
      res.json({success:false,msg:'poste n est pas ajouter'})
    }else{
      res.json({success:true,msg:'poste est ajouter'})
    }
   })
})

//postByIdUser
router.get('/postes/:id',(req,res,next)=>{
  var id = req.params.id;
   Poste.getByIdUser(id,(err,poste)=>{
    if(err){
      res.json({success:false,msg:'no poste'})
    }else{
      res.json(poste)
    }
   })
})
//postByIdPoste
router.get('/poste/:id',(req,res,next)=>{
    var id = req.params.id;
   Poste.getPostById(id,(err,poste)=>{
    if(err){
       res.json({success:false,msg:'no poste'})
     }else{
      res.json(poste)
    }
   })
})
//all Poste
router.get('/allPoste',(req,res,next)=>{
  Poste.allPoste(function(err,poste){
    if(err)throw err;
    res.json(poste)
  })
})
//update Poste
router.put('/updatePoste/:id',(req,res,next)=>{
  var id = req.params.id;
  //console.log(req.body)
  var poste=req.body.poste;
  Poste.UpdatePost(id,poste,{},(err,poste)=>{
    if(err)throw err
       return res.json({success:true,msg:'modification avec succà'})
  })
})
router.get('/modifier/:id',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
   var id=req.params.id;
   Poste.getPostById(id,(err,poste)=>{
    if(err)throw err   
    else{
      if(poste.idUser.equals(req.user._id)){
       return res.json({success:true,msg:' succà'})
       }
        else{
        return res.json({success:false,msg:'vous n avez pas l autorisation de Modifier cette publication'})
         }
       }
   })
})
//delete Poste
router.get('/deletePoste/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
   var id=req.params.id;
   Poste.getPostById(id,(err,poste)=>{
    if(err)throw err   
    else{
      if(poste.idUser.equals(req.user._id)){
       poste.remove()
       return res.json({success:true,msg:'supprimer avec succà'})
         }
        else{
        return res.json({success:false,msg:'vous n avez pas l autorisation de supprimer'})
         }
       }
   })
})
//delete Poste
router.get('/delete/Poste/:id',(req,res)=>{
   var id=req.params.id;
   Poste.getPostById(id,(err,poste)=>{
    if(err)throw err   
    else{ 
       poste.remove()
       return res.json({success:true,msg:'supprimer avec succà'})
       }
   })
})
//add commentaire
router.post('/addcommentaire/:id',(req,res,next)=>{
  var id = req.params.id;
   Poste.getPostById(id,(err,poste)=>{
    if(err){
      res.json({success:false,msg:'no poste'})
    }else{
         poste.commmentaire.push(
           {  
             contexte:req.body.data,
             idUserCom:req.body.id
           })
         poste.save()
    let newNote= new Note({
     idUserComm: req.body.id,
     idPoste: req.params.id,
     idUser:poste.idUser,
     lu :'0'
     })
    console.log(newNote.idUser)
   Note.addNotif(newNote,(err,note)=>{
    if(err){
      res.json({success:false,msg:'notification n est pas ajouter'})
    }else{
      res.json({success:true,msg:'notification est ajouter'})
    }
   })
    }
   })
})
//get commentaire by id poste and id commentaire
router.get('/commentaire/:id1/:id2',(req,res,next)=>{
  var id1 = req.params.id1;
  var id2 =req.params.id2;
    Poste.getPostById(id1,(err,poste)=>{
      if(err){
      res.json({success:false,msg:'no com'})
      }else{
       res.json(poste.commmentaire.id(id2))
        }
    })
})
//update Commentaire
router.put('/updatecommentaire/:id1/:id2',(req,res,next)=>{
  var id1 = req.params.id1;
  var id2 =req.params.id2;
  var comm=req.body;
    Poste.getPostById(id1,(err,poste)=>{
      if(err){
      res.json({success:false,msg:'no poste'})
      }else{
        var p=poste.commmentaire.id(id2) 
          if(!p) res.json('not found')
          p.contexte=comm.contexte
          p.date=new Date()
          poste.save()
          return res.json(p)
       }
    })
})
//delete commentaire
router.get('/deleteComm/:id1/:id2',(req,res,next)=>{
 var id1 = req.params.id1;
  var id2 =req.params.id2;
  var comm=req.body;
    Poste.getPostById(id1,(err,poste)=>{
      if(err){
      res.json({success:false,msg:'no poste'})
      }else{
        var p=poste.commmentaire.id(id2) 
        p.remove()
        poste.save()
        res.json(poste)
      }
  })
})
//get city
router.get('/city',(req,res,next)=>{
  Poste.allPoste(function(err,postes){
    if(err)throw err
      else 
        var city=[]
        for (var i = postes.length - 1; i >= 0; i--) {
         city.push(postes[i].localisation)         
        }
        res.json(city)
        })       
})
//post image
  router.post('/api/photo',passport.authenticate('jwt',{session:false}),function(req,res){
    upload(req,res,function(err) {
        //console.log(req.file)
        //console.log(req.user)
          if(err) 
          {
            return res.send("Error uploading file.");
          }
          User.photoProfile(req.user.id,req.file.filename,(err,data)=>{
            if(err) throw err
              else
                return res.json({success:true ,msg:'photo',data})
                return res.json(req.file);
          })                      
    });
});

router.get('/photo/:id', function (req, res, next){
    fs.readdir('public/uploads/'+req.params.id+'/', function (err, files){
        if (err) return next (err);
        console.log(files)
        res.send(files);
    });
});

//get photo de profile
router.get('/photoProfile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  var idUser=req.user._id
  var path=req.user.photo
  fs.readdir('public/upload/'+idUser+'/'+path,function(err,file){
    if(err)throw err
      res.send(file)
  })
})

//all Notification
router.get('/allNoti',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  var idUser=req.user._id
  Note.allNot(idUser,function(err,note){
    if(err)throw err;    
    res.json(note)   
  })
})

//all Notification non Lu
router.get('/NotiNoLu',(req,res,next)=>{
  Note.getNotifNoLu(function(err,note){
    if(err)throw err;    
    res.json(note)   
  })
})
//get notification par user
router.get('/notification',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
  var id=req.user._id
  Note.getByIdUser(id,function(err,postes){
    if(err)throw err
   res.json(postes)   
  })
})
//remove notif
router.get('/removeNotifi/:id',(req,res,next)=>{
  var id=req.params.id
  Note.getNotById(id,function(err,note){
    if(err)throw err
      res.json({success:true,msg:'notif est supprimer avec success',note})
      note.remove() 
  })
})
//notfication lu
router.put('/notficationLu/:id',(req,res,next)=>{
  var id=req.params.id
  Note.getNotById(id,function(err,note){
    if(err)throw err
      note.lu='1'
     note.save()
    res.json(note)
  })
})
//
router.get('/wajdi/:id',(req,res,next)=>{
  var id=req.params.id
  Note.NotByIdUser(id,function(err,note){
    if(err) throw err
      res.json(note)
  })
})
router.post('/admin',(req,res,next)=>{
  console.log(req.body)
  let newAdmin= new Admin({
    username:req.body.username,
    password:req.body.password
  })
  Admin.addAdmin(newAdmin,(err,admin)=>{
    if(err)throw err
        res.json({success:true,msg:'add admin'})
  })
})
router.post('/adminLogin',(req,res,next)=>{
   var username = req.body.data.username;
  var password = req.body.data.password;
  console.log(req.body)
  Admin.getAdminByUsername(username,(err,admin)=>{
    if(err) throw err;
      if(!admin){
        return res.json({success:false,msg:'admin not found'});
      }
      Admin.comparePassword(password,admin.password,(err,isMatch)=>{
        if(err) throw err
          if(isMatch){
            var token= jwt.sign(admin,config.secret,{
              expiresIn:604800
            })
            res.json({success:true,token:'JWT '+token,
              admin:{
                id:admin._id,
                username:admin.username,
              }
            });
          }
          else{
            return res.json({success:false,msg:'wrong password'})
          }
      })
  })
})
router.post('/addCategorie',(req,res,next)=>{
   let newCateg= new Categ({
    name:req.body.name
     })
   Categ.addCategorie(newCateg,(err,categ)=>{
    if(err) throw err 
      else
        res.json ({success:true,msg:'add avec success'})
   })

})
router.get('/allCategorie',(req,res,next)=>{
  Categ.allCategorie((err,categories)=>{
    if(err) throw err
      else
        res.json(categories)
  })
})

//supprimerdeclaration
router.get('/delete/Declaration/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
   var id=req.params.id;
   Decl.getDeclarationById(id,(err,decl)=>{
    if(err)throw err   
    else{
      if(decl.idUser.equals(req.user._id)){
       decl.remove()
       return res.json({success:true,msg:'supprimer avec succà'})
         }
        else{
        return res.json({success:false,msg:'vous n avez pas l autorisation de supprimer'})
         }
       }
   })
})
module.exports=router