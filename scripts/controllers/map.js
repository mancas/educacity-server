'use strict';

angular.module('serverEducacityApp')
  .controller('MapCtrl', function ($scope, educacityMapUtil, webMessaging, educacityDB, util, $window) {

    //Set up the map and the events when the view is fully loaded
    $scope.loadMap = function(element_id) {
        window.addEventListener('message', webMessaging.getMessageSync, false);
        educacityMapUtil.initMap($('#' + element_id));
        educacityDB.getDataServer();
    };

    $scope.sities = [];
    $scope.retries = 0;

    $scope.gps = function () {
      var options = { enableHighAccuracy: false, timeout: 5000, maximumAge: 0};
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition($scope.updateUserPosition, $scope.errorPosition, options);
      }
    }

    $scope.updateUserPosition = function (position) {
      if (educacityMapUtil.getUser() != null) {
        //alert('update position ' + position.coords.latitude +' ' + position.coords.longitude);
        var new_position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        educacityMapUtil.updateUserPosition(new_position);
      } else {
        educacityMapUtil.addUser(position);
      }
    }

    $scope.togglePan = function () {
      educacityMapUtil.togglePan();
      $('.followMe').toggleClass('active');
    }

    //While the data is being loaded, the user must see a spinner on the screen to prevent errors
    $scope.$on('LODING_DATA_FROM_SERVER', function (event) {
      $('#loadingModal').modal('show');
    });

    $scope.$on('MAP_LOADED', function (event) {
      $scope.gps();
    });

    $scope.$on('DATA_LOADED', function (event) {
      setTimeout(function () {
        $('#loadingModal').modal('hide');
      }, 1000);
    });

    //After retrieve all data from server, we have to set up the markers on the map
    $scope.$on('DATA_LOADED', function (event, data) {
      $scope.sities = data;
      $scope.sities.forEach(function (obj) {
        educacityMapUtil.addMarker(obj.key);
      });
    });

    //If the request has failed we send the petition again (this is because iris couch its extremely slow)
    $scope.$on('REQUEST_FAILED', function (event) {
      $scope.retries = $scope.retries + 1;
      if ($scope.retries < 2) {
        $window.location = '#/google-map';
      }
    });

    $scope.$on('REQUEST_FAIL', function (event) {
      $('#loadingModal .modal-body p').text('Por favor, reinincie la aplicación. Disculpe las molestias.');
    });

    //This event is fired when the user touch a point of interest
    $scope.$on('REQUESTED_SITE', function (event, siteId) {
      var site = util.getSiteById($scope.sities, siteId);
      //Need to send a message to the parent window with the site info
      webMessaging.sendSiteData(site);
    });
  });
