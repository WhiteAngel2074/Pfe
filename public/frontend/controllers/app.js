var app = angular.module("myApp", ["ui.router",'chart.js','ngCookies','fileModelDirective','uplaodfileService','angular-web-notification']);
        
app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '../views/home.html'
        })
         .state('oublie', {
            url: '/oublie',
            templateUrl: '../views/oublie.html'
        })
           .state('api', {
            url: '/api',
            templateUrl: '../views/page1.html'
        })
          .state('motpass', {
            url: '/motpass',
            templateUrl: '../views/motpass.html',
            controller:'ModifPassword',
             params: {
                 idUser: null
              }
        })
        .state('login', {
            url: '/login',
            templateUrl: '../views/Login.html'
        })
         .state('declaration', {
            url: '/declaration',
            templateUrl: '../views/declaration.html'
        })
        .state('blog', {
            url: '/blog',
            templateUrl: '../views/blog.html'
           
        })
         .state('allNotif', {
            url: '/allNotif',
            templateUrl: '../views/allNotif.html',
             controller:'allNotif'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: '../views/signup.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: '../views/dashboard.html',
            controller:'dashCtrl'
        })
        .state('map', {
            url: '/map',
            templateUrl: '../views/map.html'
        })
         .state('pushNotification', {
            url: '/pushNotification',
            templateUrl: '../views/pushNotification.html'
        })
        .state('notif', {
            url: '/notif',
            templateUrl: '../views/notif.html',
            controller:'notiflu',
             params: {
                 idPoste: null
              }
        })
        .state('ProfileUser', {
            url: '/ProfileUser/:idUser',
            templateUrl: '../views/ProfileUser.html',
             controller:'ProfileUser',
             params: {
                 idUser: null
              }
        })
        .state('ModifPoste', {
            url: '/ModifPoste/:idPoste',
            templateUrl: '../views/modifposte.html',
             controller:'ModifPoste',
             params: {
                 idPoste: null
              }
        })
         .state('chat', {
            url: '/chat',
            templateUrl: '../views/chatroom.html',
            controller:'chatCtrl'  
        })
         .state('profile', {
            url: '/profile',
            templateUrl: '../views/profile.html',
            controller:'profileCtrl',
            cache: false //required
        });       
});

 app.run(function($cookies,$rootScope, $state,$location,$window){
     if ($cookies.get('token')) {
       $rootScope.token=$cookies.get('token')
       $rootScope.currentUser=JSON.parse($cookies.get('user'))

     }
     else{
        $location.path('/home');
     }
});
app.controller("oublieCtrl",function($scope, $http, $templateCache,$state){
    $scope.user = {};
  $scope.submitForm=function(){
      var method = 'POST';
            var url = 'http://localhost:8080/users/oublie';
            $http({
              method: method,
              url: url,
              data: $scope.user,
              headers: {'Content-Type': 'application/JSON'},
              cache: $templateCache
            })
            .success(function(response) {
              //console.log(response);
              if(response.success===true){
                idUser =  response.user._id
                // console.log(idUser)
                 $state.go('motpass',{idUser:idUser})
              }   
              else{
                  $scope.msg=response.msg
                  }  
            })
            .error(function(response) {
                console.log(response);
            });
  }
})
app.controller("ModifPassword",function($location,$rootScope,$scope,$http, $templateCache,$stateParams){
  var idUser=$stateParams.idUser
  
  $scope.user ={}
  $scope.MotPass = function(){
     var method = 'put';
            var url = 'http://localhost:8080/users/modifierPassword/'+idUser;
            $http({
              method: method,
              url: url,
              data: $scope.user,
              headers: {'Content-Type': 'application/JSON'},
              cache: $templateCache
            })
            .success(function(response) {
              console.log(response);
              if(response.success===true){
               $location.path('/login');
              }   
              else{
                  $scope.msg=response.msg
                  }  
            })
            .error(function(response) {
                console.log(response);
            });
    //console.log($scope.user)
    //console.log(idUser)
   

  }

})

 app.controller("logCtrl", function($rootScope,$scope, $http, $templateCache,$cookies,$location) {
        $scope.user = {};
        $scope.submitForm = function() {
        	//console.log($scope.user);
        	// Data request
            var method = 'POST';
            var url = 'http://localhost:8080/users/login';
            $http({
              method: method,
              url: url,
              data: $scope.user,
              headers: {'Content-Type': 'application/JSON'},
              cache: $templateCache
            })
            .success(function(response) {
                if(response.success==true){
                $cookies.put('token',response.token);
                $cookies.put('user',JSON.stringify(response.user));
                $rootScope.token=response.token
                $rootScope.currentUser=response.user;
                    
                          
                $location.path('/dashboard');
              }
                else{
                   $scope.msg=response.msg
                   console.log($scope.msg)
                }
            })
            .error(function(response) {
                 $scope.res=response;
                console.log(res);
            });
            
        }
        $scope.logout=function(){
                $cookies.remove('token');
                $cookies.remove('user');
                $rootScope.token=null;
                $rootScope.currentUser=null;
              $location.path('/'); 
        }
        
    });
  app.controller("SignCtrl", function($scope, $http, $templateCache,$location,$window) {
    $scope.names = ["male", "female"];
        $scope.user = {};
        $scope.submitForm = function() {
           $scope.result = angular.equals($scope.user.password,$scope.user.password1)
            if($scope.result){
              var method = 'POST';
            var url = 'http://localhost:8080/users/inscription';
            $http({
              method: method,
              url: url,
              data: $scope.user,
              headers: {'Content-Type': 'application/JSON'},
              cache: $templateCache
            })
            .success(function(response) {
              if(response.success==false){
                $scope.error=response.msg
              }
              else
                 $location.path('/login');
                })
            .error(function(response) {
                console.log(response);
            });
            }
            else{
                $window.alert('les deux mots de passe ne sont pas identiques');
            }
        }
       
    });
   
   app.controller("profileCtrl", 
        function($rootScope,$scope, $cookies,$http,$stateParams, $templateCache, $state,$location,uplaodFile) {
          if($rootScope.token ==undefined){
             $location.path('/login');
         }
          else{
           function profile() {
            var method = 'Get';
            var url = 'http://localhost:8080/users/profile';
            $http({
              method: method,
              url: url,
              data: $scope.user,
              headers: {
                  'Content-Type': 'application/JSON',
                  'Authorization' :$rootScope.token
                  },
              cache: $templateCache
            })
            .success(function(response) {
              $scope.infoProfil=response.user;
              console.log($scope.infoProfil)
            })
            .error(function(response) {
                console.log(response);
            });
        }
        profile();
      }
      $scope.edit=function(id){
        $scope.id=id
        console.log($scope.id)
      
      }
      $scope.update =function(id){
        console.log($scope.email)
          $http.put('/update/'+id).then(function(response){
          profile()
           })
      }
      $scope.uploadsPhotoProfile=function(){
         $scope.uploading=true;
         console.log($scope.file)
         uplaodFile.upload($scope.file).then(function(data){
                if(data.data.success){
                }else{
                     //$scope.uploading=false;
                    //$scope.alert='alert alert-danger';
                    //$scope.message=data.data.message;
                }
            });
             $state.transitionTo($state.current, $stateParams, {
                       reload: true,
                       inherit: false,
                       notify: true
                  });
      };
       function getPosteByidUser(){
        id=$rootScope.currentUser.id    
          $http.get('http://localhost:8080/users/postes/'+id).then(function(response){
            $scope.allPoste=response.data
        })
       }
      getPosteByidUser();
   
    });
    app.controller("dashCtrl", function($rootScope,$scope, $http, $templateCache,$state,$location) {

     });
   app.controller("notCtrl",function($rootScope,$scope, $http,$location,$state){
     function getNotif(){
        $http.get('/users/notification',{headers:{
            'Authorization' :$rootScope.token
          }}).then(function(response){
         //console.log(response.data)
          $scope.allNotif=response.data
        })
      }
      getNotif()
      $scope.notifLu=function(notif){
       // console.log(notif)
        id=notif._id
        $http.put('/users/notficationLu/'+id).then(function(response){
          $scope.notiflu=response.data
          //console.log(response.data)
          idPoste=notif.idPoste._id
          //console.log(idPoste)
          //$location.path('/notif').search({idPoste: idPoste})
          $state.go('notif', {idPoste:idPoste})
        })
      }
   })
   app.controller('notiflu',function($scope,$http,$stateParams){
    // console.log($stateParams.idPoste);
      var idPoste=$stateParams.idPoste
       $http.get('/users/poste/'+idPoste).then(function(response){
      //console.log(response.data)
      $scope.poste=response.data
    })
   })
 app.controller('chatCtrl',function($scope,$rootScope){
    var socket = io .connect();
    socket.emit('new user', $rootScope.currentUser)
        $scope.connectedUser=[]
    socket.on('get users',function(data){
      //console.log(data)
      for (var i = 0; i < data.length; i++) {
         $scope.connectedUser.push({user : data[i]})
      }
      //console.log($scope.connectedUser)
    })
    $scope.addmsg=function(data){
      socket.emit('send message',data); 
      //delete $scope.msg;
   }
    function getMsg(){
     $scope.stuffs = [];
      socket.on('new message',function(data){
         $scope.stuffs.push({msg: data.msg, user: data.user.username ,id: data.user.id,img: data.user.photo});
      })
    }
    getMsg() 
 })
   app.controller('allNotif',function($scope,$http,$rootScope){
      function getALlNotifByUser(){
        $http.get('/users/allNoti',{headers:{
            'Authorization' :$rootScope.token
          }}).then(function(response){
         console.log(response.data)
          $scope.allNotif=response.data
        })
          
       }
        getALlNotifByUser()
        $scope.removeNotif=function(id){
          console.log(id)
          $http.get('/users/removeNotifi/'+id).then(function(response){
            getALlNotifByUser()
          })
        }
   })
    app.controller("blogCtrl", function($window, $stateParams,$state,$scope,$timeout, $http, $templateCache,$rootScope) {
       $scope.types = ["braquage","harcèlement sexuel","vol"];
       function getPoste(){
          $http.get('http://localhost:8080/users/allPoste/').then(function(response){
          $scope.allPoste = response.data
          //console.log(response.data)
         
        })
       }
        getPoste();

         $scope.remove = function(id) {
          $http.get('http://localhost:8080/users/deletePoste/'+id,{headers:{
            'Authorization' :$rootScope.token
          }})
          .then(function(response){
             $window.alert(response.data.msg);
             //console.log(response.data)
              getPoste()
          });
        }
        $scope.Modifier=function(id){
          $http.get('/users/modifier/'+id,{headers:{
            'Authorization' :$rootScope.token
          }}).then(function(response){
             if(response.data.success===true)
              $state.go('ModifPoste', {idPoste:id})
              else
                $window.alert(response.data.msg);
          })
             
         
        
        }
          $scope.posteForm = function(id) {
             
            console.log($scope.poste)
            console.log($scope.poste.localisation)
            var address =$scope.poste.localisation
            geocoder = new google.maps.Geocoder();
             geocoder.geocode({ 'address': address}, function(results, status) {
               if (status == 'OK') {
                var lat=results[0].geometry.location.lat()
                var lng=results[0].geometry.location.lng()
                console.log(lat,lng)
                $http.post('/users/poste/'+id,{data: $scope.poste,lat,lng})
                .then(function(response){
                getPoste()
              $state.transitionTo($state.current, $stateParams, {
                      reload: true,
                      inherit: false,
                      notify: true
                  });
              });
                } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }

            });
           //ga('send', {hitType:'event',eventCategory:'test',eventAction:'click',eventLabel:id});   
        }
       
        $scope.addComm=function(id){
          $http.post('/users/addcommentaire/'+id,
            {data:$scope.newComment,id:$rootScope.currentUser.id})
             .then(function(response){
                  getPoste()
                   $state.transitionTo($state.current, $stateParams, {
                      reload: true,
                      inherit: false,
                      notify: true
                  });
          })
        }
        $scope.removeCom=function(id1,id2){
          console.log(id1,id2)
          $http.get('/users/deleteComm/'+id1+'/'+id2).then(function(response){
            console.log(response.data)
              getPoste()
               $state.transitionTo($state.current, $stateParams, {
                      reload: true,
                      inherit: false,
                      notify: true
                  });
          })
        }
      
        
    });
