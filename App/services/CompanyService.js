(function (angular) {
  'use strict';

  // creating an instance of app module
  var app = angular.module('app');

  app.factory('companyService', companyService);

  companyService.$inject = ['CompanyResource','Upload', '$q','ENV', 'CompanyPromoResource', 'HomeBannersResource'];

  function companyService(CompanyResource, Upload, $q, ENV, CompanyPromoResource, HomeBannersResource ) {

    var companyService = {
      'addNewCompany' : addNewCompany,
      'uploadCompanyLogo' : uploadCompanyLogo,
      'getAllCompanies':getAllCompanies,
      'deleteCompany':deleteCompany,
      'setSeletectedCompany':setSeletectedCompany,
      'getSelectedCompany':getSelectedCompany,
      'getSelectedCompanyEdit':getSelectedCompanyEdit,
      'updateCompany':updateCompany,
      'uploadPromoVideo':uploadPromoVideo,
      'deletePromoImage':deletePromoImage,
      'uploadCompanyBanner':uploadCompanyBanner,
      'uploadPromoImage' : uploadPromoImage,
      'uploadHomeBanner' : uploadHomeBanner,
      'deleteHomeBanner':deleteHomeBanner,
      'getHomeBanners':getHomeBanners
    };

    var selected_company = null;

    function getHomeBanners() {
      return HomeBannersResource.get().$promise;
    }

    function uploadHomeBanner(image, data){
      var deferred = $q.defer();
      // upload on file select or drop
      Upload.upload({
        url : ENV.base_url + 'home-banners',
        data: {image: image, data: data}

      }).then(function (resp) {
        deferred.resolve(resp.data);

      }, function (resp) {
        deferred.reject(resp);
      });

      return deferred.promise;
    }

    function deleteHomeBanner(cid) {
      return HomeBannersResource.delete({'id': cid}).$promise;
    }

    function setSeletectedCompany(param) {
      selected_company = null;
      selected_company = param;
    }

    function getSelectedCompanyEdit() {
      return selected_company;
    }

    function getSelectedCompany(param) {
      return CompanyResource.get(param).$promise;
    }

    function addNewCompany(params) {
      return CompanyResource.save(params).$promise;
    }

    function deleteCompany(params){
      return CompanyResource.delete(params).$promise;
    }

    function getAllCompanies(param){
      return CompanyResource.query(param).$promise;
    }

    function updateCompany(cid, param) {
      return CompanyResource.update({'id': cid}, param).$promise;
    }

    function uploadPromoVideo(cid, param) {
      return CompanyPromoResource.update({'id': cid}, param).$promise;
    }

    function deletePromoImage(cid) {
      return CompanyPromoResource.delete({'id': cid}).$promise;
    }

    function uploadCompanyLogo(company_logo,data){
      var deferred = $q.defer();
      // upload on file select or drop
      Upload.upload({
        url : ENV.base_url + 'company/logo',
        data: {company_logo: company_logo, data: data}

      }).then(function (resp) {
        deferred.resolve(resp.data);

      }, function (resp) {
        deferred.reject(resp);
      });

      return deferred.promise;
    }

    function uploadPromoImage(image,data){
      var deferred = $q.defer();
      // upload on file select or drop
      Upload.upload({
        url : ENV.base_url + 'company-promo',
        data: {image: image, data: data}

      }).then(function (resp) {
        deferred.resolve(resp.data);

      }, function (resp) {
        deferred.reject(resp);
      });

      return deferred.promise;
    }


    function uploadCompanyBanner(company_banner, data){
      var deferred = $q.defer();
      // upload on file select or drop
      Upload.upload({
        url : ENV.base_url + 'company/banner',
        data: {banner: company_banner, data: data}

      }).then(function (resp) {
        deferred.resolve(resp.data);

      }, function (resp) {
        deferred.reject(resp);
      });

      return deferred.promise;
    }


    return companyService;

  }
}(window.angular));