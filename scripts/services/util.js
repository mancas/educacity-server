'use strict';

angular.module('serverEducacityApp')
  .factory('util', function () {
    // Service logic

    // Public API here
    return {
      getSiteById: function (objs, siteId) {
        var site;

        for (var i in objs) {
          if (objs[i].key._id == siteId) {
            site = objs[i].key;
            break;
          }
        }

        return site;
      }
    };
  });
