console.log('testing, hi this is the correct js file :)')
//MEET UP APP - WHAT WAS PRESENTED

// materialize - text input styling initialize
$(document).ready(function () {
  $('input#input_text, textarea#textarea2').characterCounter();
});



// materialize - modal functionality
$(document).ready(function () {
  $('.modal').modal();
});


// materialize - small screen sidebar nav
$(document).ready(function () {
  $('.sidenav').sidenav();
});


let midPointLat = 0;
let midPointLong = 0;



// map search
$('button').on('click', function () {

  event.preventDefault();
  addressSearch();
})




function addressSearch() {

  var geocodingKey = 'SzMAPmTeOI5jHoAV1AdN1Ro2g1r8lACM'
  location1 = $('#location1').val();
  startingPointAddr1 = location1;
  location2 = $('#location2').val();
  startingPointAddr2 = location2;
  var geocodingURL = 'https://www.mapquestapi.com/geocoding/v1/batch?&inFormat=kvp&outFormat=json&thumbMaps=false&maxResults=1&location=' + location1 + '&location=' + location2 + '&key=' + geocodingKey;
  var results;

  console.log(location1);
  console.log(location2);
  // console.log(geocodingURL);





  $.ajax({
    url: geocodingURL
  }).done(function (response) {


    var loc1results = response.results[0].locations[0];
    var loc2results = response.results[1].locations[0];


    var loc1type = loc1results.geocodeQuality;
    var loc1lat = loc1results.latLng.lat;
    var loc1lng = loc1results.latLng.lng;


    var loc1coords = [loc1lat, loc1lng];

    var loc2lat = loc2results.latLng.lat;
    var loc2lng = loc2results.latLng.lng;
    var loc2coords = [loc2lat, loc2lng];


    console.log('location type: ' + loc1type + ', ' + loc1coords);
    console.log(loc2coords);
    $('.side-panel').append('Location 1: ' + location1 + '<br>Coordinates: ' + loc1coords + '<br><br>');
    $('.side-panel').append('Location 2: ' + location2 + '<br>Coordinates: ' + loc2coords);





    // converting latLng array values to radians to calculate midpoint
    let loc1CoordsRads = degreesToRadians(loc1coords);
    let loc2CoordsRads = degreesToRadians(loc2coords);
    // calling the midpoint function
    let midpointInRads = findMidPoint(loc1CoordsRads, loc2CoordsRads);
    // converting midpoint back to degrees
    let midPointInDeg = radiansToDegrees(midpointInRads);
    // ^ midPointInDegrees can be passed as an argument to the yelp API call function.
    midPointLat = midPointInDeg[0];
    midPointLong = midPointInDeg[1];


    console.log('location 1 radians: ' + loc1CoordsRads);
    console.log('location 2 radians: ' + loc2CoordsRads);

    console.log('midpoint in radians: ' + midpointInRads);
    console.log('midpoint coords: ' + midPointLat + ', ' + midPointLong);



    //function to convert unsigned lat lon in degrees to radians
    function degreesToRadians(latLngArray) {
      let [lat, long] = latLngArray;
      let lanInRads = lat * (Math.PI / 180);
      let longInRads = long * (Math.PI / 180);
      return [lanInRads, longInRads];
    }

    // Inverse of the degreesToRadians function to be called after the midpoint is calculated
    // and before the results (which need to be in degrees) are passed to the yelp API call
    function radiansToDegrees(latLngRadsArray) {
      let [lat, long] = latLngRadsArray;
      let latDegs = lat * (180 / Math.PI);
      let longDegs = long * (180 / Math.PI);
      return [latDegs, longDegs];
    }

    // function that calculates the midpoint beteween 2 points on the map.
    // must be passed two arrays of length 2, each element in the arrays must be in units of radians.
    // returns an array length 2: [lat in radians, long in radians]
    function findMidPoint(latLngRadsArray1, latLngRadsArray2) {
      let [lat1, long1] = latLngRadsArray1;
      let [lat2, long2] = latLngRadsArray2;

      if (Math.abs(long2 - long1) > Math.PI) {
        long1 += 2 * Math.PI; // crossing anti-meridian


      }

      var lat3 = (lat1 + lat2) / 2;
      var f1 = Math.tan(Math.PI / 4 + lat1 / 2);
      var f2 = Math.tan(Math.PI / 4 + lat2 / 2);
      var f3 = Math.tan(Math.PI / 4 + lat3 / 2);
      var long3 = ((long2 - long1) * Math.log(f3) + long1 * Math.log(f2) - long2 * Math.log(f1)) / Math.log(f2 / f1);

      if (!isFinite(long3)) {
        long3 = (long1 + long2) / 2; // parallel of latitude
      }
      //The longitude can be normalised to −180…+180 using (lon+540)%360-180 ??
      return [lat3, long3];
    }

    // function to render a point on the map
    // latLngArray should be in the form of [51.5, -0.09]
    function renderPoint(latLngArray) {
      var marker = L.marker(latLngArray).addTo(map);
    }
    // renderPoint();
    displayPlaces();


    map.panTo(new L.LatLng(midPointLat, midPointLong));


  })
}

