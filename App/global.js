(function () {
    'use strict';

    angular.module('app')

        .factory('global', function ($state, $rootScope) {

            var global = {};

            /**
             * Function for transform serialized(Json) form data to un-serialized version.
             *
             * @param obj
             * @returns {string}
             */

            global.param = function (obj) {

                var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue              = value[i];
                            fullSubName           = name + '[' + i + ']';
                            innerObj              = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&'; // jshint ignore:line
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue              = value[subName];
                            fullSubName           = name + '[' + subName + ']';
                            innerObj              = {};
                            innerObj[fullSubName] = subValue;
                            query += this.param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            /**
             * Common function for showing validation errors of forms.
             * @param form_error_object
             */
            global.show_validation_erros = function (form_error_object) {

                angular.forEach(form_error_object, function (objArrayFields, errorName) {
                    angular.forEach(objArrayFields, function (objArrayField, key) {
                        objArrayField.$setDirty();
                    })
                });
            };
            

            return global;

        });

})();