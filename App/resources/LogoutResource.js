(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("LogoutResource", LogoutResource);

    LogoutResource.$inject = ['$resource', 'global', 'ENV'];

    function LogoutResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'user/logout',{}, {
            save : {
                method          : 'POST',
                transformRequest: function (data) {
                    return global.param(data);
                }
            },
            query: {
                isArray: false
            }
        });
    }
})();