(function (angular) {
    'use strict';

    var app = angular.module('app');

    app.controller('AuthController', function ($scope, userService, ngNotify, $state, Storage, $location) {



        console.log($location.path());

        /*
         * Direct to dashboard if user already logged on the same device
         * */
        if($location.path() != '/logout' && Storage.get('user') && Storage.get('token') && Storage.get('logged') ){
            $state.go('/dashboard');
        }


        /*
         * $scope functions
         */
        $scope.login = login;
        $scope.logout = logout;



        /*
         * add new user and fake merchant record
         */
        function login() {
            var param = {
                'user_name'       : $scope.username,
                'password'       : $scope.password

            };

            userService.login(param)
                .then(function (data) {
                    ngNotify.set('Login success!.', {
                        type: 'success',
                        theme: 'primary',
                        duration: 2000
                    });
                    if(Storage.get('user') && Storage.get('token') && Storage.get('logged')){
                        Storage.update('user', data.user);
                        Storage.update('token', data.token);
                        Storage.update('logged', true);
                    }
                    else{
                        Storage.set('user', data.user);
                        Storage.set('token', data.token);
                        Storage.set('logged', true);
                    }

                    $state.go('/dashboard');
                })
                .catch(function (data) {
                    ngNotify.set('Invalid user credentials!', {
                        type: 'error',
                        theme: 'primary',
                        duration: 2000
                    });
                });
        }

        function logout(){

            Storage.delete_x('user');
            Storage.delete_x('token');
            Storage.delete_x('logged');
            $state.go('/');
        }

    });

})(window.angular);