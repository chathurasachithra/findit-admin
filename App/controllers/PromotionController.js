(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('PromotionController', function ($scope,global, $state, $filter, promotionService,
                                                    categoryService,
                                                    companyService, ENV, ngNotify, Storage) {

        getAllParentCategories();
        getAllCompanies();
        getAllPromotions();

        $scope.baseUrl = ENV.base_url;
        $scope.listAvailable = false;
        if ($scope.user && $scope.user.user_id && $scope.user.user_id == 1) {
          $scope.listAvailable = true;
        }

        $scope.enable_categories = true;
        $scope.selected_companies = [];
        $scope.companies2 = [];
        $scope.comp_2 = {};

        $scope.deleteSubCategory = deleteSubCategory;
        $scope.edit_promotion = edit_promotion;

        $scope.user = Storage.get('user');
        $scope.listAvailable = false;
        if ($scope.user && $scope.user.user_id && $scope.user.user_id == 1) {
          $scope.listAvailable = true;
        }

        function edit_promotion($index) {
            promotionService.setPromo($index);
            $state.go('/edit_promotion');
        }

        function deleteSubCategory($index){
            promotionService.deleteP({id : $index})
                .then(function (data) {
                    getAllPromotions();
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
        

        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;
        $scope.getCategories = getCategories;
        $scope.add_company      = add_company;
        $scope.changeDiscount      = changeDiscount;

        function changeDiscount() {
          if ($scope.discount_type == 0) {
            $scope.discount = '';
            $scope.max_amount = '';
            $scope.used_amount = 0;

          }
        }
        
        function getAllPromotions() {
            promotionService.get()
                .then(function (data) {
                    $scope.promotions = data.promotions;
                })
        }
        
        
        function add_company($index){
           if($scope.comp_2){
               $scope.companies2 = [];
               angular.forEach($scope.companies, function (val) {
                  if(val.company_id == $scope.comp_2){
                      $scope.selected_companies.push({
                          id : val.company_id,
                          name : val.company_name
                      });       
                  }else {
                      $scope.companies2.push(val);
                  }
               });
           }
        }


        /*
         * add new user and fake merchant record
         */
        function add_new() {

            if ($scope.form_promotion.$valid) {

                if ($scope.discount_type == '1' && $scope.discount > 100) {
                    alert('Discount percentage cannot be greater than 100%');
                } else {


                  var offer_end = $scope.offer_end_date != null ? new Date($scope.offer_end_date) : null;
                  var expires_in = $scope.expires_in != null ? new Date($scope.expires_in) : null;

                  if ($scope.comp && $scope.comp != 999999) {
                    $scope.comp_text = null;
                  }

                  var param = {
                    'promotion_name': $scope.name,
                    'promotion_description': $scope.desc,
                    'promotion_image': $scope.image.name,
                    'promotion_is_featured': $scope.is_featured ? true : false,
                    'category_id': $scope.cat,
                    'company_id': $scope.comp,
                    'company_text': $scope.comp_text,
                    'meta_tags': $scope.meta_tags,
                    'date': $scope.date,
                    'time': $scope.time,
                    'venue': $scope.venue,
                    'reservations': $scope.reservations,
                    'discount_type': $scope.discount_type,
                    'max_amount': $scope.max_amount,
                    'used_amount': $scope.used_amount,
                    'discount': $scope.discount,
                    'discount_conditions': $scope.discount_conditions,
                    'expires_in': $filter('date')(expires_in, 'yyyy-MM-dd'),
                    'offer_end': $filter('date')(offer_end, 'yyyy-MM-dd'),
                    'fake_views': $scope.fake_views ? $scope.fake_views : 0
                  };

                  console.log(param);

                  promotionService.addNewPromotion(param)
                    .then(function (data) {
                      upload_image(data.promotion.promotion_id, data.promotion.promotion_image);
                    })
                    .catch(function (data) {
                      ngNotify.set('Error while adding data!.', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                      });
                    });
                }
                
            } else{
                global.show_validation_erros($scope.form_promotion.$error);
            }
        }
        
        function getAllCompanies(){
              var param = {
                type   : 1,
              };
            companyService.getAllCompanies(param)
                .then(function (data) {
                    $scope.companies = data.companies;

                    angular.forEach(data.companies, function (val) {
                        $scope.companies2.push(val);
                    })
                })
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

        function upload_image(promotion_id, promotion_image_name){
            var data ={
                promotion_id : promotion_id,
                file_name : promotion_image_name
            };
            promotionService.uploadPromotionImage($scope.image, data).then(function (data) {
                if($scope.selected_companies.length > 0){
                    angular.forEach($scope.selected_companies, function (val) {
                        addPartnerCompanies(promotion_id, val.id);
                    });
                }else{
                    ngNotify.set('Successfully added!.', {
                        type: 'success',
                        theme: 'primary',
                        duration: 2000
                    });
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

        function addPartnerCompanies(promotion_id, company_id){
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
        }
        
        function resetAll(){
            $scope.P_cat = "";
            $scope.name = "";
            $scope.desc = "";
            $scope.image = null;
            $scope.is_featured = "";
            $scope.cat = "";
            $scope.date = "";
            $scope.time = "";
            $scope.venue = "";
            $scope.reservations = "";
            $scope.comp = "";
            $scope.comp_text = "";
            $scope.meta_tags = "";
            $scope.offer_end_date = null;
            $scope.selected_companies = [];
            $scope.companies2 = [];
            $scope.discount_type = '0';
            $scope.discount = '';
            $scope.max_amount = '';
            $scope.discount_conditions = '';
            $scope.used_amount = 0;
            getAllCompanies();
        }

    });

})(window.angular);