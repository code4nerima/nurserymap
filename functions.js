// Your functions
//
//

var layers ;

var currentBusStopLayers ;
var basicBusStopLayers ;
var filteredBusStopLayers ;

// onCreate : This function is called when page began.
function onCreate() {
    
    // area.geojason.
    $.getJSON('data/area01.geojson', function(data) {
        createAreaLayer(data).addTo(map);
    });

    $.getJSON('data/area02.geojson', function(data) {
        createAreaLayer(data).addTo(map);
    });

    layers = new Array();
    basicBusStopLayers = new Array();
    filteredBusStopLayers = new Array();

    // train data.
    $.getJSON('./data/public_transport/train/train_station.geojson', function(data) {
        layers.push(createTrainStationLayer(data)) ;
    });

    $.getJSON('./data/public_transport/train/train_line.geojson', function(data) {
        layers.push(createTrainLineLayer(data));
    });

    // bus data.
    $.getJSON('./data/public_transport/bus/bus_stop01.geojson', function(data) {
        basicBusStopLayers.push(createBusStopLayer(data, null) ) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_stop02.geojson', function(data) {
        basicBusStopLayers.push(createBusStopLayer(data, null)) ;
    });

    $.getJSON('./data/public_transport/bus/bus_root01.geojson', function(data) {    
        basicBusStopLayers.push(createBusRootLayer(data, null)) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_root02.geojson', function(data) {
        basicBusStopLayers.push(createBusRootLayer(data, null)) ;
    });

	// Load datas
	var markerIcon = L.icon({
        iconUrl: 'nursery_icon.png',
        iconSize: [30, 30],
        popupAnchor: [0, -15]
    });
	
	$.getJSON('./data/data.geojson', function(data) {  
              
		L.geoJson(data, {
			pointToLayer: function(geoJsonPoint, latlng) {
				return L.marker(latlng, {icon: markerIcon});
			},
			onEachFeature: function(feature, layer) {
				var popupContents = createNurseryContent(feature) ;

				layer.bindPopup(popupContents);
	 
				layer.on({
					mouseover: function(e){
						info.update(popupContents);
					},
					mouseout: function(e){
						
					},
					click: function(e){
						
					}
				});
			}
		}).addTo(map);
	});

    currentBusStopLayers = basicBusStopLayers ;

    map.on('zoomend', function(e) {
        if (e.target._zoom > 14) {
            for (var i=0; i<layers.length; i++) {
                layers[i].addTo(map) ;
            }
            
            if (currentBusStopLayers == basicBusStopLayers) {
                for (var i=0; i<currentBusStopLayers.length; i++) {
                    currentBusStopLayers[i].addTo(map) ;
                }
            }
            
        } else {
            for (var i=0; i<layers.length; i++) {
                layers[i].remove(map) ;
            }
            if (currentBusStopLayers == basicBusStopLayers) {
                for (var i=0; i<currentBusStopLayers.length; i++) {
                    currentBusStopLayers[i].remove(map) ;
                }
            }
        }
    }) ;
}

// onMapClick : This function is called when map was clicked.
function onMapClick(e) {
    //popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
}

function createNurseryContent(feature) {
    var popupContents = '<h4>練馬保育園マップ</h4>';
 
    if (feature && feature.properties) {   
        var iconFilePath = "nursery_icon.png" ;
        popupContents = "<img src=\"" + iconFilePath + "\"  width=\"30\"/>";  
        popupContents += "<h2>" + feature.properties.Name + "</h2>";
        popupContents += "<table>"
        
        popupContents += "<tr><td>種別　</td><td>" + feature.properties.Type + "</td></tr>" ;
        popupContents += "<tr><td>電話番号　</td><td>" + feature.properties.TEL + "</td></tr>" ;
        popupContents += "<tr><td>住所　</td><td>" + feature.properties.Add1 + feature.properties.Add2 + "</td></tr>" ;
        popupContents += "<tr><td>定員　</td><td>" + feature.properties.Capall + "</td></tr>" ;
        popupContents += "<tr><td>開園　</td><td>" + feature.properties.Open + "</td></tr>" ;
        popupContents += "<tr><td>閉園　</td><td>" + feature.properties.Close_reg + "</td></tr>" ;
        popupContents += "<tr><td>延長　</td><td>" + feature.properties.Close + "</td></tr>" ;
        popupContents += "</table>" ;

        popupContents += "<br />" + "<a href=\"" + feature.properties.Url + "\">" + "詳細" + "</a>" ;
    }

    return popupContents ;
}

function createAreaLayer(data) {
    return L.geoJson(data, {
        style : function(feature) {
            if (feature.properties.N03_003 == "練馬区") {
                return {
                    fillColor: 'cyan',
                    weight: 2,
                    opacity: 1,
                    color: 'black',  //Outline color
                    fillOpacity: 0.1
                };
            } else {
                return {
                    fillColor: 'gray',
                    weight: 2,
                    opacity: 1,
                    color: 'black',  //Outline color
                    fillOpacity: 0.1
                };
            }
        }
    }) ;
}
var currentBusStopFeature ;

