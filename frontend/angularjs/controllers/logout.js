exports.logoutController = function($scope, Auth, $location){
    Auth.logout();
    $location.path('/login');
}