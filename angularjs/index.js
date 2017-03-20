var controllers = require('./controllers');
var directives = require('./directives');
var _ = require('underscore');

var components = angular.module('mean-invoice.components', ['ng']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

var app = angular.module('mean-invoice', ['mean-invoice.components', 'ngRoute', 'ui.materialize']);

app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      template: '<invoices-grid></invoices-grid>'
    })
    .when('/setup', {
      template: '<setup-invoices></setup-invoices>'
    })
    .otherwise({
        template : "<h1>None</h1><p>Nothing has been selected</p>"
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);