function createBusStopLayer(data, filterFunc) {
    var busIcon = L.icon({
        iconUrl: 'data/public_transport/bus/bus_icon.png',
        iconSize: [20, 20],
        popupAnchor: [0, -10],
    });

    var filteredBusIcon = L.icon({
        iconUrl: 'data/public_transport/bus/filtered_bus_icon.png',
        iconSize: [20, 20],
        popupAnchor: [0, -10],
    }) ;

    var currentBusIcon = L.icon({
        iconUrl: 'data/public_transport/bus/filtered_bus_icon.png',
        iconSize: [40, 40],
        popupAnchor: [0, -20],
    }) ;

    return L.geoJson(data, {
        filter: function(feature) {
            if (filterFunc != null) {
                return filterFunc(feature)
            } else {
                return true ;
            }
        },
        pointToLayer: function(feature, latlng) {
            if (filterFunc != null) {
                if (currentBusStopFeature.properties.P11_001 == feature.properties.P11_001) {
                    return L.marker(latlng, {icon : currentBusIcon}) ;
                } else {
                    return L.marker(latlng, {icon : filteredBusIcon}) ;
                }
            } else {
                return L.marker(latlng, {icon : busIcon}) ;
            }
        },
        onEachFeature: function(feature, layer) {
            var iconFilePath = 'data/public_transport/bus/bus_icon.png' ;
            var popupContents = "<img src=\"" + iconFilePath + "\"  width=\"30\"/>";
            
            popupContents += "<h2>" + feature.properties.P11_001 + "</h2>";

            var companies = feature.properties.P11_003_1.split(",");
            var identifies = feature.properties.P11_004_1.split(",");

            popupContents += "<table>" ;

            for (var i=0; i<companies.length; i++) {
                popupContents += "<tr><td>" + companies[i] + "</td><td>" + identifies[i] + "</td><tr>" ;
            }

            popupContents += "</table><br />" ;

            popupContents += "<button id=\"search_root\" onclick=\"onSearchRoot()\">検索</button>" ;
            popupContents += "<button id=\"search_reset\" onclick=\"onSearchReset()\">リセット</button>" ;

            layer.bindPopup(popupContents);

            layer.on({
        		mouseover: function(e){
                    currentBusStopFeature = feature ;
					info.update(popupContents);
				},
        		mouseout: function(e){
					
				},
        		click: function(e){
					currentBusStopFeature = feature ;
				}
    		});
        }
    })
}

function createBusRootLayer(data, filterFunc) {
    return L.geoJson(data, {
        filter: function(feature) {
            if (filterFunc != null) {
                return filterFunc(feature)
            } else {
                return true ;
            }
        },
        style: function(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'green',  //Outline color
            };
        }
    }) ;
}

function createTrainStationLayer(data) {
    var markers = new Array() ;

    var layer = L.geoJson(data, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.marker(latlng) ;
        },
        onEachFeature: function(feature, layer) {
            var latlng = [
                (feature.geometry.coordinates[0][0][1] + feature.geometry.coordinates[0][1][1])/2,
                (feature.geometry.coordinates[0][0][0] + feature.geometry.coordinates[0][1][0])/2
            ] ;

            var iconFilePath = "" ;

            if (feature.properties.N02_004 == "西武鉄道" && 
            (feature.properties.N02_003 == "池袋線" || feature.properties.N02_003 == "豊島線" || feature.properties.N02_003 == "西武有楽町線")) {
                iconFilePath = 'data/public_transport/train/train_icon_seibuikebukuro.png' ;
            } else if (feature.properties.N02_004 == "西武鉄道" && feature.properties.N02_003 == "新宿線") {
                iconFilePath = 'data/public_transport/train/train_icon_seibushinjuku.png' ;
            } else if (feature.properties.N02_004 == "東京地下鉄" && feature.properties.N02_003 == "8号線有楽町線") {
                iconFilePath = 'data/public_transport/train/train_icon_yurakucho.png' ;
            } else if (feature.properties.N02_004 == "東京都" && feature.properties.N02_003 == "12号線大江戸線") {
                iconFilePath = 'data/public_transport/train/train_icon_ooedo.png' ;
            } else if (feature.properties.N02_004 == "東武鉄道" && feature.properties.N02_003 == "東上本線") {
                iconFilePath = 'data/public_transport/train/train_icon_tobutojo.png' ;
            } else if (feature.properties.N02_004 == "東日本旅客鉄道" && feature.properties.N02_003 == "中央線") {
                iconFilePath = 'data/public_transport/train/train_icon_jr_chuo.png' ;
            } else if (feature.properties.N02_004 == "東京地下鉄" && 
            (feature.properties.N02_003 == "4号線丸ノ内線" || feature.properties.N02_003 == "4号線丸ノ内線分岐線")) {
                iconFilePath = 'data/public_transport/train/train_icon_marunouchi.png' ;
            } else if (feature.properties.N02_004 == "京王電鉄" && feature.properties.N02_003 == "井の頭線") {
                iconFilePath = 'data/public_transport/train/train_icon_inogashira.png' ;
            } else if (feature.properties.N02_004 == "東京地下鉄" && feature.properties.N02_003 == "5号線東西線") {
                iconFilePath = 'data/public_transport/train/train_icon_tozai.png' ;
            } else {
                iconFilePath = 'data/public_transport/train/train_icon.png' ;
            }
            
            var trainIcon = L.icon({
                iconUrl: iconFilePath,
                iconSize: [30, 30],
                popupAnchor: [0, -15],
            });

            var marker = L.marker(latlng, {icon : trainIcon}) ;

            var popupContents = "<img src=\"" + iconFilePath + "\"  width=\"30\"/>";

            popupContents += "<h2>" + feature.properties.N02_005 + "</h2>";

            popupContents += "<table>" ;
            popupContents += "<tr><td>" + feature.properties.N02_004 + "</td><td>" + feature.properties.N02_003 + "</td><tr>" ;
            popupContents += "</table>" ;

            marker.bindPopup(popupContents);

            marker.on({
        		mouseover: function(e){
					info.update(popupContents);
				},
        		mouseout: function(e){
					
				},
        		click: function(e){
					
				}
            });
            
            markers.push(marker) ;
        }
    });

    for (var i=0; i<markers.length; i++) {
        layer.addLayer(markers[i]) ;
    }

    return layer ;
}

