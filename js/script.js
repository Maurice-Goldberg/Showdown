var inputDate;
var attractionID;
var latitude;
var longitude;
var viewingSavedShows = false;
var markers = [];
var mapStyling = [
  { elementType: 'geometry', stylers: [{ color: '#393e46'}] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#929aab'}] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#eeeeee'}] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#929aab'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#929aab'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#f7f7f7'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#eeeeee'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#929aab'}]
  }
]

// ============= ANGULAR =============
var app = angular.module('showDown', []);
app.controller('showDownController', ['$scope', '$http', '$compile',  function($scope, $http, $compile) {

  $scope.category = 'City';
  $scope.savedMode = false; 

  $scope.changeOptionSelected = function(){
    console.log('changing selected option.');
  };
  $scope.dateChange = function() {
    console.log('date');
  }; 

  $scope.save = function(){
    var id = selectedMarker['id'];
    localStorage.setItem(String(id), JSON.stringify(selectedMarker));
    alert("Show successfully saved.");
  }; 

  $scope.helpAlert = function() {
    alert('Scroll Down to see the instructions!');
  }; 

  $scope.delete = function() {
    if($scope.savedMode == true){

      if(selectedMarker != 0) {

        var id = selectedMarker['id'];

        if(localStorage.getItem(id) == null){
          alert('Cannot delete this show. It is not currently saved!')
        }
        else {
          $('#sideBar').fadeOut('slow');
          // $('#musicPlayer').fadeOut('slow');
          $('#sideBar').addClass('hidden');
          // $('#musicPlayer').addClass('hidden');

          localStorage.removeItem(id); 

          var event = 0;
          eventList = []; 

          for(var i in localStorage){
            event = JSON.parse(localStorage[i]); 
            eventList.push(event);
          }

          if(eventList.length == 0){
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
              center: new google.maps.LatLng(38, -97),
              zoom: 4,
              styles: mapStyling
            });

            $scope.savedMode = false;
            alert('Last show deleted!');
          }
          else{
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
              center: new google.maps.LatLng(38, -97),
              zoom: 4,
              styles: mapStyling
            });
            for(var i = 0; i < eventList.length; i++){
              event = eventList[i];
              addMarker(map, event);
            }
            alert('Show successfully deleted!');
            selectedMarker = 0;
          }
        }
      }
      else{
        alert('Must click a saved show in order to remove it.');
      }
    }
    else{
      alert('Must view saved shows to remove a show.');
    }
  };

  $scope.clearSaved = function(){
    var event = 0;
    var eventList = []; 
    
    for(var i in localStorage){
      if (i !== "key" && i !== "length" && i !== "getItem" && i !== "setItem" && i !== "removeItem" && i !== "clear") {
        event = JSON.parse(localStorage[i]);
        eventList.push(event);
      }
    }

    if(eventList == 0){
      alert('No shows to delete!')
    }
    else{
      localStorage.clear();
      $('#sideBar').fadeOut('slow');
      // $('#musicPlayer').fadeOut('slow');
      $('#sideBar').addClass('hidden');
      // $('#musicPlayer').addClass('hidden');

      var mapDiv = document.getElementById('map');
          var map = new google.maps.Map(mapDiv, {
          center: new google.maps.LatLng(38, -97),
          zoom: 4,
          styles: mapStyling
      });
      alert("Saved shows cleared.");
    }

    selectedMarker = 0;
  };

  $scope.seeSavedShows = function(){
    selectedMarker = 0;
    
    var event = 0;
    eventList = []; 
    
    for(var i in localStorage){
      if(i !== "key" && i!=="length" && i!=="getItem" && i!=="setItem" && i!=="removeItem" && i!=="clear") {
        event = JSON.parse(localStorage[i]); 
        eventList.push(event);
      }
    }

    if(eventList.length == 0){
      alert("No shows saved.");
    }
    else{

      $('#sideBar').fadeOut('slow');
      // $('#musicPlayer').fadeOut('slow');
      $('#sideBar').addClass('hidden');
      // $('#musicPlayer').addClass('hidden');

      viewingSavedShows = true; 
      $scope.savedMode = true; 
      var mapDiv = document.getElementById('map');
      var map = new google.maps.Map(mapDiv, {
        center: new google.maps.LatLng(38, -97),
        zoom: 4,
        styles: mapStyling
      });
      for(var i = 0; i < eventList.length; i++){
        event = eventList[i];
        addMarker(map, event);

      }
    }

  }; 

}]);

