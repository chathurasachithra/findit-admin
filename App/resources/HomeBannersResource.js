(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("HomeBannersResource", CompanyResource);

    CompanyResource.$inject = ['$resource', 'global', 'ENV'];

    function CompanyResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'home-banners/:id',{}, {
            save : {
                method          : 'POST',
                transformRequest: function (data) {
                    return global.param(data);
                }
            },
            update: {
                method: 'PUT',
                isArray: false
            },
            delete: {
                method: 'DELETE',
                params: {
                    id: '@id'
                }
            },
            get: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            query: {
                isArray: false
            }
        });
    }
})();