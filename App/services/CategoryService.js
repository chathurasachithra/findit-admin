(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('categoryService', categoryService);

    categoryService.$inject = ['CategoryResource', 'ParentCategoryResource', ];

    function categoryService(CategoryResource, ParentCategoryResource) {

        var categoryService = {
            'addNewCategory'                : addNewCategory,
            'addNewParentCategory'          : addNewParentCategory,
            'getAllPrentCategories'         : getAllPrentCategories,
            'getCategoriesByParentCatId'    : getCategoriesByParentCatId,
            'getAllCategories'              :getAllCategories,
            'deleteParentCategory'          : deleteParentCategory,
            'deleteSubCategory'          : deleteSubCategory
        };

        function addNewCategory(params) {
            return CategoryResource.save(params).$promise;
        }

        function addNewParentCategory(params) {
            return ParentCategoryResource.save(params).$promise;
        }
        
        function deleteParentCategory(params){
            return ParentCategoryResource.delete(params).$promise;
        }

        function deleteSubCategory(params){
            return CategoryResource.delete(params).$promise;
        }

        function getAllPrentCategories() {
            return ParentCategoryResource.query().$promise;
        }

        function getCategoriesByParentCatId(param) {
            return CategoryResource.query(param).$promise;
        }

        function getAllCategories(){
            return CategoryResource.query().$promise;
        }


        return categoryService;

    }
}(window.angular));