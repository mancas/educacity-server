'use strict';

angular.module('serverEducacityApp')
  .directive('loadingModal', function () {
    return {
      templateUrl: 'views/templates/modal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
