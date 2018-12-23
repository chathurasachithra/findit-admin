(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('promotionService', promotionService);
    
    var promo = null;

    promotionService.$inject = ['PromotionResource', 'Upload', '$q','ENV', 'PartnerCompaniesResource'];

    function promotionService(PromotionResource, Upload, $q, ENV, PartnerCompaniesResource) {

        var promotionService = {
            'addNewPromotion' : addNewPromotion,
            'uploadPromotionImage' : uploadPromotionImage,
            'addPartnerCompany' : addPartnerCompany,
            'get'               : get,
            'deleteP'              : deleteP,
            'setPromo'          : setPromo,
            'getPromo': getPromo,
            'updatePromo': updatePromo
        };
        
        function setPromo(param) {
            promo = param;
        }
        
        function getPromo() {
            return promo
        }
        
        function get(params){
            return PromotionResource.query(params).$promise;
        }
        
        function updatePromo(pid, param) {
            return PromotionResource.update({'id': pid}, param).$promise;
        }
        
        function deleteP(param){
            return PromotionResource.delete(param).$promise;
        }

        function addNewPromotion(params) {
            return PromotionResource.save(params).$promise;
        }

        function addPartnerCompany(params) {
            console.log(params);
            return PartnerCompaniesResource.save(params).$promise;
        }

        function uploadPromotionImage(promotion_image,data){
            var deferred = $q.defer();
            // upload on file select or drop
            Upload.upload({
                url : ENV.base_url + 'promotion/image',
                data: {promotion_image: promotion_image, data: data}

            }).then(function (resp) {
                deferred.resolve(resp.data);

            }, function (resp) {
                deferred.reject(resp);
            });

            return deferred.promise;
        }


        return promotionService;

    }
}(window.angular));