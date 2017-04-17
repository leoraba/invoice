var controllers = require('./controllers');
var directives = require('./directives');
var auth = require('./authentication');
var _ = require('underscore');

var components = angular.module('mean-invoice.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

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


