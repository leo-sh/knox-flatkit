//var app = angular.module('sampleapp');

app.controller('EditEventModalCtrl', ['$scope', '$uibModalInstance', 'knoxEvent', '$http', 'EventService', 'uiGmapIsReady', '$timeout',
    function($scope, $uibModalInstance, knoxEvent, $http, EventService, uiGmapIsReady, $timeout) {

        $scope.vm = {};
        $scope.vm.name = 'event-form';
        $scope.mapInstance = null;

        if (knoxEvent !== null && knoxEvent !== undefined) {
            $scope.vm.event = knoxEvent;
        }

        $scope.map = {
            marker: {},
            control: {},
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 17,
            mapOptions: {
                disableDefaultUI: true // a way to quickly hide all controls
            },
            searchbox: {
                template: 'templates/location-searchbox.html',
                options: {
                    autocomplete: true
                },
                parentdiv: 'searchBoxParent',
                events: {
                    place_changed: function(searchBox) {
                        placeChanged(searchBox);
                    }
                }
            }
        };

        angular.element(document).ready(function() {

            uiGmapIsReady.promise(1).then(function(instances) {
                instances.forEach(function(inst) {
                    console.log('MAP IS READY');
                    $scope.mapInstance = inst.map;

                    console.log(knoxEvent);
                    if (knoxEvent !== null && knoxEvent !== undefined) {
                        var center = {latitude: knoxEvent.location.geometry.location.lat, longitude: knoxEvent.location.geometry.location.lng};
                        $scope.map.center = center;
                        $scope.map.control.refresh();
                    }else{ // set to your location
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position){
                                $scope.map.center = {latitude: position.coords.latitude, longitude: position.coords.latitude};
                                $scope.map.control.refresh();
                            });
                        } else {
                            console.log('Geolcation not supported by browser.');
                        }
                    }

                });
            });

            //console.log("lodade");
            //google.maps.event.trigger($scope.mapInstance , 'resize');
            //$scope.mapInstance.setCenter(new google.maps.LatLng(-33.8688, 151.2195));

        });

        $http({
            method: 'GET',
            url: 'edit-event-formly-2.json'
        }).then(function successCallback(response) {
            $scope.vm.eventFields = response.data;

        }, function errorCallback(response) {
            console.error(response);
        });

        $scope.applySearchboxErrorStyle = false;
        $scope.locationPicked = false;
        var placeChanged = function(searchBox) {

            $scope.selectedLocation = searchBox.getPlace();
            if ($scope.selectedLocation) {
                console.log($scope.selectedLocation);
                $scope.vm.event.location = $scope.selectedLocation;
                $scope.locationPicked = true;

                var center = {
                    latitude: $scope.selectedLocation.geometry.location.lat(),
                    longitude: $scope.selectedLocation.geometry.location.lng(),
                };
                $scope.map.center = center;

                var newMarker = creatMarker($scope.selectedLocation.geometry.location, 0);
                console.log(newMarker);
                $scope.map.marker = newMarker;

            }

        };

        $scope.save = function(asDraft) {

            var eventToSave = $scope.vm.event; // validate

            if (false) {
                var inp = $('#location-searchbox-input');
                //console.log(inp); 
                inp.addClass('has-error');
            } else {
                
                EventService.saveEvent(eventToSave, asDraft).then(
                    function(result) {
                        console.log('Event saved.');
                        console.log(result);
                        $scope.close();
                    },
                    function(error) {
                        console.error(error);
                    });
            }
        };

        $scope.close = function() {
            $uibModalInstance.close($scope.vm.event);
        };

        $scope.cancel = function() {
            $uibModalInstance.close($scope.vm.event);
        };

    }
]);



var creatMarker = function(coords) {

    var googleMarker = new google.maps.Marker({
        coordinates: {
            latitude: coords.lat(),
            longitude: coords.lng(),
        },
        key: 0,
        visible: true,
        animation: google.maps.Animation.DROP
    });
    googleMarker.id = 0;

    //googleMarker.onMarkerClick = function(){
    //    console.log("clicked");
    //};

    return googleMarker;
};