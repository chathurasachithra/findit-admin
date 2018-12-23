(function (angular) {
  'use strict';

  var app = angular.module('app');

  app.controller('CompanyPromoController', function ($rootScope, $state, $scope, companyService, ngNotify,
                                                     global, categoryService, ENV, NgMap, $stateParams) {

    $scope.companySlug = $stateParams.company;
    $scope.company_id = null;
    $scope.promoImagePath = ENV.company_promo_path;
    function getCompanyPromos(id){
      companyService.getSelectedCompany({id : id})
        .then(function (data) {
          if (data.companies && data.companies[0]) {
            $scope.company = data.companies[0];
            $scope.promo_videos = data.videos;
            $scope.images = data.images;
            $scope.company_id = $scope.company.company_id;
          } else {
            ngNotify.set('Incorrect company.', {
              type: 'error',
              theme: 'primary',
              duration: 2000
            });
          }
        })
        .catch(function (data) {
          ngNotify.set('Error while company promotion page.', {
            type: 'error',
            theme: 'primary',
            duration: 2000
          });
        });
    };
    getCompanyPromos($scope.companySlug);

    $scope.description = '';
    $scope.title = '';
    $scope.addPhoto = function(){
        if ($scope.promo_image) {
          var data ={
            company_id : $scope.company_id,
            description : $scope.description,
            title : $scope.title
          };
          companyService.uploadPromoImage($scope.promo_image, data).then(function (data) {
            ngNotify.set('Successfully added!.', {
              type: 'success',
              theme: 'primary',
              duration: 2000
            });
            $scope.promo_image = '';
            $scope.description = '';
            $scope.title = '';
            getCompanyPromos($scope.companySlug);
          }).catch(function (data) {
            ngNotify.set('Error while uploading image!.', {
              type: 'error',
              theme: 'primary',
              duration: 2000
            });

          });
        } else {
          ngNotify.set('Please choose an image.', {
            type: 'error',
            theme: 'primary',
            duration: 2000
          });
        }
    };

    $scope.addVideos = function(){

      var param = {
        'videos'        : $scope.promo_videos
      };
      companyService.uploadPromoVideo($scope.company_id, param)
        .then(function (data) {

          ngNotify.set('Video list successfully saved!.', {
            type: 'success',
            theme: 'primary',
            duration: 2000
          });
          getCompanyPromos($scope.companySlug);
        })
        .catch(function (data) {
          ngNotify.set('Error while adding data!.', {
            type: 'error',
            theme: 'primary',
            duration: 2000
          });
        });
    };

    $scope.deleteImage = function(image_id){
      companyService.deletePromoImage(image_id)
        .then(function (data) {

          ngNotify.set('Image deleted successfully..', {
            type: 'success',
            theme: 'primary',
            duration: 2000
          });
          getCompanyPromos($scope.companySlug);
        })
        .catch(function (data) {
          ngNotify.set('Error while deleting data!.', {
            type: 'error',
            theme: 'primary',
            duration: 2000
          });
        });
    };

  });

})(window.angular);