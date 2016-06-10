/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
(function() {
    'use strict';
    angular
      .module('app', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'ngStore',
        'ui.router',
        'ui.utils',
        'ui.load',
        'ui.jp',
        'oc.lazyLoad',
        'firebase'
      ]);
})();

(function() {

    'use strict';
    angular.module('app').value('FirebaseConfig', {
        apiKey: 'AIzaSyCtziBOkp1xYwqANrMdn9jY_36-UTFuz-c',
        authDomain: 'knox-4156f.firebaseapp.com',
        databaseURL: 'https://knox-4156f.firebaseio.com',
        storageBucket: 'knox-4156f.appspot.com'
    });

})();

(function() {
    'use strict';

    angular.module('app').run(['$rootScope', 'FirebaseConfig', '$firebaseAuth', function($rootScope, FirebaseConfig, $firebaseAuth) {

        firebase.initializeApp(FirebaseConfig);
        //$rootScope.firebaseAuth = $firebaseAuth();

        $firebaseAuth().$onAuthStateChanged(function(authData){
            if (authData) {
                $rootScope.authData = authData;
                console.log('Logged in as:', authData);
            } else {
                console.log('Logged out');
            }
        });


    }]);

})();


