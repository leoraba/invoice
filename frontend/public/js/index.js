(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
                if(response.data.success == true){
                    $sessionStorage.user = response.data.user;
                    $rootScope.user = $sessionStorage.user;
                    resolve(response.data);
                }else{
                    resolve({success: false, message: 'User and/or password are incorrect'});
                }
            }, function(response){
                resolve({success: false, message: 'User and/or password are incorrect'});
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

    auth.updateUser = function(user){
        $sessionStorage.user = user;
        $rootScope.user = $sessionStorage.user;
    }
     
 
    return auth;
});
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
exports.footerController = function($scope) {

  setTimeout(function() {
    $scope.$emit('FooterController');
  }, 0);
};
},{}],4:[function(require,module,exports){
exports.invoicesGridController = function($scope, $http, Auth, $location) {
    var myDate = new Date();
    var currentMonth = myDate.getMonth();
    var currentYear = myDate.getFullYear();
  
    $scope.selectMonth = {
        value: currentMonth.toString(),
        choices: ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"]
    };
  
    $scope.selectYear = {
      value: currentYear.toString(),
      choices: [myDate.getFullYear()+1, myDate.getFullYear(), myDate.getFullYear()-1, myDate.getFullYear()-2]
    }
  
    $http.get('/api/categories')
    .then(function (response) {
      if(response.data.success == true){
        $scope.categories = response.data.categories;
      }else{
        Auth.logout();
        $location.path('/login');
      }
    });
  
    $scope.getMyCollection = function(year, month){
      $http.get('/api/collection/' + year + '/' + month)
      .then(function (response) {
        if(response.data.success == true){
          $scope.collectionInvoices = response.data.invoices;
          $scope.collectionReminders = response.data.reminders;
          $scope.totalPending = parseFloat(response.data.pending);
          $scope.totalPaid = parseFloat(response.data.paid);
          $scope.total = ($scope.totalPending + $scope.totalPaid).toFixed(2);
          $scope.categoryCounter = response.data.categoryCounter;
        }else{
          Auth.logout();
          $location.path('/login');
        }
      });
    }
  
    $scope.getMyCollection(currentYear, (parseInt(currentMonth) + 1));
  
    $scope.openInvoiceInit = function(categoryId, reminderId, amount){
      $scope.openInvoice = {};
      $scope.openInvoice.reminderId = reminderId;
      $scope.openInvoice.categoryId = categoryId;
      $scope.openInvoice.month = (parseInt($scope.selectMonth.value) + 1);
      $scope.openInvoice.year = $scope.selectYear.value;
      $scope.openInvoice.amount = amount;
    }
  
    $scope.cleanOpenInvoiceForm = function(){
      $scope.openInvoice = {};
    }
  
    $scope.saveInvoice = function(){
      $http.post('/api/invoice', $scope.openInvoice)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCollection($scope.selectYear.value, (parseInt($scope.selectMonth.value) + 1));
            }
          }else{
            Auth.logout();
            $location.path('/login');
          }
      });
    }
  
    $scope.searchInvoicesByDate = function(){
      $scope.getMyCollection($scope.selectYear.value, (parseInt($scope.selectMonth.value) + 1));
    }
};
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
exports.logoutController = function($scope, Auth, $location){
    Auth.logout();
    $location.path('/login');
}
},{}],7:[function(require,module,exports){
exports.navBarController = function($scope, Auth) {
    if(Auth.isLoggedIn()){
        $scope.user = Auth.currentUser();
        setTimeout(function() {
        $scope.$emit('NavBarController');
        }, 0);
    }
};
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
exports.setupInvoicesController = function($scope, $http, $location, Auth) {
    var days = [];
    for( i = 1 ; i <= 31 ; i++ ){
      days.push(i);
    }
    $scope.days = days;
    $scope.newCategory = {};
    $scope.newReminder = {};
    $scope.categories = {};
    $scope.editReminder = {};
  
    var myDate = new Date();
    var currentMonth = myDate.getMonth();
    var currentYear = myDate.getFullYear();
  
    $scope.selectMonth = {
        value: currentMonth.toString(),
        choices: ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November", "December"]
    };
  
    $scope.selectYear = {
      value: currentYear.toString(),
      choices: [myDate.getFullYear()+1, myDate.getFullYear()]
    }
  
    $scope.selectCategory = function(catId){
      $scope.reminders = {};
      $scope.newReminder.categoryId = catId;
      $http.get('/api/reminders/category/' + catId )
      .then(function (response) {
        if(response.data.success == true) {
          $scope.reminders = response.data.reminders;
        }else{
          Auth.logout();
          $location.path('/login');
        }
      });
    }
  
    $scope.getMyCategories = function(){
      $http.get('/api/categories/onlyactive')
      .then(function (response) {
        if(response.data.success == true){
          $scope.categories = {};
          $scope.categories.categories = response.data.categories;
        }else{
          Auth.logout();
          $location.path('/login');
        }
      });
    }
  
    $scope.getMyCategories();
    
    //delete category
    $scope.deleteCat = function(catId){
      $http.delete('/api/category/' + catId)
      .then(function (response) {
        if(response.data.success == true){
          $scope.getMyCategories();
        }else{
          Auth.logout();
          $location.path('/login');
        }
      });
    }
  
    //save new category
    $scope.saveNewCategory = function(){
      $http.post('/api/category', $scope.newCategory)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCategories();
            }
          } else {
            Auth.logout();
            $location.path('/login');
          }
      });
      $scope.newCategory = {};
    }
  
    $scope.cleanNewCategoryForm = function(){
      $scope.newCategory = {};
    }
  
    //save new reminder
    $scope.saveNewReminder = function(){
      $http.post('/api/reminder', $scope.newReminder)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCategories();
            }
          } else {
            Auth.logout();
            $location.path('/login');
          }
      });
      var categoryId = $scope.newReminder.categoryId;
      $scope.newReminder = {};
      $scope.newReminder.categoryId = categoryId;
    }
  
    //Remove reminder
    $scope.removeReminder = function($reminderId){
      $http.delete('/api/reminder/' + $reminderId)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCategories();
            }
          } else {
            Auth.logout();
            $location.path('/login');
          }
      });
    }
  
    //Open Edit reminder Modal
    $scope.openEditReminderModal = function($reminderId){
      $scope.reminders.forEach(reminder => {
        if(reminder._id == $reminderId){
          $scope.editReminder.reminderId = reminder._id;
          $scope.editReminder.title = reminder.title;
          $scope.editReminder.lastDay = reminder.lastDayToPay.toString();
          $scope.editReminder.beginMonth = reminder.beginMonth.toString();
          $scope.editReminder.beginYear = reminder.beginYear.toString();
          $scope.editReminder.aproxAmount = reminder.aproxAmount;
          $scope.editReminder.note = reminder.note;
        }
      });
    }
  
    //Edit reminder
    $scope.submitEditReminder = function(){
      $http.put('/api/reminder' , $scope.editReminder)
      .then(function (response) {
          if(response.data.success == true) {
            if(response.data.message){
              $scope.error = response.data.message;
              $scope.dataLoading = false;
            }else{
              $scope.getMyCategories();
            }
          } else {
            Auth.logout();
            $location.path('/login');
          }
      });
  
      $scope.editReminder = {};
    }
  
    $scope.cleanNewReminderForm = function(){
      var categoryId = $scope.newReminder.categoryId;
      $scope.newReminder = {};
      $scope.newReminder.categoryId = categoryId;
    }
  
    $scope.cleanEditReminderForm = function(){
      var categoryId = $scope.editReminder.categoryId;
      $scope.editReminder = {};
      $scope.editReminder.categoryId = categoryId;
    }    
};
},{}],10:[function(require,module,exports){
exports.footerBar = function() {
    return {
      controller: 'FooterController',
      templateUrl: '../templates/footer_bar.html'
    };
};
},{}],11:[function(require,module,exports){
exports.navBar = function() {
    return {
      controller: 'NavBarController',
      templateUrl: '../templates/nav_bar.html'
    };
};
},{}],12:[function(require,module,exports){
var auth = require('./authentication');
//controlers
var { navBarController } = require('./controllers/navBar');
var { footerController } = require('./controllers/footer');
var { invoicesGridController } = require('./controllers/invoicesGrid');
var { setupInvoicesController } = require('./controllers/setupInvoices');
var { loginController } = require('./controllers/login');
var { registerController } = require('./controllers/register');
var { configurationController } = require('./controllers/configuration');
var { logoutController } = require('./controllers/logout');

//directives
var { footerBar } = require('./directives/footerBar');
var { navBar } = require('./directives/navBar');

var components = angular.module('mean-invoice.components', ['ng']);

components.controller('NavBarController', navBarController);
components.controller('FooterController', footerController);
components.controller('InvoicesGridController', invoicesGridController);
components.controller('SetupInvoicesController', setupInvoicesController);
components.controller('LoginController', loginController);
components.controller('RegisterController', registerController);
components.controller('ConfigurationController', configurationController);
components.controller('LogoutController', logoutController);

components.directive('footerBar', footerBar);
components.directive('navBar', navBar);

var app = angular.module('mean-invoice', ['mean-invoice.components', 'ui.router', 'ui.materialize', 'AuthService']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
      url: '/',
      controller: 'InvoicesGridController',
      templateUrl: '../templates/invoices_grid.html',
      requiresAuth: true
  })
  .state('setup', {
      url: '/setup',
      controller: 'SetupInvoicesController',
      templateUrl: '../templates/setup_invoices.html',
      requiresAuth: true
  })
  .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginController'
  })
  .state('register', {
      url: '/register',
      templateUrl: '../templates/register.html',
      controller: 'RegisterController'
  })
  .state('configuration', {
      url: '/configuration',
      templateUrl: '../templates/configuration_user.html',
      controller: 'ConfigurationController'
  })
  .state('logout', {
      url: '/logout',
      controller: 'LogoutController'
  })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

app.run(function ($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    
    if(toState.name == "login" && Auth.isLoggedIn()){
      // user is already logged in redirect to home
      event.preventDefault();
      $state.go('home');
    }
    
    if (toState.requiresAuth && !Auth.isLoggedIn()){
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault(); 
    }
  });
});



},{"./authentication":1,"./controllers/configuration":2,"./controllers/footer":3,"./controllers/invoicesGrid":4,"./controllers/login":5,"./controllers/logout":6,"./controllers/navBar":7,"./controllers/register":8,"./controllers/setupInvoices":9,"./directives/footerBar":10,"./directives/navBar":11}]},{},[12]);
