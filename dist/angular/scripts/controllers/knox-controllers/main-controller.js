app.controller('MainCtrl', ['$scope', '$filter', '$uibModal', '$firebaseAuth', '$rootScope',
    function($scope, $filter, $uibModal, $firebaseAuth, $rootScope) {
        'use strict';

        $scope.autData = $rootScope.authData;

		$scope.logout = function() {
			$firebaseAuth().$signOut();
		}

        $scope.render = {
	        loggedIn: function() {
	        	return ($rootScope.autData !== null && $rootScope.authData !== undefined);
	        },
	        loggingIn: function() {
	            return $scope.loggingIn;
	        },
	        errorLoggingIn: function() {
	            return $scope.errorLoggingIn;
	        }
   		};

	    $scope.login = function(){
	    	console.log('Trying to open login form');
	    	openLoginModal();
	    };

    }
]);