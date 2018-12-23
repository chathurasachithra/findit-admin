(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('ParentCategoryController', function ($scope, categoryService, $rootScope,  global, ngNotify) {

        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;



        /*
         * add new user and fake merchant record
         */
        function add_new() {

            if ($scope.form_parent_category.$valid) {

                var param = {
                    'name'          : $scope.name,
                    'icon'          : $scope.icon

                };

                categoryService.addNewParentCategory(param)
                    .then(function (data) {
                        after();
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
                global.show_validation_erros($scope.form_parent_category.$error);
            }
        }

        function after(){
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    angular.forEach(data.parent_categories, function (val) {
                        if(val.parent_category_name == 'Company'){
                            $rootScope.company_category_id = val.parent_category_id;
                        }
                    })
                });
        }

        function resetAll(){
            $scope.name = '';
            $scope.icon = '';
        }

    });

})(window.angular);