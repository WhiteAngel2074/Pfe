    var postApp = angular.module('myApp.controllers', []);
    
    postApp.controller('postController', function($scope, $http, $templateCache) {
        $scope.user = {};
        $scope.submitForm = function() {
          console.log($scope.user);
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
              console.log(response);
            })
            .error(function(response) {
                console.log(response);
            });
        }
        
    });