angular.module('app').service('EventService', ['$window', '$q', 'FirebaseConfig',
    function($window, $q, FirebaseConfig){
        'use strict';

        var database = firebase.database();
        var TEMP_USER = 'testuser';
        var EVENT_STATUSES = {'LIVE':1, 'EXPIRED':2, 'DRAFT':3}

        return{
        	getEvent: function(event_id){},
            getEventsByAgent: function(agent_id, locationFilters, statusFilters){
                // use the firebase SDK for now until angular fire is upgraded
                var defered = $q.defer();

                // swtich to real-time updates when anuglar fire is upgraded
                console.log('Running firebase query with parameters ' + statusFilters);
                var query = database.ref('user-events/' + agent_id);

                console.log(statusFilters);
                if(statusFilters !== null && statusFilters !== undefined){
                    statusFilters = makeSureArray(statusFilters);
                    angular.forEach(statusFilters, function(status){
                        query = query.orderByChild('status').equalTo(status);
                    })
                }

                query.once('value', function(snapshot) {
                    defered.resolve(snapshot.val());
                });

                return defered.promise;
            },
            getEventsByLocation: function(place_id, filterAgents, includeExpired){},
        	saveEvent: function(knoxEvent, asDraft){

                //TODO: check if event exists first before creating a new event id and replace it.
                console.log(asDraft);
                if(asDraft !== null && asDraft !== undefined){
                    console.log(asDraft);
                    if (asDraft) {
                        knoxEvent.status = 'DRAFT';
                    } else {
                        knoxEvent.status = 'LIVE';
                    }
                }

                if(knoxEvent.event_id !== null || knoxEvent.event_id !== undefined){
                    var new_event_id = database.ref().child('events').push().key;
                    knoxEvent.event_id = new_event_id;
                }

                // replace lat/lng with variables from functions
                knoxEvent.location.geometry.location = {
                    lat: getLat(knoxEvent.location),
                    lng: getLng(knoxEvent.location)
                };

                // remove photos
                knoxEvent.location.photos = null;
                knoxEvent.location.reviews = null;

                // save date fields
                knoxEvent.startDateTime = new Date(knoxEvent.startDateTime);
                knoxEvent.endDateTime = new Date(knoxEvent.endDateTime);

                /*
                knoxEvent.startDateOnly = knoxEvent.startDateTime.setHours(0);
                knoxEvent.endDateOnly = knoxEvent.endDateOnly.setHours(0);
                */

                console.log('Going to save new event:');
                console.log(knoxEvent);

                // update the data using the same key in two locations
                var events = {};
                events['/events/' + knoxEvent.event_id ] = knoxEvent;
                events['/user-events/' + TEMP_USER + '/' + knoxEvent.event_id ] = knoxEvent;
                events['/location-events/' + knoxEvent.location.place_id + '/' + knoxEvent.event_id ] = knoxEvent;

                return database.ref().update(events); // promise?

            },
        	deleteEvent: function(knoxEvent){
                console.log('Going to delete event ' + knoxEvent.event_id);

                var events = {};
                events['/events/' + knoxEvent.event_id ] = null;
                events['/user-events/' + TEMP_USER + '/' + knoxEvent.event_id ] = null;
                events['/location-events/' + knoxEvent.location.place_id + '/' + knoxEvent.event_id ] = null;  

                return database.ref().update(events); // promise?        
            },
            toggleExpireEvent: function(knoxEvent){
                console.log('Going to toggle expiry of event ' + knoxEvent.event_id);

                if(knoxEvent.status === 'EXPIRED'){
                    knoxEvent.status = 'LIVE';
                    knoxEvent.expiredAt =  null;
                }
                else{
                    knoxEvent.status = 'EXPIRED';
                    knoxEvent.expiredAt =  new Date().getTime();
                }

                var events = {};
                events['/events/' + knoxEvent.event_id ] = knoxEvent;
                events['/user-events/' + TEMP_USER + '/' + knoxEvent.event_id ] = knoxEvent;
                events['/location-events/' + knoxEvent.location.place_id + '/' + knoxEvent.event_id ] = knoxEvent;  

                console.log(events);
                
                return database.ref().update(events); // promise?        
            }
        };

    }
]);


angular.module('app').service('UserService', ['$window',
    function($window){
        'use strict';
    }
]);


var makeSureArray = function(inputVar){
    var newArray = [];
    if(inputVar !== null && inputVar !== undefined){
        if(inputVar.constructor === Array){
            newArray = inputVar;    
        }
        else{
            newArray.push(inputVar);
        }
    }
    return newArray; 
};