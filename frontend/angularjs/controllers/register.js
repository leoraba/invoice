exports.registerController = function($scope, $http, $location, Auth){
    $scope.user = {};
  
    $scope.register = function(){
      if($scope.user.name == undefined || $scope.user.email == undefined || $scope.user.password == undefined || $scope.user.password2 == undefined){
        $scope.error = "All fields are required";
        $scope.dataLoading = false;
      }else if($scope.user.password != $scope.user.password2){
        $scope.error = "Passwords don't match";
        $scope.dataLoading = false;
      }else{
        $http.post('/api/register', $scope.user)
        .then(function (response) {
            if(response.data.success == true) {
              if(response.data.message){
                $scope.error = response.data.message;
                $scope.dataLoading = false;
              }else{
                $location.path('/login');
              }
            } else {
              Auth.logout();
              $location.path('/login');
            }
        });
      }
    };
}