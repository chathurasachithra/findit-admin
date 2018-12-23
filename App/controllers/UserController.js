(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('UserController', function ($scope, userService, ngNotify, global) {

        /*
         * $scope functions
         */
        $scope.add_new = add_new;
        $scope.resetAll = resetAll;



        /*
         * add new user and fake merchant record
         */
        function add_new() {

            if ($scope.form_user.$valid) {

                var param = {
                    'username'       : $scope.username,
                    'password'       : $scope.password

                };

                userService.addNewUser(param)
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
                global.show_validation_erros($scope.form_user.$error);
            }
        }

        function resetAll(){
            $scope.username = "";
            $scope.password = "";
        }

    });

})(window.angular);