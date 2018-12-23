(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewAllSubCategoryController', function ($scope, categoryService, global, ngNotify) {


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


        $scope.deleteSubCategory = deleteSubCategory;

        getAllSubCategories();

        function getAllSubCategories(){
            categoryService.getAllCategories()
                .then(function (data) {
                    $scope.sub_categories = data.categories;
                    $scope.count = $scope.sub_categories.length;
                }).catch(function (data) {
                ngNotify.set('Error while loading parent categories!', {
                    type: 'error',
                    theme: 'primary',
                    duration: 2000
                });
            })
        }

        function deleteSubCategory($index){
            categoryService.deleteSubCategory({id : $index})
                .then(function (data) {
                    getAllSubCategories();
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

    });

})(window.angular);