app.directive('myEnter', function ($http,$location,$state) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                  var query=scope.search
                  
                             
                          $http.get('/users/findUser/'+query).then(function(response){
                                scope.saerchUser=response.data
                                //console.log(response.data)
                                
                              })
                              scope.getProfil=function(id){
                                 $state.go('ProfileUser', {idUser:id})
                              }
                               
                });

                event.preventDefault();
            }
        });
    };
});
app.controller('ModifPoste',function($state,$window,$scope,$http,$rootScope,$stateParams){
  $scope.types = ["braquage","harcèlement sexuel","vol"]
  var id=$stateParams.idPoste
  $http.get('/users/poste/'+id).then(function(response){
    console.log(response.data)
    $scope.name = response.data.name
    $scope.description=response.data.description
    $scope.localisation=response.data.localisation.city
  })
  $scope.submitForm=function(){
    console.log($scope.name)
    console.log($scope.description),
    console.log($scope.localisation)
    var address =$scope.localisation
            geocoder = new google.maps.Geocoder();
             geocoder.geocode({ 'address': address}, function(results, status) {
               if (status == 'OK') {
                var lat=results[0].geometry.location.lat()
                var lng=results[0].geometry.location.lng()
                var poste={
                  "name" : $scope.name,
                  "description" : $scope.description,
                  "city" : $scope.localisation,
                  "lat": lat,
                  "lng":lng
                }
                $http.put('/users/updatePoste/'+id,{poste})
                .then(function(response){
                   $window.alert(response.data.msg);
                   $state.go('blog')
              });
                } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }

            });

  }
})
app.controller('ProfileUser',function($scope,$http,$stateParams){
  var id=$stateParams.idUser
  //console.log(id)
  $http.get('/users/user/'+id).then(function(response){
    $scope.user=response.data
    //console.log($scope.user)
  })
  $http.get('/users/postes/'+id).then(function(response){
    $scope.posteUser=response.data
   // console.log(response.data)
  })
})
 app.controller('MapCtrl', function ($scope,$http) {
      var marker;
      var map;
      var cities=[];
    
      function getCitie(){
        $http.get('/users/postes/city').then(function(response){
          console.log(response.data)
          var j=0
          for (var i = 0; i < response.data.length; i++) {
           createMarker(response.data[i]._id ,response.data[i].count);
          }          
        })
      }
      getCitie()
    
     //console.log (cities)
     
      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(33.7948829, 10.1432776),
       
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info , count){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.city,
            content: count

        });
        
        //marker.content = '<div class="infoWindowContent">' + marker.content + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('nombre de declaration dans :'+'<h2>'+ marker.title + '</h2>'+'est :' + '<h3>'+marker.content+'</h3>');
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  
    
 

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }


       $scope.gotoCurrentLocation=function(){
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var c = position.coords;
               console.log(c)
            });
            return true;
        }
        return false;
         }
         $scope.geoCode=function(){
           var address =$scope.search
            geocoder = new google.maps.Geocoder();
             geocoder.geocode({ 'address': address}, function(results, status) {
               if (status == 'OK') {
                var lat=results[0].geometry.location.lat()
                var lng=results[0].geometry.location.lng()
                console.log(results)
                var marker = new google.maps.Marker({
                     map: $scope.map,
                     position: new google.maps.LatLng(lat, lng),
                     zoom : 8
                     });
                 
                } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            });
         }
     
})

