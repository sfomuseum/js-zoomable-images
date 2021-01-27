var zoomable = zoomable || {};

zoomable.wander = (function(){

    var _map;

    var timeout_move;
    var timeout_set_direction;
    
    var self = {

	'init': function(map) {
	    _map = map;
	},
	
	'start': function() {
	    self.set_direction();
	},

	'stop': function() {

	},
	
	'move': function(x, y){

	    if (timeout_move){
		clearTimeout(timeout_move);
	    }

	    var _self = self;
	    
	    timeout_move = setTimeout(function(){
		
		_map.panBy(x, y);

		var center = _map.getCenter();
		var zoom = _map.getZoom();

		if (center.lon > 180){
		    center.lon = -180;
		    _map.setCenter(center);
		}

		if (center.lon < -180){
		    center.lon = 180;
		    _map.setCenter(center);
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
	    
	    var center = _map.getCenter();
	    
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
	    _map.zoomBy(zoom_by);

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
	
    };

    return self;

})();