function createTrainLineLayer(data) {
    return L.geoJson(data, {
        style: function(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'green',  //Outline color
            };
        }
    }) ;
}

function onSearchRoot(e) {

    for (var i=0; i<currentBusStopLayers.length; i++) {
        currentBusStopLayers[i].remove(map) ;
    }

    filteredBusStopLayers = new Array();

    currentBusStopLayers = filteredBusStopLayers ;

    var onBusStopFilter = function(feature) {
        
        var currentCompanies = currentBusStopFeature.properties.P11_003_1.split(",");
        var currentIdentifies = currentBusStopFeature.properties.P11_004_1.split(",");
        var array = Array()

        for (var i=0; i<currentCompanies.length; i++) {
            var key = currentCompanies[i] + currentIdentifies[i] ;
            array.push(key) ;
        }

        var companies = feature.properties.P11_003_1.split(",");
        var identifies = feature.properties.P11_004_1.split(",");

        for (var i=0; i<companies.length; i++) {
            var key = companies[i] + identifies[i] ;

            if (array.find(function(element) {
                return (element == key);
            }) != null) {
                return true ;
            }
        }

        return false ;
    } ;

    var onBusRootFilter = function(feature) {
        var currentCompanies = currentBusStopFeature.properties.P11_003_1.split(",");
        var currentIdentifies = currentBusStopFeature.properties.P11_004_1.split(",");
        var array = Array()

        for (var i=0; i<currentCompanies.length; i++) {
            var key = currentCompanies[i] + currentIdentifies[i] ;
            array.push(key) ;
        }

        var key = feature.properties.N07_002 + feature.properties.N07_003 ;

        if (array.find(function(element) {
            return (element == key);
        }) != null) {
            return true ;
        } else {
            return false ;
        }
    } ;

    $.getJSON('./data/public_transport/bus/bus_stop01.geojson', function(data) {
        var layer = createBusStopLayer(data, onBusStopFilter);

        filteredBusStopLayers.push(layer) ;
        layer.addTo(map) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_stop02.geojson', function(data) {
        var layer = createBusStopLayer(data, onBusStopFilter) ;

        filteredBusStopLayers.push(layer) ;
        layer.addTo(map) ;
    });

    $.getJSON('./data/public_transport/bus/bus_root01.geojson', function(data) {    
        var layer = createBusRootLayer(data, onBusRootFilter) ;

        filteredBusStopLayers.push(layer) ;
        layer.addTo(map) ;
    });
    
    $.getJSON('./data/public_transport/bus/bus_root02.geojson', function(data) {
        var layer = createBusRootLayer(data, onBusRootFilter) ;

        filteredBusStopLayers.push(layer) ;
        layer.addTo(map) ;
    });
}

function onSearchReset() {
    for (var i=0; i<filteredBusStopLayers.length; i++) {
        filteredBusStopLayers[i].remove(map) ;
    }

    currentBusStopLayers = basicBusStopLayers ;

    if (map._zoom > 14) {
        for (var i=0; i<currentBusStopLayers.length; i++) {
            currentBusStopLayers[i].addTo(map) ;
        }
    }
}