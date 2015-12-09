function init(mapId) {
	var urlParams = getUrlParams(window.location.href),
		dataUrl = "data/" + (urlParams.data ? urlParams.data : "demo") + ".json",
		map = L.map(mapId).setView([54.1919, 37.6886], 17),
		info = createInfoControl(map)
	;
	
	L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, " +
			"<a href=\"http://www.openstreetmap.org/copyright\">ODbL</a>",
		id: "osm"
	}).addTo(map);
	
	var baseballIcon = L.icon({
		iconUrl: 'baseball-marker.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});
	
	// registry of room types
	var reg = {
		accessories: ["#3AE7BA", "accessories"],
		children: ["#23E77A", "goods for children"],
		cloth: ["#E7692D", "clothes"],
		furniture: ["#4377E7", "furniture"],
		mobile: ["#E7DD28", "mobile phones and accessories"],
		passage: ["#999999", null],
		pharmacy: ["#4BE742", "pharmacy"],
		supermarket: ["#E71678", "supermarket"],
		supermarket2: ["#E75999", "supermarket"]
	};
	
	
	getData(dataUrl, onLoad);
	
	function onLoad(data) {
		L
			.geoJson(data, {
	
				style: function (feature) {
					type = feature.properties.type
					return {
						stroke: type=="passage" ? false : true, 
						fillColor: reg[type][0],
						fillOpacity: 1.,
						weight: 2.,
						color: "white"
					};
				},
	
				onEachFeature: onEachFeature,
	
				pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng, {
						radius: 8,
						fillColor: "#ff7800",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					});
				}
			})
			.addTo(map)
			.on({
				mouseover: function(e) {
					info.update(e.layer.feature.properties);
				},
				mouseout: function() {
					info.update();
				}
			})
		;
	}
	
	function createInfoControl(map) {
		var info = L.control();
		
		info.onAdd = function(map) {
			this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
			this.update();
			return this._div;
		};
		
		info.update = function(props) {
		    this._div.innerHTML = props && reg[props.type][1] ?
		    	"<h4>" + props.name + "</h4>" + "Shop type: " + reg[props.type][1] :
		    	"Hover over a builging plan"
		    ;
		};
		
		info.addTo(map);
		
		return info;
	}
	
	function onEachFeature(feature, layer) {
		if (feature.properties && feature.properties.name) {
			layer.bindPopup(feature.properties.name);
		}
	}
	
	function getUrlParams(url) {
		var urlParams = {};
		if (url.indexOf("?") > -1) {
			var str = url.substr(url.indexOf("?") + 1);
			var parts = str.split(/&/);
			for (var i = 0; i < parts.length; i++) {
				var split = parts[i].split(/=/);
				var key = split[0];
				var value = split[1];
				urlParams[key] = value;
			}
		}
		return urlParams;
	}


	function getData(url, onLoad) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", encodeURI(url));
		xhr.onload = function() {
			if (xhr.status == 200) {
				onLoad(JSON.parse(xhr.responseText));
			}
			else {
				alert("Error: " + xhr.status);
			}
		};
		xhr.send();
	}
	
}