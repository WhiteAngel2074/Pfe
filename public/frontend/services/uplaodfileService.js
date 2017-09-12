angular.module('uplaodfileService',[])

.service('uplaodFile',function($http,$rootScope){
	//console.log($rootScope.token)
	this.upload=function(file){
      var fd=new FormData(); 
      fd.append('myfile',file.upload);
     return $http.post('http://localhost:8080/users/api/photo',fd,{
      	transformRequest:angular.identity,
      	headers:{
          'content-type':undefined,
           'Authorization':$rootScope.token
            }


      });


	};
     

});