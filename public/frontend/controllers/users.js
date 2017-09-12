var myApp = angular.module('myApp');

myApp.controller('inscriptionCtrl',['$scope','$http','$location','$routeParams',function($scope,$http,$location,$routeParams){
  $scope.getUsers=function(){
  	$http.get('http://localhost:8080/users/allPoste').success(function(response){
  		$scope.postes=response;
  	})
  }

}])