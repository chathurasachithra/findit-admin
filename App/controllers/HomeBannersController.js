(function (angular) {
  'use strict';

  var app = angular.module('app');

  app.controller('HomeBannersController', function ($rootScope, $state, $scope, companyService, ngNotify,
                                                     global, categoryService, ENV, NgMap, $stateParams) {

    $scope.promoImagePath = ENV.home_banners_path;
    function getBanners(){
      companyService.getHomeBanners()
        .then(function (data) {
          if (data.images) {
            $scope.images = data.images;
          } else {
            ngNotify.set('Error while company promotion page.', {
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
    getBanners();

    $scope.url = '';
    $scope.title = '';
    $scope.addPhoto = function(){
        if ($scope.promo_image) {
          var data ={
            url : $scope.url,
            title : $scope.title
          };
          companyService.uploadHomeBanner($scope.promo_image, data).then(function (data) {
            ngNotify.set('Successfully added!.', {
              type: 'success',
              theme: 'primary',
              duration: 2000
            });
            $scope.promo_image = '';
            $scope.url = '';
            $scope.title = '';
            getBanners();
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

    $scope.deleteImage = function(image_id){
      companyService.deleteHomeBanner(image_id)
        .then(function (data) {

          ngNotify.set('Image deleted successfully..', {
            type: 'success',
            theme: 'primary',
            duration: 2000
          });
          getBanners();
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