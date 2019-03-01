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


