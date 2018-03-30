var latlng = onInitialLatLng() ;

var map = L.map('map').setView(latlng, 13);

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; ' + mapLink,
		maxZoom: 18
	}
).addTo(map);

onCreate(map) ;
	
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (feature) {
	var popupContents = onUpdateInfo(feature) ;
	this._div.innerHTML = popupContents ;
};

info.addTo(map);

var markerIcon = onCreateMarkerIcon();

$.getJSON('./data/data.geojson', function(data) {
    L.geoJson(data, {
    	pointToLayer: function(geoJsonPoint, latlng) {
	    	return L.marker(latlng, {icon: markerIcon}).addTo(map)
		},
		onEachFeature: function(feature, layer) {
			var popupContents = onCraeteMarkerPopup(feature, layer) ;

       		layer.bindPopup(popupContents);
 
			layer.on({
        		mouseover: function(e){
					if (onMarkerMouseOver(e) == true) {
						info.update(feature);
					}
				},
        		mouseout: function(e){
					onMarkerMouseOut(e) ;
				},
        		click: function(e){
					onMarkerClick(e);
				}
    		});
		}
    }).addTo(map);
});

var popup = L.popup();

map.on('click', onMapClick);

map.locate({setView: true, maxZoom: 16});

map.on('locationfound', function(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
});

map.on('locationerror', function(e) {

});
