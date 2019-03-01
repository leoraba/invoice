exports.loginController = function($scope, Auth, $location){
    $scope.credentials = {};
  
    $scope.login = function(){
      if($scope.credentials.username == undefined || $scope.credentials.password == undefined){
        $scope.error = "User and/or password are incorrect";
        $scope.dataLoading = false;
      }else{
        Auth.login($scope.credentials, function(data) {
          if(data.success == true) {
              $location.path('/');
          } else {
              $scope.error = data.message;
              $scope.dataLoading = false;
          }
        });
      }
    }
};