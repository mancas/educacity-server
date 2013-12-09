'use strict';

angular.module('serverEducacityApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/google-map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
