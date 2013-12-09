'use strict';

angular.module('serverEducacityApp')
  .factory('educacityDB', function ($rootScope) {
    var server = 'http://educacity.iriscouch.com/educacity/_design/sites/_view/educacitySites';

    return {
      //Retrieve data from couchBase server
      getDataServer: function () {
        var request;

        request = new XMLHttpRequest({mozSystem : true});
        request.open('GET', server, true);
        request.send();

        $rootScope.$broadcast('LODING_DATA_FROM_SERVER');

        request.onreadystatechange = function () {
          if (request.readyState < 4) { // while waiting response from server
            //$rootScope.$broadcast('LODING_DATA_FROM_SERVER');
          } else {
            if (request.readyState === 4) { // 4 = Response from server has been completely loaded.
              if (request.status == 200 && request.status < 300)  // http status between 200 to 299 are all successful
                $rootScope.$broadcast('DATA_LOADED', JSON.parse(request.response).rows);
            } else {
              $rootScope.$broadcast('DOWNLOADING_REQUEST');
            }
          }
        }

        request.onerror = function () {
          $rootScope.$broadcast('REQUEST_FAIL');
        }
      }
    }
  });
