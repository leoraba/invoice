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