app.controller('exampleForm',['$scope','$rootScope','$http', function($scope,$rootScope,$http){
$scope.citys=[]
$scope.selectedTestAccount = null;
$scope.testAccounts = [];
    $http({
            method: 'GET',
            url: '/users/allCategorie',
            data: { applicationId: 3 }
        }).success(function (result) {
          console.log(result)
        $scope.testAccounts = result;
    });
        $scope.sendID=function(type){
           console.log(type)
    $scope.submitForm= function(){
      console.log($rootScope.currentUser)
    idUser =$scope.currentUser.id
    var declaration={
                  "idCateg" : type._id,
                  "description" : $scope.notification.text,
                  "city" : $scope.notification.localisation,
                }
                $http.post('/users/addDeclaration/'+idUser,{declaration}).then(function(response){
                  console.log(response.data)
                })
           }
      }
      
      $scope.title=''
      $scope.text=''
      $scope.icon=''
}])
app.directive('showButton', ['webNotification','$state', function (webNotification,$state) {
    'use strict';

    return {
        restrict: 'C',
        scope: {
            notificationTitle: '=',
            notificationText: '=',
            notificationIcon: '=',
           },
        link: function (scope, element) {
            element.on('click', function onClick() {
                webNotification.showNotification(scope.notificationTitle, {
                    body: scope.notificationText ,
                    icon: scope.notificationIcon,
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                         $state.go('home')
                    },
                    autoClose: 14000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 15000);
                    }
                });
            });
        }
    };
}]);
app.controller("LineCtrl", function ($scope,$http) {
  $scope.labels = [];
  $scope.data = [];
  $http.get('/users/declaration/city').then(function(response){
         // console.log(response.data)
          for (var i = 0; i < response.data.length; i++) {
            $scope.labels.push(response.data[i]._id.city) 
           $scope.data.push(response.data[i].count)
          }
         // console.log($scope.data)
        })
  //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
 //$scope.data = [ 65, 59, 80, 81, 56, 55, 40];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});
app.controller("LineCtrl1", function ($scope,$http) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.data = [];
  $http.get('/users/Declaration/Monthly').then(function(response){   
           for (var i = 0; i < $scope.labels.length; i++) {
              for (var j = 0; j < response.data.length; j++) {
                if((response.data[j]._id.month-1)==i){
                   $scope.data.push(response.data[j].declaration);
                }else{
                  $scope.data.push(0);
                } 
            }
          }
          // console.log($scope.data)
         // console.log($scope.data)
        })
  //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
 //$scope.data = [ 65, 59, 80, 81, 56, 55, 40];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});
app.controller("PieCtrl", function ($scope,$http) {
  $scope.labels = []
  $scope.data = []
  $http.get('/users/Crime/Type').then(function(response){
    //console.log(response.data)
    for (var i = 0; i < response.data.length; i++) {

      $scope.labels.push(response.data[i]._id.type.name)
      $scope.data.push(response.data[i].count)
    }
  })
  //$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  //$scope.data = [300, 500, 100];
});
app.controller('searchCtrl',function($scope,$http,$rootScope){
  $http.get('http://localhost:8080/users/Crime/Type/city').then(function(response){
    citys=[]
    //console.log(response.data)
    $scope.citys=response.data
  })
})
app.controller("declaCtrl",function($scope,$http,$rootScope,$window){
 function getDeclaration(){
   $http.get('/users/allDeclaration').then(function(response){
    console.log(response.data)
    $scope.alldecl =response.data
  })
 }
 getDeclaration()
   $scope.remove = function(id) {
          $http.get('http://localhost:8080/users/delete/Declaration/'+id,{headers:{
            'Authorization' :$rootScope.token
          }})
          .then(function(response){
             $window.alert(response.data.msg);
             //console.log(response.data)
               getDeclaration()
          });

        }
})