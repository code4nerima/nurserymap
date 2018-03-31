// Events functions
//
//

// onInitialLatLng : This function is called when setting initial lat & lng.
function onInitialLatLng() {
    return [35.737841　, 139.653912];
}

var layers ;
// onCreate : This function is called when page began.
function onCreate(map) {
    // area.geojason.
    $.getJSON('data/area01.geojson', function(data) {
        createAreaLayer(data).addTo(map);
    });

    $.getJSON('data/area02.geojson', function(data) {
        createAreaLayer(data).addTo(map);
    });

    layers = new Array();

    // train data.
    $.getJSON('./data/public_transport/train/train_station.geojson', function(data) {
        layers.push(createTrainStationLayer(data)) ;
    });

    $.getJSON('./data/public_transport/train/train_line.geojson', function(data) {
        layers.push(createTrainLineLayer(data));
    });

    // bus data.
    $.getJSON('./data/public_transport/bus/bus_stop01.geojson', function(data) {
        layers.push(createBusStopLayer(data)) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_stop02.geojson', function(data) {
        layers.push(createBusStopLayer(data)) ;
    });

    $.getJSON('./data/public_transport/bus/bus_root01.geojson', function(data) {
        layers.push(createBusRootLayer(data)) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_root02.geojson', function(data) {
        layers.push(createBusRootLayer(data)) ;
    });

    map.on('zoomend', function(e) {
        if (e.target._zoom > 14) {
            for (var i=0; i<layers.length; i++) {
                layers[i].addTo(map) ;
            }
        } else {
            for (var i=0; i<layers.length; i++) {
                layers[i].remove(map) ;
            }
        }
    }) ;
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