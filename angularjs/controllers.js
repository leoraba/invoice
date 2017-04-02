exports.NavBarController = function($scope) {

  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};

exports.FooterController = function($scope) {

  setTimeout(function() {
    $scope.$emit('FooterController');
  }, 0);
};

exports.InvoicesGridController = function($scope) {
  $scope.mensaje = "saludos";
};

exports.SetupInvoicesController = function($scope) {
  var days = [];
  for( i = 1 ; i <= 31 ; i++ ){
    days.push(i);
  }
  $scope.days = days;
};

exports.LoginController = function($scope, Auth, $location){
  $scope.credentials = {};
  $scope.login = function(){
    Auth.login($scope.credentials, function(data) {
      if(data.success) {
          $location.path('/');
      } else {
          $scope.error = data.message;
          $scope.dataLoading = false;
      }
    });
  }
};