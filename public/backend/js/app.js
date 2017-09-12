var app = angular.module("myApp", ["ui.router",'ngCookies','chart.js'])
app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '../admin/view/login.html'
        })   
         .state('home', {
            url: '/home',
            templateUrl: '../admin/view/home.html'
        })
          .state('user', {
            url: '/user',
            templateUrl: '../admin/view/user.html'
        })
          .state('blog',{
            url: '/blog',
            templateUrl:'../admin/view/blog.html'
          })
          .state('ProfileUser', {
            url: '/ProfileUser/:idUser',
            templateUrl: '../admin/view/ProfileUser.html',
             controller:'ProfileUser',
             params: {
                 idUser: null
              }
        })
          .state('setting',{
            url:'/setting',
            templateUrl:'../admin/view/setting.html'
          })

});

 app.run(function($cookies,$rootScope, $state,$location,$window){
     if ($cookies.get('tokenadmin')) {
       $rootScope.token=$cookies.get('tokenadmin');
     }
     else{
       $location.path('/login');
         }
});

app.controller('UserCtrl',function($scope,$http,$rootScope,$location){
     function getALlUser(){
            $http.get('/users/all').then(function(response){
        	console.log(response.data)
        	$scope.Allusers=response.data
        	response.data.forEach(function( user){
        	$http.get('http://localhost:8080/users/postes/'+user._id).then(function(response){
            $scope.postebyUer=response.data
                })
    	})
    })
   }
    getALlUser()
    $scope.bloquee=function(id){
      $http.get('/users/bloquee/'+id).then(function(response){
        console.log(response.data)
         getALlUser()
      })
    }
    $scope.debloquee=function(id){
      $http.get('/users/debloquee/'+id).then(function(response){
        console.log(response.data)
         getALlUser()
      })
    }
})

app.controller('loginCtrl',function($scope,$http,$rootScope,$cookies,$location){
   $scope.admin={};
   $scope.login= function(){
   	    data=$scope.admin
            $http.post('/users/adminLogin',{data}).then(function(response){
    	    if(response.data.success==true){
    	    	  $cookies.put('tokenadmin',response.data.token);
               
                  console.log($rootScope.admin)
                  $location.path('/home');
    	    }
    	    else{
    	    	$location.path('/login');
    	    } 
    })
   }
})
app.controller('logCtrl',function($scope,$rootScope,$cookies,$location){
        $scope.logout=function(){
                $cookies.remove('tokenadmin');
                $rootScope.token=null;
              $location.path('/login'); 
        }
})

app.controller('blogCtrl',function($scope,$rootScope,$cookies,$location,$http){
    function getAllPoste(){
    $http.get('http://localhost:8080/users/allPoste/').then(function(response){
          $scope.allPoste = response.data
          //console.log(response.data)
         
        })
    }
    getAllPoste()
})

app.controller('ProfileUser',function($scope,$http,$stateParams,$rootScope){
  var id=$stateParams.idUser
  //console.log(id)
  $http.get('/users/user/'+id).then(function(response){
    $scope.user=response.data
    //console.log($scope.user)
  })
  $http.get('/users/postes/'+id).then(function(response){
    $scope.posteUser=response.data
   
  })
  console.log($rootScope.admin)
})

app.controller('homeCtrl',function($scope,$http){
    $http.get('/users/numberOfUser').then(function(response){
        $scope.nuber=response.data
        //console.log(response.data)
    })
})
app.controller("PieCtrl", function ($scope,$http) {
    $scope.labels =[]
    $scope.data = []
    $http.get('/users/users/postes').then(function(response){
        //console.log(response.data)
        for (var i = 0; i < response.data.length; i++) {
            $scope.labels.push(response.data[i]._id.type.name)
            $scope.data.push(response.data[i].count)
        }
    })
    
    //$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A'];

  //$scope.data = [[65, 59, 80, 81, 56, 55, 40],[28, 48, 40, 19, 86, 27, 90]];
});
app.controller("PieCtrl1", function ($scope,$http) {
    $scope.labels =[]
    $scope.data = []
     $http.get('/users/users/Declarations').then(function(response){
            console.log(response.data)
                    for (var i = 0; i < response.data.length; i++) 
                    {
                        $scope.labels.push(response.data[i]._id.type.name)
                        $scope.data.push(response.data[i].count)
                    }
    })
    
    //$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.series = ['Series A'];

  //$scope.data = [[65, 59, 80, 81, 56, 55, 40],[28, 48, 40, 19, 86, 27, 90]];
});