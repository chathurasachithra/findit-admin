(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("AuthResource", AuthResource);

    AuthResource.$inject = ['$resource', 'global', 'ENV'];

    function AuthResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'user/auth',{}, {
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