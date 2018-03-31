// Events functions
//
//

// onInitialLatLng : This function is called when setting initial lat & lng.
function onInitialLatLng() {
    return [35.737841　, 139.653912];
}

// onCreate : This function is called when page began.
function onCreate(map) {
    // area.geojason.
    $.getJSON('data/area.geojson', function(data) {
        L.geoJson(data, {
            style : function(feature) {
                return {
                    fillColor: 'gray',
                    weight: 2,
                    opacity: 1,
                    color: 'black',  //Outline color
                    fillOpacity: 0.1
                };
            }
        }).addTo(map);
    });

    // train data.
    $.getJSON('./data/public_transport/train/train_station.geojson', function(data) {
        L.geoJson(data, {
            pointToLayer: function(geoJsonPoint, latlng) {
                return L.marker(latlng).addTo(map)
            },
            onEachFeature: function(feature, layer) {
                var latlng = [
                    (feature.geometry.coordinates[0][0][1] + feature.geometry.coordinates[0][1][1])/2,
                    (feature.geometry.coordinates[0][0][0] + feature.geometry.coordinates[0][1][0])/2
                ] ;

                var iconFilePath = "" ;

                if (feature.properties.運営会社 == "西武鉄道" && 
                (feature.properties.路線名 == "池袋線" || feature.properties.路線名 == "豊島線" || feature.properties.路線名 == "西武有楽町線")) {
                    iconFilePath = 'data/public_transport/train/train_icon_seibuikebukuro.png' ;
                } else if (feature.properties.運営会社 == "西武鉄道" && feature.properties.路線名 == "新宿線") {
                    iconFilePath = 'data/public_transport/train/train_icon_seibushinjuku.png' ;
                } else if (feature.properties.運営会社 == "東京地下鉄" && feature.properties.路線名 == "8号線有楽町線") {
                    iconFilePath = 'data/public_transport/train/train_icon_yurakucho.png' ;
                } else if (feature.properties.運営会社 == "東京都" && feature.properties.路線名 == "12号線大江戸線") {
                    iconFilePath = 'data/public_transport/train/train_icon_ooedo.png' ;
                } else {
                    iconFilePath = 'data/public_transport/train/train_icon.png' ;
                }

                var trainIcon = L.icon({
                    iconUrl: iconFilePath,
                    iconSize: [30, 30],
                    popupAnchor: [0, -15],
                });

                var marker = L.marker(latlng, {icon : trainIcon}) ;

                marker.addTo(map)

                var popupContents = "<strong>" + feature.properties.駅名 + "</strong><br/>";

                popupContents += feature.properties.運営会社 + "<br/>";
                popupContents += feature.properties.路線名;
    
                marker.bindPopup(popupContents);
            }
        }).addTo(map);
    });

    $.getJSON('./data/public_transport/train/train_line.geojson', function(data) {
        L.geoJson(data, {
            style: function(feature) {
                return {
                    weight: 2,
                    opacity: 1,
                    color: 'green',  //Outline color
                };
            }
        }).addTo(map);
    });

    // bus data.
    var busIcon = L.icon({
        iconUrl: 'data/public_transport/bus/bus_icon.png',
        iconSize: [20, 20],
        popupAnchor: [0, -10],
    });

    $.getJSON('./data/public_transport/bus/bus_stop.geojson', function(data) {
        L.geoJson(data, {
            pointToLayer: function(geoJsonPoint, latlng) {
                return L.marker(latlng, {icon : busIcon}).addTo(map)
            },
            onEachFeature: function(feature, layer) {
                var popupContents = "<strong>" + feature.properties.P11_001 + "</strong><br/>";

                popupContents += feature.properties.P11_003_1;
    
                layer.bindPopup(popupContents);
            }
        }).addTo(map);
    });

    $.getJSON('./data/public_transport/bus/bus_root.geojson', function(data) {
        L.geoJson(data, {
            style: function(feature) {
                return {
                    weight: 2,
                    opacity: 1,
                    color: 'green',  //Outline color
                };
            }
        }).addTo(map);
    });
}

// onCreateMarkerIcon : This function is called when marker icon is created.
function onCreateMarkerIcon() {
    return L.icon({
        iconUrl: 'nursery_icon.png',
        iconSize: [30, 30],
        iconAnchor: [0, 0],
        popupAnchor: [15, 0],
        shadowUrl: '',
        shadowSize: [30, 30],
        shadowAnchor: [0, 0]
    });
}

// onMapClick : This function is called when map was clicked.
function onMapClick(e) {
	//popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
}

// onCraeteMarkerPopup : This function is called when marker is created by Leaflet.
function onCraeteMarkerPopup(feature, layer) {
    return createContent(feature);
}

// onMarkerMouseOver : This function is called marker mouse over. If return false, onUpdateInfo isn't called.
function onMarkerMouseOver(e) {
    return true ;
}

// onMarkerMouseOver : This function is called marker mouse out.
function onMarkerMouseOut(e) {
    
}

// onMarkerMouseOver : This function is called marker mouse click.
function onMarkerClick(e) {
    
}

// onUpdateInfo : This function is updated info content.
function onUpdateInfo(feature) {
    return createContent(feature);
}