(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('ViewAllParentCategoryController', function ($scope, categoryService, global, ngNotify) {

       
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


        $scope.deleteParentCategory = deleteParentCategory;

        getAllParentCategories();
        
        function getAllParentCategories(){
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    $scope.parent_categories = data.parent_categories;
                    $scope.count = $scope.parent_categories.length;
                }).catch(function (data) {
                ngNotify.set('Error while loading parent categories!', {
                    type: 'error',
                    theme: 'primary',
                    duration: 2000
                });
            })
        }      
        
        function deleteParentCategory($index){
            categoryService.deleteParentCategory({id : $index})
                .then(function (data) {
                    getAllParentCategories();
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