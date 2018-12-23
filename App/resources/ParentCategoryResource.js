(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("ParentCategoryResource", ParentCategoryResource);

    ParentCategoryResource.$inject = ['$resource', 'global', 'ENV'];

    function ParentCategoryResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'parent_category/:id',{}, {
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