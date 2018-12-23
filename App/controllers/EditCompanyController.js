(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('EditCompanyController', function ($rootScope, $state, $scope, companyService, ngNotify,global, categoryService, ENV) {


        first();

        $scope.cat_msg = "Current";
        $scope.comp_msg= "Current";
        
        var cat_id;
        var cid;
        var logo;

        $scope.loc = "Colombo";
        $scope.latitude = null;
        $scope.longitude = null;

        $scope.center = ['6.93150919567677', '79.84244607922369'];
        $scope.latlng = ['6.93150919567677', '79.84244607922369'];
        $scope.getpos = function (event) {
            $scope.latitude = event.latLng.lat();
            $scope.longitude = event.latLng.lng();
            $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        };

        $scope.placeMarker = function(){
            var loc = this.getPlace().geometry.location;
            $scope.latlng = [loc.lat(), loc.lng()];
            $scope.center = [loc.lat(), loc.lng()];
            $scope.latitude = loc.lat();
            $scope.longitude = loc.lng();
        };

        $scope.resetAll = resetAll;
        $scope.update   = update;

       function first() {
           companyService.getAllCompanies({id : companyService.getSelectedCompanyEdit()})
               .then(function (data) {

                   cid                                 = data.companies[0].company_id;
                   logo                                = data.companies[0].company_logo;
                   $scope.name                         = data.companies[0].company_name;
                   $scope.desc                         = data.companies[0].company_description;
                   $scope.tel1                         = data.companies[0].company_tel1;
                   $scope.tel2                         = data.companies[0].company_tel2;
                   $scope.address                      = data.companies[0].company_address;
                   $scope.email                        = data.companies[0].company_email;
                   $scope.website                      = data.companies[0].company_website;
                   $scope.fb                           = data.companies[0].company_fb;
                   $scope.twitter                      = data.companies[0].company_twitter;
                   $scope.linkedin                     = data.companies[0].company_linkedin;
                   $scope.youtube                      = data.companies[0].company_youtube;
                   $scope.status                       = data.companies[0].status;
                   $scope.instagram                    = data.companies[0].company_instagram;
                   $scope.meta_tags                    = data.companies[0].meta_tags;
                   $scope.latitude                     = data.companies[0].company_latitude;
                   $scope.longitude                    = data.companies[0].company_longitude;
                   $scope.fake_views                   = data.companies[0].company_unique_views ? parseInt(data.companies[0].company_unique_views) : parseInt(0);
                   $scope.real_views                   = data.companies[0].company_views ? parseInt(data.companies[0].company_views) : parseInt(0);
                   $scope.logo                         = "http://api.findit.lk/images/companies/" + data.companies[0].company_id + "/" + data.companies[0].company_logo;

                   if ($scope.latitude > 0 && $scope.longitude > 0) {
                       $scope.latlng = [$scope.latitude, $scope.longitude];
                       $scope.center = [$scope.latitude, $scope.longitude];
                   }
                   cat_id = data.companies[0].category_id;
                   getAllCompanyCategories(data.companies[0].category_id);
               })
       }

        function getAllCompanyCategories(param){
            categoryService.getCategoriesByParentCatId({parent_category_id :$rootScope.promotion_category_id})
                .then(function (data) {
                    $scope.company_ctegories =data.categories;
                    angular.forEach(data.categories, function (val) {
                        if(val.category_id == param){
                            $scope.comp_cat_current = val.category_name;
                        }
                    })
                })
                .catch(function (data) {
                    ngNotify.set('Error while loading data!.', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                    });
                })
        }

        function resetAll() {
            $scope.image =null;
            $scope.c_cat ='';
            $scope.cat_msg = "Current";
            $scope.comp_msg= "Current";
            //first();
        }

        /*
         * add new user and fake merchant record
         */
        function update() {
            if ($scope.from_company.$valid) {

                var param = {
                    'name'          : $scope.name,
                    'desc'          : $scope.desc ? $scope.desc : null,
                    'tel1'          : $scope.tel1? $scope.tel1 : null,
                    'tel2'          : $scope.tel2? $scope.tel2 : null,
                    'address'       : $scope.address? $scope.address : null,
                    'email'         : $scope.email? $scope.email : null,
                    'website'       : $scope.website? $scope.website : null,
                    'fb'            : $scope.fb? $scope.fb : null,
                    'twitter'       : $scope.twitter? $scope.twitter : null,
                    'linkedin'      : $scope.linkedin? $scope.linkedin : null,
                    'youtube'       : $scope.youtube? $scope.youtube : null,
                    'company_logo'  : $scope.image? $scope.image.name : logo,
                    'banner'        : $scope.image_banner? $scope.image_banner.name : null,
                    'category_id'  : $scope.c_cat ?$scope.c_cat :  cat_id,
                    'instagram'    : $scope.instagram,
                    'meta_tags'    : $scope.meta_tags,
                    'fake_views'    : $scope.fake_views,
                    'latitude'      : $scope.latitude,
                    'longitude'     : $scope.longitude,
                    'status'        : $scope.status

                };

                companyService.updateCompany(cid, param)
                    .then(function (data) {
                        if($scope.image){
                            upload_image(cid);
                        }

                        ngNotify.set('Successfully added!.', {
                            type: 'success',
                            theme: 'primary',
                            duration: 2000
                        });
                        if($scope.image_banner){
                            uploadCompanybanner(cid);
                        }
                        resetAll();
                    })
                    .catch(function (data) {
                        ngNotify.set('Error while adding data!.', {
                            type: 'error',
                            theme: 'primary',
                            duration: 2000
                        });
                    });

            } else{
                global.show_validation_erros($scope.from_company.$error);
            }
        }

        function uploadCompanybanner(company_id){
            var data ={
                company_id : company_id
            };
            companyService.uploadCompanyBanner($scope.image_banner, data).then(function (data) {});
        }

        function upload_image(company_id){
            var data ={
                company_id : company_id
            };
            companyService.uploadCompanyLogo($scope.image, data).then(function (data) {
                ngNotify.set('Successfully added!.', {
                    type: 'success',
                    theme: 'primary',
                    duration: 2000
                });
                if($scope.image_banner){
                    uploadCompanybanner(cid);
                }
                resetAll();
            }).catch(function (data) {
                ngNotify.set('Error while uploading image!.', {
                    type: 'error',
                    theme: 'primary',
                    duration: 2000
                });

            });
        }

    });

})(window.angular);