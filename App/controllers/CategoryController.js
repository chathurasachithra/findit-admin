(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('CategoryController', function ($scope, categoryService, ngNotify, global) {

        /*
         * Run time functions
         * */
        getAllParentCategories();

        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;


        function getAllParentCategories(){
            categoryService.getAllPrentCategories()
                .then(function (data) {
                $scope.parent_categories = data.parent_categories;
            }).catch(function (data) {
                ngNotify.set('Error while loading parent categories!', {
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

            if ($scope.from_category.$valid) {

                var param = {
                    'category_name'          : $scope.name,
                    'parent_category_id'     : $scope.p_cat,
                    'icon'                     : $scope.icon

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
                global.show_validation_erros($scope.from_category.$error);
            }
        }
        
        function resetAll(){
            $scope.name = '';
            $scope.icon = '';
            $scope.p_cat = null;
        }

    });

})(window.angular);