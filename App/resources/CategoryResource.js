(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("CategoryResource", CategoryResource);

    CategoryResource.$inject = ['$resource', 'global', 'ENV'];

    function CategoryResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'category/:id',{}, {
            save : {
                method          : 'POST',
                transformRequest: function (data) {
                    return global.param(data);
                }
            },
            update: {
                method: 'PUT',
                transformRequest: function (data) {
                    return global.param(data);
                }
            },
            delete: {
                method: 'DELETE',
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