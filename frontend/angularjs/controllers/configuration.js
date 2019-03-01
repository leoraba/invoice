exports.configurationController = function($scope, $http, $location, Auth){
    $http.get('/api/me')
    .then(function (response) {
        if(response.data.success == true){
          $scope.user = response.data.user;
        }else{
          Auth.logout();
          $location.path('/login');
        }
    });

    $scope.saveConfiguration = function(){
      if($scope.user.name == undefined){
        $scope.error = "All fields are required";
        $scope.dataLoading = false;
      }else if($scope.user.password != $scope.user.password2 && ($scope.user.password != undefined && $scope.user.password.length > 0)){
        $scope.error = "Passwords don't match";
        $scope.dataLoading = false;
      }else{
        $http.post('/api/me', { name: $scope.user.name, password: $scope.user.password})
        .then(function (response) {
          if(response.data.success == true){
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $http.get('/api/me')
              .then(function (response) {
                  if(response.data.success == true){
                    Auth.updateUser(response.data.user);
                    $location.path('/');
                  }else{
                    Auth.logout();
                    $location.path('/login');
                  }
              });
            }
          }
        });
      }
    }
}