function displayPlaces() {

  // var places = $(this).attr("data-name");
  //var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?text=del&latitude=37.786882&longitude=-122.399972";
  var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=" + midPointLat + "&longitude=" + midPointLong;

  $.ajax({
    url: queryURL,
    headers: { 'Authorization': 'Bearer cTXs93Tu7cOPhOYuXLLZdE5SIIkZRBS19EXdpPFQ3kBP7QyfYF3Uwbk6ZzwygDmXzdFKv0g8ndmZecAPAdKKOm3aeqFhD_wrH2DP6vmneVo0nRIO90SbPc-hjZKuXHYx' },
    method: "GET",
    dataType: 'json',
  })
    .then(function (response) {
      console.log(response);
      console.log("hi this is me");
      $(".side-panel").empty();



      for (var i = 0; i <= 9; i++) {

        // console.log(newResult);
        var name = response.businesses[i].name;
        // console.log(name);
        var categories = response.businesses[i].categories[0].title;
        // console.log(categories);
        var address = response.businesses[i].location.display_address;
        // console.log(address);
        var display_phone = response.businesses[i].display_phone;
        // console.log(display_phone);
        var price = response.businesses[i].price;
        // console.log(price);
        var rating = response.businesses[i].rating;
        // console.log(rating);
        var review_count = response.businesses[i].review_count;
        // console.log(review_count);
        var image_url = response.businesses[i].image_url;
        // var myImage = $('<img>').attr('src', image_url);





        var myStars;

        if (rating === 5) {
          // <img src="" value=>
          myStars = "./assets/images/small_5@2x.png";
        }
        else if (rating === 4.5) {
          myStars = "./assets/images/small_4_half@2x.png";
        }

        else if (rating === 4) {
          myStars = "./assets/images/small_4@2x.png";
        }
        else if (rating === 3.5) {
          myStars = "./assets/images/small_3_half@2x.png";
        }


        else if (rating === 3) {
          myStars = "./assets/images/small_3@2x.png";
        }
        else if (rating === 2.5) {
          myStars = "./assets/images/small_2_half@2x.png";
        }
        else if (rating === 2) {
          myStars = "./assets/images/small_2@2x.png";
        }
        else if (rating === 1.5) {
          myStars = "./assets/images/small_1_half@2x.png";
        }
        else if (rating === 1) {
          myStars = "./assets/images/small_1@2x.png";
        } else {
          myStars = "";
        }



        var newResult = $("<div class='results' data-attr='" + i + "'>").html(
          "<img class='pic' src='" + image_url + "'/>" +
          "<h3>" + (i + 1) + ". " + name + "</h3>" +
          "<h4 class='cat'>" + categories + "</h4>" +
          "<h4>" + address + "</h4>" +
          "<h4>" + display_phone + "</h4>" +
          "<h4>" + price + "</h4>" +
          "<h4>" + rating + "</h4> <img src='" + myStars + "'/>" +
          "<h4> Reviews: " + review_count + "</h4>")



        newResult.on('click', meetAddress);




        $('.side-panel').append(newResult);

        
        function meetAddress(event) {
          
          j = $(this).attr('data-attr');
          console.log(j);
          
          meetPlace = response.businesses[j].location.display_address[0] + ', ' + response.businesses[j].location.display_address[1];
          console.log('meetplace: ' + meetPlace);

          displayRouteInfo();
          
          map.panTo(new L.LatLng(midPointLat, midPointLong));
        }
      }
    });
};


let routeVectorLatLngArray = [];
let midPointLatitude = 0;
let midPointLongitude = 0;
let midPointInDeg = [];
let meetPlace = '';
let startingPointAddr1 = '';
let startingPointAddr2 = '';

console.log(location1);
console.log(meetPlace);

var location1 = '';
var location2 = '';

// function to draw the route from a starting point to the selected endpoint from the yelp results
// pass the single line addresses for the starting and ending loations as arguments
// startingPointAddr,endingPointAddr
function displayRouteInfo(location1, meetPlace) {

  console.log(location1);
  console.log(meetPlace);




  let APIkey = '6scse9ETJfXFQIaeRDPlQAgvAI2hyN7F';
  let queryURL = 'https://www.mapquestapi.com/directions/v2/route?key=' + APIkey + '&from=' + location1 + '&to=' + meetPlace;
  
  // below is a static ajax call for testing purposes.
  // let queryURL = 'http://www.mapquestapi.com/directions/v2/route?key=6scse9ETJfXFQIaeRDPlQAgvAI2hyN7F&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA'
  let directions = $('<p>');
  let turns = [];
  let firstMove;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function (response) {
    console.log('Routing ajax call response below');
    console.log(response);
    // responce.route.legs[0].origNarrative is the first message
    // responce.route.legs[0].maneuvers[i].narrative

    console.log(queryURL);
    console.log(firstMove);
    firstMove = response.route.legs[0].origNarrative;
    
    let routingInfoArray = response.route.legs[0].maneuvers;
    console.log('routing Info array of objects below')
    console.log(routingInfoArray);

    // this loop runs through the maneuvers array and pushes the value of the narrative properety (a string) to the turns array.
    routingInfoArray.forEach(function (element) {
      turns.push(element.narrative);
      let pointLng = element.startPoint.lng;
      let pointLat = element.startPoint.lat;
      let pointLatLng = [pointLat, pointLng];
      routeVectorLatLngArray.push(pointLatLng);
    });

    console.log('route vector coords array below');
    console.log(routeVectorLatLngArray);
    console.log('turns array below');
    console.log(turns);

    $(directions).append(firstMove);

    for (let i = 0; i < turns.length; i++) {
      $(directions).append(turns[i] + '<br>');
    }

    $('#instructions').empty();
    $('#instructions').text('Directions to your meet up place:');

    $('#instructions').append(directions);
    
  });
}