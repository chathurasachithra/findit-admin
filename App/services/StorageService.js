(function () {
    'use strict';

    angular
        .module('app')
        .factory('Storage', Storage);

    Storage.$inject = ['$cookies'];

    function Storage(store_method) {

        return {
            set   : setCookies,
            get   : getCookies,
            update: updateCookies,
            delete_x: deleteCookies
        };

        function setCookies(key, value) {
            storageManager('set', key, value);
        }

        function getCookies(key) {
            return storageManager('get', key)
        }

        function updateCookies(key, value) {

            var current_value = storageManager('get', key);

            if (typeof(value) == 'object') {
                angular.forEach(value, function (val1, key1) {
                    current_value[key1] = val1;
                });
            } else {
                current_value = value;
            }
            storageManager('delete', key);
            storageManager('set', key, current_value);
        }

        function deleteCookies(key) {
            storageManager('delete', key);
        }

        //this is where actually data is stored to cookies
        function storageManager(request, key, value) {
            switch (request) {
                case 'set' :
                    store_method.putObject(key, value);
                    break;
                case 'get' :
                    return store_method.getObject(key);
                    break;
                case 'delete' :
                    store_method.remove(key);
            }
        }

    }

})();