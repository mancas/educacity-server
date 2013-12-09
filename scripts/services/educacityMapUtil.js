'use strict';

angular.module('serverEducacityApp')
  .service('educacityMapUtil', function educacityMapUtil($window, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var sites = [];
    var map;
    var user = null;
    var default_location = { latitude : 40.422383, longitude : -3.706627 };
    var mapElement;
    var user_location;
    var panActive = true;

    this.initMap = function (element) {
        if ($window.google && $window.google.maps) {
            var location = new google.maps.LatLng(default_location.latitude, default_location.longitude);
            var mapOptions = {
                zoom: 18,
                center: location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            mapElement = element;

            if (mapElement instanceof jQuery)
                mapElement = mapElement.get(0);

            map = new google.maps.Map(mapElement, mapOptions);

            $rootScope.$broadcast('MAP_LOADED');
        }
    },

    this.addMarker = function (data) {
        var marker;

        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(data.latitude, data.longitude),
            title : data.title
        });

        sites.push({siteId : data._id, markerId : marker.__gm_id});

        google.maps.event.addListener(marker, 'click', function (event) {
            var requestMarkerId = this.__gm_id;
            var siteId;

            for (var i in sites) {
                if (sites[i].markerId == requestMarkerId) {
                    siteId = sites[i].siteId;
                    break;
                }
            }

            $rootScope.$broadcast('REQUESTED_SITE', siteId);
        });
    },

    this.addUser = function (position) {
        var icon = 'https://maps.google.com/mapfiles/kml/shapes/man.png';

        var marker;
        var userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        marker = new google.maps.Marker({
            map: map,
            position: userPosition,
            title :'Tú',
            icon : icon
        });

        user = marker;
        map.panTo(userPosition);
        user_location = userPosition;
    },

    this.updateUserPosition = function (position) {
        user.setPosition(position);
        user_location = position;
        if (panActive)
            map.panTo(position);
    },

    this.togglePan = function () {
        panActive = !panActive;
        if (panActive && user_location)
            map.panTo(user_location);
    },

    this.getUser = function () {
        return user;
    }
  });
