(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('CompanyController', function ($rootScope, $state, $scope, companyService, ngNotify,global,
                                                  categoryService, ENV, NgMap, Storage) {

        $scope.loc = "Colombo";
        $scope.latitude = null;
        $scope.longitude = null;
        $scope.baseUrl = ENV.base_url;
        $scope.user = Storage.get('user');
        $scope.listAvailable = false;
        if ($scope.user && $scope.user.user_id && $scope.user.user_id == 1) {
          $scope.listAvailable = true;
        }

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

        /*
         * Run time functions
         */
        getAllCompanyCategories();
        getAllCompanies();

        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;
        $scope.deleteSubCategory = deleteSubCategory;
        $scope.edit             = edit;
        
        function edit($index) {
            companyService.setSeletectedCompany($index);
            $state.go('/edit_company');
        }


        function getAllCompanies(){
            companyService.getAllCompanies()
                .then(function (data) {
                    $scope.companies = data.companies;
                })
        }


        function deleteSubCategory($index){
            companyService.deleteCompany({id : $index})
                .then(function (data) {
                    getAllCompanies();
                    ngNotify.set('Record deleted!', {
                        type: 'success',
                        theme: 'primary',
                        duration: 2000
                    });
                })
                .catch(function (data) {
                    ngNotify.set('Error while loading parent categories!', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                    });
                });
        }


        function getAllCompanyCategories(){
            categoryService.getCategoriesByParentCatId({parent_category_id :$rootScope.promotion_category_id})
                .then(function (data) {
                    $scope.company_ctegories =data.categories;
            })
                .catch(function (data) {
                    ngNotify.set('Error while loading data!.', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                    });
                })
        }

        /*
         * add new user and fake merchant record
         */
        function add_new() {
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
                    'company_logo'  : $scope.image? $scope.image.name : null,
                    'banner'        : $scope.image_banner? $scope.image_banner.name : null,
                    'category_id'   : $scope.c_cat,
                    'instagram'     : $scope.instagram,
                    'meta_tags'     : $scope.meta_tags,
                    'fake_views'    : $scope.fake_views ? parseInt($scope.fake_views) : parseInt(0) ,
                    'latitude'      : $scope.latitude,
                    'longitude'     : $scope.longitude
                };

                companyService.addNewCompany(param)
                    .then(function (data) {
                        if($scope.image){
                            upload_image(data.company.company_id);
                        }

                        if($scope.image_banner){
                            uploadCompanybanner(data.company.company_id);
                        }

                        ngNotify.set('Successfully added!.', {
                            type: 'success',
                            theme: 'primary',
                            duration: 2000
                        });
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
                    uploadCompanybanner(company_id);
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

        function uploadCompanybanner(company_id){
            var data ={
                company_id : company_id
            };
            companyService.uploadCompanyBanner($scope.image_banner, data).then(function (data) {});
        }
        
        function resetAll(){
            $scope.c_cat = "";
            $scope.name = "";
            $scope.desc = "";
            $scope.tel1 = "";
            $scope.tel2 = "";
            $scope.tel2 = "";
            $scope.address = "";
            $scope.email = "";
            $scope.website = "";
            $scope.fb = "";
            $scope.twitter = "";
            $scope.linkedin = "";
            $scope.youtube = "";
            $scope.image = null;
            $scope.instagram = '';
            $scope.fake_views = '';
            $scope.meta_tags = '';
        }

    });

})(window.angular);