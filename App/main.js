(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ngResource',
        'ngAria',
        'ngMaterial',
        'md.data.table',
        'ngFileUpload',
        'ngNotify',
        'ngAnimate',
        'angular-loading-bar',
        'ngCookies',
        'ngMessages',
        'ngMap',
        'textAngular'
    ])
        .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, cfpLoadingBarProvider) {

            cfpLoadingBarProvider.includeSpinner  = true;

            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data';

            $locationProvider.html5Mode(true);

            // default route
            $urlRouterProvider.otherwise('/');

            $httpProvider.interceptors.push(function ($window, $rootScope, $q, Storage, ENV, $timeout, $state) {
                return {
                    // Sending Auth Token header for every POST request to validate the user.
                    'request': function (config) {

                        var token = Storage.get('token');

                        if(config.url != ENV.base_url + 'user/auth'){
                            if (token && config.method != 'OPTIONS') {
                                config.headers['Auth-Token'] = token;
                            }
                        }
                        return config;
                    },

                    'responseError': function (responseError) {
                        if (responseError.status == '422') {

                            angular.forEach(responseError.data, function (val, key) {
                                angular.forEach(val, function (v, k) {
                                    $rootScope.$broadcast('errorResponseEvent', {msg: v});
                                });
                            });

                        } else if (responseError.status == '401' || responseError.status == -1) {

                          $rootScope.$broadcast('errorResponseEvent', responseError.data);
                          $timeout(function () {
                            $state.go('/');
                          }, 1000);


                        } else {
                            $rootScope.$broadcast('errorResponseEvent', responseError.data);
                        }

                        return $q.reject(responseError);
                    }
                };
            });

            /*---------------------------------- ROUTES BEGIN ---------------------------------------------------*/
            $stateProvider

                /* login */
                .state('/', {
                    url  : '/',
                    views: {
                        ''            : {templateUrl: 'App/views/login_page.html'},
                    }
                })

                /* logout */
                .state('/logout', {
                    url  : '/logout',
                    views: {
                        ''            : {templateUrl: 'App/views/logout_confirm.html'},
                    }
                })

                /* Dashboard */
                .state('/dashboard', {
                    url  : '/dashboard',
                    views: {
                        ''            : {templateUrl: 'App/views/main_template.html'},
                        'content@/dashboard'   : {templateUrl: 'App/views/dashboard.html'}
                    }
                })

                /* Company categories */
                .state('/company_categories', {
                    url  : '/company_categories',
                    views: {
                        ''            : {templateUrl: 'App/views/main_template.html'},
                        'content@/company_categories'   : {templateUrl: 'App/views/add_new_company_category.html'}
                    }
                })
                
                /* Add new user */
                .state('/add_new_user', {
                url  : '/add_new_user',
                views: {
                    ''                        : {templateUrl: 'App/views/main_template.html'},
                    'content@/add_new_user'   : {templateUrl: 'App/views/add_new_user.html'}
                }
                })
                
                /* Add new company*/
                .state('/add_new_company', {
                    url  : '/add_new_company',
                    views: {
                        ''                        : {templateUrl: 'App/views/main_template.html'},
                        'content@/add_new_company'   : {templateUrl: 'App/views/add_new_company.html'}
                    }
                })

                /* Add company promos*/
                .state('/company_promo', {
                    url  : '/company_promo/:company',
                    views: {
                        ''                        : {templateUrl: 'App/views/main_template.html'},
                        'content@/company_promo'   : {templateUrl: 'App/views/manage_company_promo.html'}
                    }
                })

                /* Manage home banners*/
                .state('/home_banners', {
                    url  : '/home_banners',
                    views: {
                      ''                        : {templateUrl: 'App/views/main_template.html'},
                      'content@/home_banners'   : {templateUrl: 'App/views/manage_home_banners.html'}
                    }
                })

                /* Add new parent category*/
                .state('/add_new_parent_category', {
                    url  : '/add_new_parent_category',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/add_new_parent_category'   : {templateUrl: 'App/views/add_new_parent_category.html'}
                    }
                })

                /* Add new category*/
                .state('/add_new_category', {
                    url  : '/add_new_category',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/add_new_category'   : {templateUrl: 'App/views/add_new_category.html'}
                    }
                })
                    
                /* Add new promotion*/
                .state('/add_new_promotion', {
                    url  : '/add_new_promotion',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/add_new_promotion'   : {templateUrl: 'App/views/add_new_promotion.html'}
                    }
                })
                    
                /* Add new promotion*/
                .state('/view_all_parent_categories', {
                    url  : '/view_all_parent_categories',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/view_all_parent_categories'   : {templateUrl: 'App/views/view_all_parent_categories.html'}
                    }
                })
                    
                /* Add new promotion*/
                .state('/view_all_sub_categories', {
                    url  : '/view_all_sub_categories',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/view_all_sub_categories'   : {templateUrl: 'App/views/view_all_sub_categories.html'}
                    }
                })
                    
                /* Add new promotion*/
                .state('/view_all_comp_categories', {
                    url  : '/view_all_comp_categories',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/view_all_comp_categories'   : {templateUrl: 'App/views/view_all_company_categories.html'}
                    }
                })

                /* Add new promotion*/
                .state('/view_all_companies', {
                    url  : '/view_all_companies',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/view_all_companies'   : {templateUrl: 'App/views/view_all_comapies.html'}
                    }
                })
                /* Add new promotion*/
                .state('/view_all_promotions', {
                    url  : '/view_all_promotions',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/view_all_promotions'   : {templateUrl: 'App/views/view_all_promotions.html'}
                    }
                })

                .state('/edit_company', {
                    url  : '/edit_company',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/edit_company'   : {templateUrl: 'App/views/edit_company_details.html'}
                    }
                })

                .state('/edit_promotion', {
                    url  : '/edit_promotion',
                    views: {
                        ''                          : {templateUrl: 'App/views/main_template.html'},
                        'content@/edit_promotion'   : {templateUrl: 'App/views/edit_promotion.html'}
                    }
                });


            
                
            /*---------------------------------- ROUTES END ----------------------------------------------------*/
        })

        .run(function ($rootScope, ngNotify, $state, Storage, categoryService) {
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    angular.forEach(data.parent_categories, function (val) {
                        if(val.parent_category_name == 'Company'){
                            $rootScope.company_category_id = val.parent_category_id;
                        }
                        if(val.parent_category_name == 'Promotions'){
                            $rootScope.promotion_category_id = val.parent_category_id;
                        }
                    })
                });

            var login_status = Storage.get('logged');
            var user_details = Storage.get('user');

            if(login_status && user_details){
                $rootScope.user_obj = user_details;
            }
            else{
                $state.go('/');
            }

        })
    ;
})();
