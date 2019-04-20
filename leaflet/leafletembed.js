// Initialize the map and assign it to a variable for later use
var map = L.map('map', {
    // Set latitude and longitude of the map center (required)
    center: [33.7756, -84.3963],
    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
    zoom: 13
});



// // Create a Tile Layer and add it to the map
// // var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);




//var marker = L.marker([, ]).addTo(mymap);
