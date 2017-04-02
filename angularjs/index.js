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
      template: '<invoices-grid></invoices-grid>'
  })
  .state('setup', {
      url: '/setup',
      template: '<setup-invoices></setup-invoices>',
      requiresAuth: true
  })
  .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginController'
  })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});

app.run(function ($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.requiresAuth && !Auth.isLoggedIn()){
      // User isn’t authenticated
      $state.transitionTo("login");
      event.preventDefault(); 
    }
  });
});


