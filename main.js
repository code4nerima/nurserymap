var map;
var info ;

function main() {
	var latlng = [35.737841　, 139.653912];

	map = L.map('map').setView(latlng, 13);
	
	var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	
	L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
			attribution: 'Map data &copy; ' + mapLink,
			maxZoom: 18
		}
	).addTo(map);
	
	onCreate() ;
		
	info = L.control();
	
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};
	
	info.update = function (popupContents) {
		if (popupContents != null) {
			this._div.innerHTML = popupContents ;
			$(".info").css("display", "inline") ;
		}
	};

	info.addTo(map);

	$(".info").css("display", "none") ;
	
	map.on('click', onMapClick);
	
	/*
	map.locate({setView: true, maxZoom: 16});
	
	map.on('locationfound', function(e) {
		var radius = e.accuracy / 2;
	
		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();
	
		L.circle(e.latlng, radius).addTo(map);
	});
	
	map.on('locationerror', function(e) {
	
	});
	*/
}