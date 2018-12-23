(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('EditPromotionController', function ($rootScope,$filter, $state, $scope,promotionService, Storage,
                                                        companyService, ngNotify,global, categoryService, ENV) {

        first();

        $scope.pcat_msg = "Current";
        $scope.cat_msg = "Current";
        $scope.comp_msg = "Current";
        $scope.img_msg = "Current";

        var pid;
        var cat_id;
        var comp_id;
        //$scope.comp = null;
        var comp_text;
        var logo;

          $scope.user = Storage.get('user');
          $scope.listAvailable = false;
          if ($scope.user && $scope.user.user_id && $scope.user.user_id == 1) {
            $scope.listAvailable = true;
          }

        $scope.coupons = [];
        $scope.selected_companies = [];

        getAllParentCategories();
        getAllCompanies();
        //getPartneredCompanies();

        $scope.getCategories = getCategories;
        $scope.updatePromo = updatePromo;
        $scope.resetAll = resetAll;

        $scope.changeDiscount      = changeDiscount;

        function changeDiscount() {
          if ($scope.discount_type == 0) {
            $scope.discount = '';
            $scope.max_amount = '';
            $scope.used_amount = 0;

          }
        }

        function getCategories(){
            categoryService.getCategoriesByParentCatId({parent_slug: $scope.P_cat})
                .then(function (data) {
                    $scope.categories =data.categories;
                    $scope.enable_categories = false;
                })
                .catch(function (data) {
                    ngNotify.set('Error while loading data!.', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                    });
                })
        }

        function first() {
            promotionService.get({
                slug : promotionService.getPromo()
            }).then(function (data) {
                console.log(data.promotions[0]);
                cat_id = data.promotions[0].category_id;
                comp_id = data.promotions[0].company_id;
                $scope.comp = data.promotions[0].company_id;
                $scope.comp_text = data.promotions[0].company_text;
                $scope.name = data.promotions[0].promotion_name;
                $scope.desc = data.promotions[0].promotion_description;
                $scope.is_featured = data.promotions[0].promotion_is_featured ? true : false;
                $scope.fake_views = data.promotions[0].promotion_unique_views? parseInt(data.promotions[0].promotion_unique_views) : parseInt(0);
                $scope.current_parent_cat = data.promotions[0].parent_category_name;
                $scope.current_cat = data.promotions[0].category_name;
                $scope.current_comp = data.promotions[0].company_name;
                $scope.meta_tags = data.promotions[0].meta_tags;
                $scope.ad_expires = new Date(data.promotions[0].expire_date);
                $scope.offer_end_date = data.promotions[0].offer_end_date ? new Date(data.promotions[0].offer_end_date) : null;
                $scope.real_views = parseInt(data.promotions[0].promotion_views);
                $scope.promo_image = "http://exampleapi.dev/images/promotions/"+ data.promotions[0].promotion_id + "/" + data.promotions[0].promotion_image;
                $scope.date = data.promotions[0].date;
                $scope.time = data.promotions[0].time;
                $scope.venue = data.promotions[0].venue;
                $scope.reservations = data.promotions[0].reservations;
                $scope.discount_type = data.promotions[0].discount_type.toString();
                $scope.discount = data.promotions[0].discount;
                $scope.max_amount = data.promotions[0].max_amount;
                $scope.used_amount = data.promotions[0].used_amount;
                $scope.discount_conditions = data.promotions[0].discount_conditions;
                pid = data.promotions[0].promotion_id;
                logo = data.promotions[0].promotion_image;

                $scope.coupons = data.coupons;
            })
        }

        function getAllParentCategories(){
            $scope.parent_categories = [];
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    angular.forEach(data.parent_categories, function (val) {
                        if(val.parent_category_name != 'Company'){
                            $scope.parent_categories.push(val);
                        }
                    })
                })

            console.log($scope.parent_categories);
        }

        function getAllCompanies(){
            companyService.getAllCompanies()
                .then(function (data) {
                    $scope.companies = data.companies;

                    angular.forEach(data.companies, function (val) {
                        $scope.companies2.push(val);
                    })
                })
        }

        function updatePromo() {

            if ($scope.form_promotion.$valid) {
                var offer_end = $scope.offer_end_date != null ? new Date($scope.offer_end_date) : null;

                if ($scope.comp && $scope.comp!= 999999) {
                  $scope.comp_text = null;
                }

                var param = {
                    'promotion_name'          : $scope.name,
                    'promotion_description'   : $scope.desc,
                    'promotion_image'         : $scope.image ? $scope.image.name : logo ,
                    'promotion_is_featured'   : $scope.is_featured ? true : false,
                    'category_id'             : $scope.cat ? $scope.cat : cat_id,
                    'company_id'              : $scope.comp? $scope.comp : comp_id,
                    'company_text'             : $scope.comp_text? $scope.comp_text : null,
                    'meta_tags'              : $scope.meta_tags? $scope.meta_tags : '',
                    'extend'                  : $scope.expires_in? $scope.expires_in : 0,
                    'offer_end'               : $filter('date')(offer_end, 'yyyy-MM-dd'),
                    'fake_views'              : $scope.fake_views? $scope.fake_views : 0,
                    'date'   : $scope.date,
                    'time'   : $scope.time,
                    'venue'   : $scope.venue,
                    'reservations'   : $scope.reservations,
                    'discount_type': $scope.discount_type,
                    'max_amount': $scope.max_amount,
                    'used_amount': $scope.used_amount,
                    'discount': $scope.discount,
                    'discount_conditions': $scope.discount_conditions,
                };

                console.log(param);

                promotionService.updatePromo(pid, param)
                    .then(function (data) {
                        if($scope.image){
                            upload_image(pid, $scope.image.name);
                        }
                    })
                    .catch(function (data) {
                        ngNotify.set('Error while adding data!.', {
                            type: 'error',
                            theme: 'primary',
                            duration: 2000
                        });
                    });

            } else{
                global.show_validation_erros($scope.form_promotion.$error);
            }
        }

        function upload_image(promotion_id, promotion_image_name){
            var data ={
                promotion_id : promotion_id,
                file_name : promotion_image_name
            };
            promotionService.uploadPromotionImage($scope.image, data).then(function (data) {
                /*if($scope.selected_companies.length > 0){
                    angular.forEach($scope.selected_companies, function (val) {
                        addPartnerCompanies(promotion_id, val.id);
                    });
                }else{

                }*/
                ngNotify.set('Successfully added!.', {
                    type: 'success',
                    theme: 'primary',
                    duration: 2000
                });
                resetAll();
            }).catch(function (data) {
                ngNotify.set('Error while uploading image!.', {
                    type: 'error',
                    theme: 'primary',
                    duration: 2000
                });

            });
        }

        function resetAll() {
            $scope.pcat_msg = "Current";
            $scope.cat_msg = "Current";
            $scope.comp_msg = "Current";
            $scope.img_msg = "Current";
            $scope.image = null;
            first();
        }

      /*  function addPartnerCompanies(promotion_id, company_id){
            console.log(promotion_id);
            console.log(company_id);
            promotionService.addPartnerCompany({
                'promotion_id' : promotion_id,
                'company_id' : company_id
            }).then(function (data) {
                ngNotify.set('Successfully added!.', {
                    type: 'success',
                    theme: 'primary',
                    duration: 2000
                });
                resetAll();
            })
        }*/

        /*/!**
         * Get partner companies
         * *!/
        function getPartneredCompanies() {
            promotionService.get({promotion_id : pid})
                .then(function (data) {
                    $scope.partner_companies = data.partner_companies;
                    
                    angular.forEach(data.partner_companies, function (val) {
                        $scope.selected_companies.push(val);
                    })
                })
        }*/

    });

})(window.angular);