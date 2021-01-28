var zoomable = zoomable || {}

zoomable.images = (function(){

    var map;
    var _id;	// for the window.resize event below

    var has_iiif;

    // "wander" variables - please rename
    
    var timeout_move;
    var timeout_set_direction;

    var wandering;
    
    var self = {

	'available_width': function(){
	    
	    var containers = document.getElementsByClassName("zoomable-image");
	    var container = containers[0];
	    
	    return container.offsetWidth;
	},
        
	'available_height': function() {
	    
	    var navbars = document.getElementsByClassName("navbar");
	    var count = navbars.length;
	    
	    var h = 0;
	    
	    for (var i=0; i < count; i++){
		h += navbars[i].offsetHeight;
	    }
	    
	    return window.innerHeight - (h * 1.75);
	},
	
	'resize_visible': function(){
	    
	    var ot = document.getElementsByClassName("zoomable-image");
	    
	    if ((! ot) || (ot.length == 0)){
		return;
	    }
	
	    ot = ot[0];
	    
	    var id = ot.getAttribute("data-image-id");
	    
	    if (! id){
		return;
	    }
	    
	    var picture_id = "zoomable-picture-" +id;
	    var img_id = "zoomable-picture-default-" +id;		
	    var tiles_id = "zoomable-tiles-" +id;
	    var map_id = "zoomable-map-" +id;	
	    
	    var picture_el = document.getElementById(picture_id);
	    var img_el = document.getElementById(img_id);		
	    var tiles_el = document.getElementById(tiles_id);
	    var map_el = document.getElementById(map_id);	
	    
	    if ((! picture_el) || (! img_el) || (! tiles_el)){
		return;
	    }
	    
	    var w = self.available_width();
	    var h = self.available_height();
	    
	    var max_w = w;
	    var max_h = h;
	    
	    var picture_style = window.getComputedStyle(picture_el);	
	    var tiles_style = window.getComputedStyle(tiles_el);
	    
	    if (tiles_style.display != "none"){
		
		tiles_el.style.height = max_h + "px";
		tiles_el.style.width = max_w + "px";
		
		map_el.style.height = (max_h - 20) + "px";
		
		
	    } else {
		
		if (h > 280) {
		    img_el.style.maxWidth = max_w + "px";
		    img_el.style.maxHeight = max_h + "px";
		}
	    }
	},
	
	'onload_image': function(id){
	    
	    var img_id = "zoomable-picture-default-" + id;
	    var img = document.getElementById(img_id);
	    
	    if (! img){
		// console.log("Missing image", id);
		return;
	    }
	    
	    var static = document.getElementById("zoomable-static-" + id);
	    
	    var loading = document.getElementById("zoomable-loading-" + id);
	
	    if (loading){
		loading.style.display = "none";
	    }   
	    
	    var interval = 30;    
	    var opacity = 0.0;
	    
	    img.style.opacity = opacity;
	    img.style.display = "inline";
	    
	    window.onresize = self.resize_visible;
	    self.resize_visible();
	    
	    static.style.backgroundImage = "none";
	    
	    var update = function(){
		
		opacity += .1;
		
		img.style.opacity = opacity;
		
		if (opacity >= 1.0){
		    return;
		}
		
		setTimeout(update, interval);
	    };
	    
	    setTimeout(update, interval);   
	},
	
	'ensure_iiif': function(tiles_url, cb){
	    
	    if (has_iiif){
		
		if (cb){
		    cb();
		}
		
		return;
	    }
	    
	    var info_url = tiles_url + "info.json";
	    
	    var on_success = function(e){
		
		var rsp = e.target;
		console.log(info_url, rsp.status, rsp.statusText);
		
		has_iiif = (rsp.status == 200) ? true : false;
		
		if (cb){
		    cb();
		}
	    };
	    
	    var req = new XMLHttpRequest();
	    req.addEventListener("load", on_success);
	    req.open("GET", info_url);
	    req.send();
	    
	},
	
	'show_static': function(e){
	    
	    var el = e.target;
	    var id = el.getAttribute("data-image-id");
	    
	    if (! id){
		console.log("Missing ID")
		return false;
	    }
	    
	    _id = id;
	    
	    return self.show_static_with_id(id);
	},
	
	'show_static_with_id': function(id){
	    
	    var static_id = "zoomable-static-" + id;
	    var tiles_id = "zoomable-tiles-" +id;
	    
	    var static_el = document.getElementById(static_id);
	    var tiles_el = document.getElementById(tiles_id);
	    
	    var tiles_button = document.getElementById("zoomable-toggle-tiles-" + id);
	    
	    static_el.style.display = "block";
	    tiles_el.style.display = "none";
	    
	    tiles_button.style.display = "block";
	    
	    return false;
	},
	
	'show_tiles': function(e){
	    
	    var el = e.target;
	    var id = el.getAttribute("data-image-id");
	    
	    if (! id){
		console.log("Missing ID")
		return false;
	    }
	    
	    _id = id;
	    return self.show_tiles_with_id(id);
	},
	
	'show_tiles_with_id': function(id, zoom){
	    
	    if (! zoom){
		zoom = 1;
	    }
	    
	    var static_id = "zoomable-static-" + id;
	    var picture_id = "zoomable-picture-" + id;		
	    var tiles_id = "zoomable-tiles-" +id;
	    var map_id = "zoomable-map-" +id;		
	    
	    var static_el = document.getElementById(static_id);
	    var picture_el = document.getElementById(picture_id);	
	    var tiles_el = document.getElementById(tiles_id);
	    var map_el = document.getElementById(map_id);	
	    
	    var w = self.available_width();	
	    var h = self.available_height();
	    
	    tiles_el.style.height = h + "px";
	    tiles_el.style.width = w + "px";
	    
	    map_el.style.height = (h - 20) + "px";
	    
	    // it's important to call these before trying to load
	    // the map (20200425/thisisaaronland)
	    
	    static_el.style.display = "none";
	    tiles_el.style.display = "block";
	    
	    if (map){
		map.remove();
	    }

	    map = L.map(map_id, {
		center: [300, 300],
		crs: L.CRS.Simple,
		zoom: zoom,
		minZoom: 1,
		fullscreenControl: true,
		preferCanvas: true,
	    });
	    
	    map.fullscreenControl.setPosition('topright');
	    map.zoomControl.setPosition('bottomright');	   
	    
	    var tile_opts = {
		setMaxBounds: true,
		quality: "color",
	    };
	    
	    // var tiles_url = location.href + "tiles/info.json";
	    
	    var tiles_url = tiles_el.getAttribute("data-tiles-url");
	    tiles_url = tiles_url + "info.json";
	    
	    var tile_layer = L.tileLayer.iiif(tiles_url, tile_opts)
	    
	    tile_layer.addTo(map);
	    
	    map.on('fullscreenchange', function () {
		if (! map.isFullscreen()){
		    self.show_static_with_id(_id);
		}
	    });
	    
	    var z = 3;
	    
	    map.toggleFullscreen();
	    map.setZoom(z);
	    
	    if (L.Control.Image) {

		var _this = self;
		
		var image_opts = {
		    'position': 'topright',
		    
		    on_success: function(map, canvas) {
			
			var id = _this.get_id();
			
			var dt = new Date();
			var iso = dt.toISOString();
			var iso = iso.split('T');
			var ymd = iso[0];
			ymd = ymd.replace(/-/g, "");
			
			var ot = document.getElementsByClassName("zoomable-image");
			ot = ot[0];
			
			var id = ot.getAttribute("data-image-id");
			
			var parts = [
			    ymd,
			    id,
			];
			
			var str_parts = parts.join("-");		    
			var name = str_parts + ".png";
			
			canvas.toBlob(function(blob) {
			    saveAs(blob, name);
			});
		    }
		    
		};
		
		var image_control = new L.Control.Image(image_opts);
		map.addControl(image_control);
	    }
	    
	    var tiles_button = document.getElementById("zoomable-toggle-tiles-" + id);
	    tiles_button.style.display = "none";
	    
	    return false;
	},
	
	'get_id': function(){
	    
	    var ot = document.getElementsByClassName("zoomable-image");
	    
	    if ((! ot) || (ot.length == 0)){
		return;
	    }
	    
	    ot = ot[0];
	    
	    var id = ot.getAttribute("data-image-id");
	    
	    if (! id){
		return;
	    }
	    
	    return id;
	},

	// "wander" code

	'startWandering': function() {
	    wandering = true;	    
	    self.set_direction();
	},

	'stopWandering': function() {
	    wandering = false;
	    console.log("Stop wandering here");	    
	},
	
	'move': function(x, y){

	    if (timeout_move){
		clearTimeout(timeout_move);
	    }

	    var _self = self;
	    
	    timeout_move = setTimeout(function(){
		
		map.panBy(x, y);

		var center = map.getCenter();
		var zoom = map.getZoom();

		if (center.lon > 180){
		    center.lon = -180;
		    map.setCenter(center);
		}

		if (center.lon < -180){
		    center.lon = 180;
		    map.setCenter(center);
		}

		if ((center.lat >= max_lat) || (center.lat <= min_lat)){
		    _self.set_direction();
		    return;
		}

		_self.move(x, y);	
	    }, 50);
	};

	'set_direction' = function(){

	    if (timeout_set_direction){
		clearTimeout(timeout_set_direction);
	    }
	    
	    var x = Math.random(0, 1);
	    var y = Math.random(0, 1);
	    
	    x = (x < .5) ? 0 : 1;
	    y = (y < .5) ? 0 : 1;
	    
	    if (x == 0 && y == 0){
		/* this is evil syntax... */
		(self.random_boolean()) ? x = 1 : y = 1;
	    }

	    x = (self.random_boolean()) ? x : -x;
	    y = (self.random_boolean()) ? -y : y;
	    
	    var center = map.getCenter();
	    
	    max_lat = self.random_int(75, 82);
	    min_lat = self.random_int(-75, -82);
	    
	    if (center.lat >= (max_lat - 15)){
		y = -1;
	    }
	    
	    else if (center.lat <= (min_lat + 15)){
		y = 1;
	    }
	    
	    var deg = self.get_degrees(x, y);
	    self.rotate_drone(deg);

	    var delay = parseInt(Math.random() * 60000);
	    delay = Math.max(15000, delay);
	    
	    var zoom_by = Math.random() * 2;
	    zoom_by = parseInt(zoom_by);
	    
	    zoom_by = (random_boolean()) ? zoom_by : - zoom_by;
	    map.zoomBy(zoom_by);

	    timeout_set_direction = setTimeout(set_direction, delay);

	    self.move(x, y);
	},

	'get_degrees': function(x, y){

	    var deg = 0;
	    
	    if ((x == 0) && (y == 1)){
		deg = 0;
	    }
	    
	    else if ((x == -1) && (y == 1)){
		deg = 45;
	    }
	    
	    else if ((x == -1) && (y == 0)){
		deg = 90;
	    }
	    
	    else if ((x == -1) && (y == -1)){
		deg = 135;
	    }
	    
	    else if ((x == 0) && (y == -1)){
		deg = 180;
	    }
	    
	    else if ((x == 1) && (y == -1)){
		deg = 225;
	    }
	    
	    else if ((x == 1) && (y == 0)){
		deg = 270;
	    }
	    
	    else if ((x == 1) && (y == 1)){
		deg = 325;
	    }
	    
	    else {}
	    
	    var dt = new Date();
	    var ts = dt.getTime();
	    
	    var offset = parseInt(Math.random() * 10);
	    offset = (ts % 2) ? offset : - offset;
	    
	    return deg + offset;
	},
	
	'random_int': function(min, max){
	    var r = parseInt(Math.random() * max);
	    return Math.max(min, r);
	},

	'random_latitude': function(){
	    return self.random_coordinate(90);
	},

	'random_longitude': function(){
	    return self.random_coordinate(180);
	},	

	'random_coordinate': function(max){
	    return (Math.random() - 0.5) * max;
	},

	'random_boolean': function(){
	    var dt = new Date();
	    return (dt.getTime() % 2) ? 1 : 0;
	},
	
	// things we do once the page has loaded
	
	'init': function(){
	    
	    var images = document.getElementsByClassName("zoomable-image");
	    var count = images.length;
	    
	    for (var i=0; i < count; i++){
		
		var el = images[i];
		var id = el.getAttribute("data-image-id");
		
		if (! id){
		    continue;
		}

		var tiles_id = "zoomable-tiles-" +id;
		var tiles_el = document.getElementById(tiles_id);
		var tiles_url = tiles_el.getAttribute("data-tiles-url");

		var mk_tiles_func = function(id){
		    
		    var tiles_id = "zoomable-tiles-" +id;
		    var tiles_el = document.getElementById(tiles_id);
		    var tiles_url = tiles_el.getAttribute("data-tiles-url");
		    
		    var tiles_button = document.getElementById("zoomable-toggle-tiles-" + id);

		    return function(){

			if (has_iiif){			    
			    tiles_button.setAttribute("data-image-id", id);
			    tiles_button.onclick = self.show_tiles;
			    tiles_button.style.display = "block";
			}
		    };
		};

		var tiles_func = mk_tiles_func(id);

		self.ensure_iiif(tiles_url, tiles_func);
	    }
	    
	    document.addEventListener('keydown', function(e){

		// w

		if (e.keyCode == 70) {	// probably not 70...

		    if (wanderging){
			self.stopWandering();
		    } else {
			self.startWandering();
		    }
		}
		
		// z
		
		if (e.keyCode == 90) {
		    
		    var id = get_id();
		    
		    if (! id){
			return;
		    }
		    
		    self.show_tiles_with_id(id);
		    
		    // https://github.com/Leaflet/Leaflet/issues/690
		    map.invalidateSize();
		}
		
	    });
	},
    };

    return self;
    
})();
