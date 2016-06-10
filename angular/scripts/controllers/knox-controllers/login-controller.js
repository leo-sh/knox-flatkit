app.controller('AuthCtrl', ['$rootScope', '$scope', '$firebaseAuth', function($rootScope, $scope, $firebaseAuth) {
    'use strict';

    //console.log(currentAuth);
    $scope.data = {};
    $scope.loginResultMessage = '';
    $scope.errorLoggingIn = false;
    $scope.loggingIn = false;

    $scope.render = {
        loggingIn: function() {
            return $scope.loggingIn;
        },
        errorLoggingIn: function() {
            return $scope.errorLoggingIn;
        }
    };


    $scope.loginEmail = function() {

      if(!$scope.loggingIn){
        $scope.loggingIn = true;
        $firebaseAuth().$signInWithEmailAndPassword({
            email: $scope.data.username,
            password: $scope.data.password
        }).then(function(authData) {
            // handled by the onAuth callback on rootscope
            $scope.loggingIn = false;
            $scope.errorLoggingIn = true;
        }).catch(function(error) {
            console.error('Authentication failed:', error);
            $scope.loggingIn = false;
            $scope.errorLoggingIn = true;
            $scope.loginResultMessage = $scope.resolveLoginError(error);
        });
      }

    };


    $scope.resolveLoginError = function(firebaseError){
      switch (firebaseError.code) {
        case 'INVALID_EMAIL':
          return 'The specified user account email is invalid.';
          break;
        case 'INVALID_PASSWORD':
          return 'The specified user account password is incorrect.';
          break;
        case 'INVALID_USER':
          return 'The specified user account does not exist.';
          break;
        case 'auth/argument-error':
          return 'Email not specified.';
          break;
        default:
          console.log('Error logging user in:', error);
      }
    };


    $scope.loginFacebook = function(){

        $firebaseAuth.$authWithOAuthPopup('facebook', function(error, authData) {
          if (error) {
            console.log('Firebase facebook login with popup failed!', error);
          } else {
            console.log('Authenticated successfully with payload:', authData);
          }
        });


    };


    $scope.loginTwitter = function() {

      $firebaseAuth.$authWithOAuthPopup('twitter', function(error, authData) {
        if (error) {
          console.log('Firebase Twitter Login Failed!', error);
        } else {
          console.log('Authenticated successfully with Twitter, payload:', authData);
        }
      });
    };


    // An alert dialog
    $scope.showAlert = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });

        alertPopup.then(function(res) {

        });
    };

}]);

