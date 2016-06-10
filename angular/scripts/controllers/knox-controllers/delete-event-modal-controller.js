//var app = angular.module('sampleapp');

app.controller('DeleteEventModalCtrl', ['$scope', '$uibModalInstance', 'knoxEvent', '$http', 'EventService',
    function($scope, $uibModalInstance, knoxEvent, $http, EventService) {

        $scope.deleteString = '';
        $scope.deletingEvent = false;

        if (knoxEvent !== null || knoxEvent !== undefined){
            //$scope.vm.event = knoxEvent;
        }

        $scope.confirm = function() {
            console.log('Going to delete event')
            if($scope.deleteString === 'DELETE' && !$scope.deletingEvent){
                console.log('Going to delete event2')
                // delete the event
                $scope.deletingEvent = true;
                EventService.deleteEvent(knoxEvent).then(
                    function(success){
                        console.log(success);
                        $uibModalInstance.close();
                    },function(error){  
                        console.error(error);
                    })

            }
            else{
                // do nothing
            }
        };

        //  This cancel function must use the bootstrap, 'modal' function because
        //  the doesn't have the 'data-dismiss' attribute.
        $scope.cancel = function() {
            $uibModalInstance.close();
            //  Manually hide the modal.
            //$element.modal('hide');

            //  Now call close, returning control to the caller.
            //close($scope.vm.event, 500);
        };

    }
]);


