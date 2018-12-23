(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("UserResource", UserResource);

    UserResource.$inject = ['$resource', 'global', 'ENV'];

    function UserResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'user',{}, {
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