// GLOBAL VARIABLES BELOW
var selectedMarker = 0;

//keeps track of how many artists there are per event (to extend musicPlayer bar accordingly)
var artistCount = 0;

// this array will hold all the audio objects
var audioVariables = [];

// array for audio html elements
var audioElements = [];

for(var i = 0; i < 200; i++){
  audioVariables.push(0);
}
// current_global keeps track of the latest variable slot in the array above that's been used to hold an audio object
var current_global = 0; 

// Goes through all the players and pauses them
var stopPlayers = function() {
  for(var i = 0; i < 200; i++){
    if(audioVariables[i] != 0){
      audioVariables[i].pause(); 
    }
  }
}; 

// function called to find artist
var getArtistData = function(artistName) {  
  $('#sideBar').fadeOut('slow');
  // $('#musicPlayer').fadeOut('slow');
  $('#sideBar').addClass('hidden');
  // $('#musicPlayer').addClass('hidden');
      
   /* get attraction ID from artistName */
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=ORGlCRVJhpgYnGe7ANcn9JAJcsnAyn0e&keyword="
    +artistName + "&size="+100,
    dataType: "json",
    success: function(json) {
      for (var i = 0; i < json.page.totalElements; i++)
      {
        if (json._embedded.attractions[i].name == artistName)
        {
          attractionID = json._embedded.attractions[i].id;
          break;
        }
      } 

      if (attractionID != undefined) //valid artist name input
      {
        var todayDate = getCurrentDate();
        /* get events with attraction(artist) ID */
        $.ajax({
          type: "GET",
          url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=ORGlCRVJhpgYnGe7ANcn9JAJcsnAyn0e&attractionId="+
        attractionID+ "&size="+100 + "&startDateTime="+todayDate+"T00:00:00Z", 
        dataType: "json",
        success: function(json) {
          console.log(json);
          if (json.page.totalElements == 0) 
          {
            alert("No events found.");
          }
          else
          {
            initMap(json);
          }
          
          attractionID = undefined;
        },
        error: function(xhr, status, err) {
          console.log(err);
        }
        });
      }
      else //invalid artist name input
      {
        alert("Please input a valid artist name.");
      }          
          
    }, 
    error: function(xhr, status, err) {
      console.log(err);
    }
  });
}; 

// ============= SPOTIFY FUNCTIONS =============
// Gets top tracks for artist ID, then appends players

// var requestAccessToken = function() {
//   $.ajax({
//     method: "GET",
//     url: "https://accounts.spotify.com/authorize?client_id=a0be752c406c4861aa89b0c6d8a46a27&redirect_uri=http://mauricegoldberg.dev/Showdown",

//   })
// }

// var searchForTopTracks = function (artistID) {
//   $.ajax({
//     url: 'https://api.spotify.com/v1/artists/' + artistID + '/top-tracks',
//     headers: {
//       'Authorization': 'Bearer ' + accessToken
//     },
//     data: {
//       country: 'US',
//     },
//     success: function (response) {
//       // this is the local 'current' variable for audio that this new button will refer to
//       var curr = current_global;

//       // Get artist, album, and track info from response
//       var artist = response['tracks'][0]['artists'][0]['name']
//       var album = response['tracks'][0]['album']['name']
//       var track = response['tracks'][0]['name']

//       var audioInfo = "<br><font color='black'> Artist: " + artist + "<br>" + "Album: " + album + "<br>" + "Track: " + track + "</font><br>"

