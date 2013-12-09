'use strict';

angular.module('serverEducacityApp')
  .service('webMessaging', function webMessaging(educacityMapUtil) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var origin = '*';
    var source = window.parent;
    var sync = true;

    this.getMessageSync = function (event) {
        if (!origin || !source || !sync) {
            origin = event.origin;
            source = event.source;
            sync = event.data;
        }
    }

    this.sendSiteData = function (data) {
        if (sync) {
            source.postMessage(data, origin);
        }
    }
  });
