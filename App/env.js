(function () {
    'use strict';

    angular
        .module('app')
        .constant('ENV', {
            base_url        : 'http://findit.api/admin/api/v1/',
            company_promo_path       : 'http://findit.api/images/company-promo/',
            home_banners_path       : 'http://findit.api/images/home/',
            env             : 'development',
            company_cat_id  : 6
        });
})()
