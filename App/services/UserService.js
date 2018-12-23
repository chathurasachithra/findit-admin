(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('userService', userService);

    userService.$inject = ['UserResource', 'AuthResource', 'LogoutResource'];

    function userService(UserResource, AuthResource, LogoutResource) {

        var userService = {
            'addNewUser' : addNewUser,
            'login'      : login,
            'logout'     : logout
        };

        function addNewUser(params) {
            return UserResource.save(params).$promise;
        }
        
        function login(params){
            return AuthResource.save(params).$promise;
        }

        function logout(params){
            return LogoutResource.save(params).$promise;
        }

        
        return userService;

    }
}(window.angular));