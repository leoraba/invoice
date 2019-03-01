exports.navBarController = function($scope, Auth) {
    if(Auth.isLoggedIn()){
        $scope.user = Auth.currentUser();
        setTimeout(function() {
        $scope.$emit('NavBarController');
        }, 0);
    }
};