app.controller('ManageEventsCtrl', ['$scope', '$filter', 'NgTableParams',
  'FirebaseConfig', 'EventService', '$templateCache', '$uibModal', 'uiGmapGoogleMapApi',
  function($scope, $filter, NgTableParams, FirebaseConfig, EventService, $templateCache, $uibModal, uiGmapGoogleMapApi) {
    'use strict';
    var self = this;

    var TEMP_USER = 'testuser';

    $scope.isMapsApiReady = false;
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.isMapsApiReady = true;
    });

    $scope.events = {};
    $scope.events.current = [];
    $scope.events.expired = [];

    $scope.currentEventsTableParams = new NgTableParams({}, {
      getData: function($defer, params) {
        var promise = EventService.getEventsByAgent(TEMP_USER, [], ['LIVE']).then(function(obj){
          $defer.resolve(firebaseResultToArray(obj));
        });
      }
    });

    $scope.draftEventsTableParams = new NgTableParams({}, {
      getData: function($defer, params) {
        var promise = EventService.getEventsByAgent(TEMP_USER, [], ['DRAFT']).then(function(obj) {
          $defer.resolve(firebaseResultToArray(obj));
        });
      }
    });

    $scope.expiredEventsTableParams = new NgTableParams({}, {
      getData: function($defer, params) {
        var promise = EventService.getEventsByAgent(TEMP_USER, [], ['EXPIRED']).then(function(obj) {
          $defer.resolve(firebaseResultToArray(obj));
        });
      }
    });

    $scope.refreshAllTables = function(){
       $scope.currentEventsTableParams.reload();
       $scope.draftEventsTableParams.reload();
       $scope.expiredEventsTableParams.reload();
    };


    $scope.showEventModal = function(knoxEvent) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/edit-event-modal.html',
        controller: 'EditEventModalCtrl',
        size: 'lg',
        resolve: {
          knoxEvent: function() {
            return knoxEvent;
          }
        }
      });

      modalInstance.result.then(function(knoxEvent) {
        console.log('event saved');
        $scope.refreshAllTables();
      });


    };

    $scope.showDeleteEventModal = function(knoxEvent) {
      var deleteModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/delete-event-modal.html',
        controller: 'DeleteEventModalCtrl',
        size: 'sm',
        resolve: {
          knoxEvent: function() {
            return knoxEvent;
          }
        }
      });

      deleteModalInstance.result.then(function(knoxEvent) {
        console.log('event saved');
        $scope.refreshAllTables();
      });

    };


    $scope.toggleExpireEvent = function(knoxEvent) {
      EventService.toggleExpireEvent(knoxEvent).then(
        function(success) {
          console.log(success);
          $scope.refreshAllTables();
        },
        function(error) {
          console.error(error);
        });
    };

  }
]);

var firebaseResultToArray = function(obj) {
  var dataArray = [];
  angular.forEach(obj, function(o) {
    dataArray.push(o);
  });
  return dataArray;
};