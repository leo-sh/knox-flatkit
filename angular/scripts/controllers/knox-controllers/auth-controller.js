angular.module('app').controller('AuthCtrl', ['$rootScope', '$scope', '$firebaseAuth', '$window', function($rootScope, $scope, $firebaseAuth, $window) {
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

    $scope.logout = function() {
        $firebaseAuth().signOut();
        $window.location.reload();
    }


    $scope.loginEmail = function() {

        if (!$scope.loggingIn) {
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

    $scope.loginProvider = function(provider){
        console.log(provider);
       $firebaseAuth().$signInWithRedirect(provider).then(function(authData) {
        console.log('Logged in as:', authData.uid);
      }).then(function() {
        //SUCCESS but
        // Never called because of page redirect
        // so use on auth state changed
      }).catch(function(error) {
        console.error('Authentication failed:', error);
      });
    };


    $scope.signupEmail = function() {

        //console.log($scope.data.email);
        $scope.signupResultMessage = '';

        // make the username/email lower case
        if (!$scope.data.email) {
            $scope.signupResultMessage = 'Please enter a valid email address to use as your username.';
            return null;
        }

        $scope.data.email = $scope.data.email.toLowerCase();

        if ($scope.data.password.length < 6) {
            $scope.signupResultMessage = 'Password must contain at least 6 characters. Please try again...';
            alert($scope.signupResultMessage);
            return null;
        }

        if ($scope.data.password != $scope.data.confirmPassword) {
            $scope.signupResultMessage = 'Please use matching passwords and try again...';
            alert($scope.signupResultMessage);
            return null;
        }


        $firebaseAuth().$createUserWithEmailAndPassword({
            email: $scope.data.email,
            password: $scope.data.password
        })
        .then(
          function(success){
            console.log(success);
          },
          function(fail){
            console.log(fail);
          }
        );


        var loginAfterSignup = function(email, password, userData) {
            $rootScope.firebaseAuth.$authWithPassword({
                email: email,
                password: password
            }).then(function(authData) {
                // create user profile
                FirebaseProfileService.createUserProfile(userData.uid, $scope.data.email).then(
                    function(success) {
                        console.log('Created user profile succesfully');
                    },
                    function(error) {
                        console.log('Error creating user profile');
                        console.log(error);
                    }
                );
                //$rootScope.userProfile = FirebaseProfileService.getUserProfile(authData.uid);
            }).catch(function(error) {
                console.error('Authentication failed:', error);
            });

        };


    };


    $scope.resolveLoginError = function(firebaseError) {
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



}]);