//       audioVariables[current_global] = new Audio();
//       audioVariables[current_global].src = response['tracks'][0]['preview_url']

//       current_global++; 

//       var audioButton = document.createElement("button");
//       audioButton.className = "btn btn-primary"
//       audioButton.id = "audio-btn"
//       audioButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>"

//       audioElements.push(audioButton);

//       audioButton.onclick = function() { 
//         if(!audioVariables[curr].paused) {
//           audioVariables[curr].pause();
//           audioButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>"
//         }
//         else{
//           // find any currently playing audio objects, pause them and change the innerHTML symbol to 'play'
//           for (var i = 0; i < current_global; i++)
//           {
//             if (!audioVariables[i].paused)
//             {
//               audioVariables[i].pause();
//               audioElements[i].innerHTML = "<span class='glyphicon glyphicon-play'></span>"
//             }
//           }
//           audioVariables[curr].play();
//           audioButton.innerHTML = "<span class='glyphicon glyphicon-pause'></span>"
//         }
//       };

//       audioVariables[curr].addEventListener('ended', function () {
//         audioButton.innerHTML = "<span class='glyphicon glyphicon-play'></span>"
//       });

//       $('#musicPlayer').append(audioInfo);
//       $('#musicPlayer').append("<br>");
//       $('#musicPlayer').append(audioButton);
//       $('#musicPlayer').append("<hr>");

//     }
//   });
// }; 

// // Searches for an artist on Spotify, returns that artist's ID 
// var searchForArtist = function (query, mode) {
//   $.ajax({
//     url: 'https://api.spotify.com/v1/search',
//     headers: {
//       'Authorization': 'Bearer ' + accessToken
//     },
//     data: {
//       q: query,
//       type: 'artist'
//     },
//     success: function (response) { 
//       //error handling

//       if(mode == 0){
//         if (response['artists']['items'][0] != undefined)
//         {
//           artistCount++;
//           searchForTopTracks(String(response['artists']['items'][0]['id']));
//         }
//       }
//       else{
//         var listOfPossibleArtists = response['artists']['items']; 
//         if(listOfPossibleArtists.length == 0){
//           alert('No artist found named \'' + query + '\'. Please type the artist\'s full name.');
//         }
//         else{
//           var name = (response['artists']['items'][0]['name']);
//           getArtistData(name);
//         }

//       }

//     }
//   });
// };

$(document).ready(function(){

  //start default date as today in calendar
  $('input[type="date"]').val(getCurrentDate()); 
  
  //assign global variable as today's date
  inputDate = getCurrentDate();

  $('#sideBar').hide();
  // $('#musicPlayer').hide();

  /** dropdown selection control **/
  // $('#categoryDropdown').on('change', function() {
  //   if (this.value == 'Artist')
  //   {
  //     $('#find').animate({
  //       left: "-=195",
  //     }, 750);
  //     $('#pac-input').hide();
  //     $('#artistSearch').show();
  //     $('#calendarForm').fadeOut(1000);
  //   }
  //   else
  //   {
  //     $('#find').animate({
  //       left: "+=195",
  //     }, 750);
  //     $('#artistSearch').hide();
  //     $('#pac-input').show();
  //     $('#calendarForm').fadeIn(1250);
  //     $('#artistSearch').val(''); //empty the input field so that autocomplete map loads
  //     initAutocomplete(); //load autocomplete map
  //   }
  // });

  /** get data from calendar input **/
  $('input[type="date"]').change(function(){
    inputDate = this.value;
  });
});


