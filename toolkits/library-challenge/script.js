(function(){
    'use strict';

    // add your script here
    var map = L.map('map').setView([37.7792588, -122.4193286], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var marker = L.marker([37.796213724555905, -122.4086059333477]).addTo(map);
    var circle = L.circle([37.7955487, -122.3934746], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    var polygon = L.polygon([
        [37.8002152, -122.4359776],
        [37.7834067, -122.459227],
        [37.763382, -122.478472]
    ]).addTo(map);

    marker.bindPopup("<b>Hungry?</b><br>I'm the best rice roll spot in all of Chinatown!").openPopup();
    circle.bindPopup("Best spot to watch fireworks.");
    polygon.bindPopup("Bakeries that are worth the hype!");

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }
    
    map.on('click', onMapClick);
    
}());