// Map of Burlington area
var map = L.map('map').setView([44.475752, -73.196282], 15);

// map.setZoom(80);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Custom icons
var gmtbus = L.icon({
    iconUrl: '/move/images/gmtbus.png',
    iconSize:     [72, 80], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var catbus = L.icon({
    iconUrl: '/move/images/catbus.png',
    iconSize:     [90, 100], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var busStop = L.icon({
    iconUrl: '/move/images/redcircle2.png',
    iconSize:     [10, 10], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 8], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
var busStop2 = L.icon({
    iconUrl: '/move/images/bluecircle.png',
    iconSize:     [10, 10], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 8], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
// Add icon to map
// var marker = L.marker([44.475752, -73.196282], {icon: gmtbus}).addTo(map);

// Update the position of the bus icon
function setBusPosition(id, latitude, longitude)
{
    if(marker != undefined)
    {
        map.removeLayer(marker);
    }
    marker = L.marker([latitude, longitude], {icon: gmtbus}).addTo(map);
}

// Routes
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
function setBusRoutes(route_data)
{
    
    var route1 = "19137"
    var route2 = "19139"
    var waypoints1 = []
    var waypoints2 = []
    for(stop of route_data[route1])
    {
        waypoints1.push(L.latLng(stop['coordinates'][0],stop['coordinates'][1]))
        console.log(stop['stop_name'])
    }
    
    L.Routing.control({
    show:false,
    waypoints: waypoints1,
    lineOptions: {
        styles: [{color: '#ed1c23', opacity: 1, weight: 2}]},
    createMarker: function(i, wp, nWps) {
        return L.marker(wp.latLng, {icon: busStop });
    },
    routeWhileDragging: true
    }).addTo(map);

    for(stop of route_data[route2])
    {
        waypoints2.push(L.latLng(stop['coordinates'][0],stop['coordinates'][1]))
        console.log(stop['stop_name'])
    }
    L.Routing.control({
    show:false,
    waypoints: waypoints2,
    lineOptions: {
        styles: [{color: '#0071bc', opacity: 1, weight: 2}]},
    createMarker: function(i, wp, nWps) {
        return L.marker(wp.latLng, {icon: busStop2 });
    },
    routeWhileDragging: true
    }).addTo(map);

}
