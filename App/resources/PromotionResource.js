(function (angular) {
    'use strict';

    angular.module('app')
        .factory("PromotionResource", PromotionResource);

    PromotionResource.$inject = ['$resource', 'global', 'ENV'];

    function PromotionResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'promotion/:id', {}, {
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
            query: {
                isArray: false
            }
        });
    }
})(window.angular);