/** Draw Map on Load **/
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38, lng: -97},
    zoom: 4,
    styles: mapStyling,
    mapTypeId: 'roadmap'
  });

  
  // Create the search box and link it to the UI element. But allow searchbox to be outside map
  var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  //enter key chooses first suggestion
  google.maps.event.addDomListener(document.getElementById('pac-input'), 'keydown', function(e) {
    if (e.keyCode === 13 && !e.triggered) {
      var arrowDown = new Event('keydown');
      arrowDown.code = "ArrowDown";
      arrowDown.key = "ArrowDown";
      arrowDown.keyCode = 40;
      google.maps.event.trigger(this, 'keydown', arrowDown);

      var pressEnter = new Event('keydown');
      pressEnter.code = "Enter";
      pressEnter.key = "Enter";
      pressEnter.keyCode = 13;
      pressEnter.triggered = true;
      google.maps.event.trigger(this, 'keydown', pressEnter);
    }
  });

  //make location search triggered by enter key
  google.maps.event.addDomListener(document.getElementById('pac-input'), 'keydown', function(e) { 
    if (e.keyCode == 13) {
      var scope = angular.element($("#MainWrap")).scope();
        scope.$apply(function(){
        scope.savedMode = false;
      }); 
      // e.preventDefault();

      var markers = [];
      var places = searchBox.getPlaces();

      if (places != undefined) //error handling
      {
          if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }

          latitude = place.geometry.location.lat(); 
          longitude = place.geometry.location.lng(); 
        });
        map.fitBounds(bounds);

        var locationInfo = $('#pac-input').val();
        if (locationInfo == "") //empty search term
        {
          alert("Please input a location search term!");
        }

        else
        {
          
          /** if 3 arguments with 2 commas, finding city **/
          if ((locationInfo.match(/,/g)||[]).length == 2)
          {
            /** use lat, lng search in TM API **/
            $.ajax({
              type:"GET",
              url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=ORGlCRVJhpgYnGe7ANcn9JAJcsnAyn0e&latlong="
              +latitude+ ","+longitude+ "&size="+100+ "&startDateTime="+inputDate+"T00:00:00Z&endDateTime=" 
              + inputDate+ "T23:59:59Z"+ "&radius="+10,
              dataType: "json",
              success: function(json){
                console.log(json); 
                if (json.page.totalElements == 0) //no events
                {
                  alert("No events found.");
                }
                else
                {
                  initMapLocationSearch(json); 
                }
              },
              error: function(xhr, status, err) {
                console.log(err);
              }
            });
          }
          
          /** for other numbers of arguments **/ 
          else 
          {
            alert("Only input Cities.");
          }
        }

        $('#sideBar').fadeOut('slow');
        $('#musicPlayer').fadeOut('slow');
        $('#sideBar').addClass('hidden');
        $('#musicPlayer').addClass('hidden');
        
      }
    }
  });

  //make artist search triggered by enter key
//   google.maps.event.addDomListener(document.getElementById('artistSearch'), 'keydown', function(e) { 
//     if (e.keyCode == 13) {
//       var artistName = $('#artistSearch').val();
//       if (artistName != "") //if searching for an artist
//       {
//         var scope = angular.element($("#MainWrap")).scope();
//         scope.$apply(function(){
//           scope.savedMode = false;
//         });
//         viewingSavedShows = false; 
//         // searchForArtist(artistName, 1); 
//       }
//       else
//       {
//         alert("Please input the artist's name");
//       } 
//     }

//   });     
};


/** initMap for artist search **/
function initMap(json){

  markers = []; // new marker array 
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(38, -97),
    zoom: 4,
    styles: mapStyling
  });


  for(var i=0; i<json.page.totalElements; i++) {
    addMarker(map, json._embedded.events[i]);
  }
};

