angular.module('AuthService', ['ngResource', 'ngStorage'])
.factory('Auth', function($resource, $rootScope, $sessionStorage, $q, $http){
      
    var auth = {};
     
    /**
     *  Saves the current user in the root scope
     *  Call this in the app run() method
     */
    auth.init = function(){
        if (auth.isLoggedIn()){
            $rootScope.user = currentUser();
        }
    };
         
    auth.login = function(credentials, resolve){
        $http.post('/api/authenticate', credentials)
            .then(function (response) {
                if(response.data.success){
                    $sessionStorage.user = response.data.user;
                    $rootScope.user = $sessionStorage.user;
                }
                resolve(response.data);
            });
    };
     
 
    auth.logout = function() {
        delete $sessionStorage.user;
        delete $rootScope.user;
    };     
     
    auth.currentUser = function(){
        return $sessionStorage.user;
    };
     
     
    auth.isLoggedIn = function(){
        return $sessionStorage.user != null;
    };
     
 
    return auth;
});