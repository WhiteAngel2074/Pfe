 $scope.update=function(){
        console.log($scope.currentUser)
      }
      $scope.getImag=function(){
        $http.get('http://localhost:8080/users/uploads/'+$rootScope.currentUser.id).success(function (files){
        $scope.img = files;
        console.log(files)
    });
      }