function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    map: map
  });
  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');


  markers.push(marker); // add marker to markers array

  // marker clicked 
  google.maps.event.addListener(marker, 'click', function() {

    // highlight selected marker
    for (var j = 0; j < markers.length; j++) {
      markers[j].setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
    }
    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png");


    selectedMarker = event;

    // Delete previous music players
    // $('#musicPlayer').empty();

    // Stop currently playing players from previous search
    // stopPlayers();

    //show musicPlayer element if it's hidden
    // if($('#musicPlayer').hasClass('hidden')) {

    //   //remove 'hidden' class (i.e. show element)
    //   $('#musicPlayer').removeClass('hidden');
      
    //   //fadeIn element
    //   $('#musicPlayer').fadeIn('slow');
    // }

    var artists = [];
    var attractions = event['_embedded']['attractions'];

    // error handling 
    if (attractions != undefined)
    {
      for(var i = 0; i < attractions.length; i++){
        var attraction = attractions[i];
        artists.push(attraction['name'])
      }

      console.log(artists)

      // for(var i = 0; i < artists.length; i++){
      //   searchForArtist(artists[i], 0);
      // }
    }
    

    //show sideBar element if it's hidden
    if($('#sideBar').hasClass('hidden')) {

      //remove 'hidden' class (i.e. show element)
      $('#sideBar').removeClass('hidden');
      
      //fadeIn element
      $('#sideBar').fadeIn('slow');
    }

    if (event._embedded.venues[0].name != undefined) //error handling
    {
      var request = {
        query: event._embedded.venues[0].address.line1 + " " 
        +event._embedded.venues[0].city.name+ " "
        +event._embedded.venues[0].country.name+" "
        +event._embedded.venues[0].name //info from TM API
    };
  }
  else
  {
    var request = {
      query: event._embedded.venues[0].address.line1 + " " 
      +event._embedded.venues[0].city.name+ " "
      +event._embedded.venues[0].country.name//info from TM API
    };
  }

  var service = new google.maps.places.PlacesService(map);

    //get placeId and call place details api 
    service.textSearch(request, function(results, status){

      //display event name from TM api
      $('#eventName').text(event.name); 

      //event date & time in Universal Time Coordinated
      var date = new Date(event.dates.start.dateTime).toString().split(" G")[0].split(":");
      date.pop();
      date.join(":");

      $('#eventTime').text(date);
      // + " " + event.dates.start.dateTime.slice(10 + Math.abs(0)))

      if($('#sideBar').has("#ticketLink")) { 
        $('#ticketLink').remove();
      }
      //display ticket link from TM api
      $('#venueWebsite').append("<p id='ticketLink'> Buy a <a href=\"" + event.url + "\" target='_blank'>Ticket</a>! </p>");


      if (results.length != 0) //error handling
      {
        service.getDetails({'placeId': results[0].place_id}, function(results, status){

          if (results.photos != undefined)
          {
            $('img#venuePhoto').attr('src', results.photos[0].getUrl({
              'maxWidth': 200,
              'maxHeight': 500
            }));
          }
          else
          {
            $('img#venuePhoto').attr('src','band.ico');
          }


        //results.name for venue name (sometimes just an address)
        $('#venueName').text('Venue: ' + results.name);

        //results.formatted_address for venue address
        $('#venueAddress').text(results.formatted_address);

        //phone number
        $('#venuePhone').text(results.formatted_phone_number);
      });
      }

    else 
      //if google places can't find location details, display location info from ticketmaster
    {
        //photo
        $('img#venuePhoto').attr('src','band.ico');
        //venue name
        $('#venueName').text('Venue: ' + event._embedded.venues[0].name); 
        //address
        $('#venueAddress').text('Address: ' + event._embedded.venues[0].address.line1 
          + ", " + event._embedded.venues[0].city.name+ ", "+event._embedded.venues[0].country.name);      
        //phone number
        if (event._embedded.venues[0].boxOfficeInfo != undefined)
        {
          $('#venuePhone').text(event._embedded.venues[0].boxOfficeInfo.phoneNumberDetail); 
        }
        else
        {
          $('#venuePhone').text('');
        }
      }
      
    });
   }); // end of click event


};

/** initMap for location search **/
function initMapLocationSearch(json){
  markers = []; //new marker array
  viewingSavedShows = false;
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    // center at the searched city latitude, longitude
    center: new google.maps.LatLng(latitude,longitude),
    zoom: 10,
    styles: mapStyling
  });
  for(var i=0; i<json.page.totalElements; i++) {
    addMarker(map, json._embedded.events[i]);
  }
};


function getCurrentDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  today = yyyy+'-'+mm+'-'+dd;
  return today;

};

