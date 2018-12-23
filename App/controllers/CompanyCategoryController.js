(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('CompanyCategoryController', function ($scope, global,$rootScope,  categoryService, ngNotify, ENV) {


        /**
         *  $scope variables
         */
        $scope.options = {
            autoSelect: true,
            boundaryLinks: true,
            pageSelector: true,
            rowSelection: false
        };
        $scope.query = {
            order: 'role.name',
            limit: 5,
            page: 1
        };
        $scope.count = 0;
        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;
        $scope.deleteSubCategory = deleteSubCategory;

        getAllCompanyCategories();


        function deleteSubCategory($index){
            categoryService.deleteSubCategory({id : $index})
                .then(function (data) {
                    getAllCompanyCategories();
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
                    $scope.count = $scope.company_ctegories.length;
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
            if ($scope.form_company_category.$valid) {
                var param = {
                    'category_name'          : $scope.name,
                    'parent_category_id'     : $rootScope.company_category_id,
                    'icon'     : $scope.icon

                };

                categoryService.addNewCategory(param)
                    .then(function (data) {
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
                global.show_validation_erros($scope.form_company_category.$error);
            }
        }

        function resetAll(){
            $scope.name = '';
            $scope.icon ='';
            $scope.p_cat = null;
        }

    });

})(window.angular);