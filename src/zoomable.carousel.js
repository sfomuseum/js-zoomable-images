var zoomable = zoomable || {};

zoomable.carousel = (function(){

    var _images = [];
    var _links = {};
    var _attrs = {};

    var _visible = 3;

    var _carousel;

    var self = {

	'init': function(){

	    var carousel = document.getElementById("zoomable-carousel");

	    if (! carousel){
		return;
	    }

	    _carousel = carousel;

	    var images = document.getElementsByClassName("zoomable-carousel-image");
	    var count = images.length;

	    if (count < 2){
		return;
	    }

	    for (var i=0; i < count; i++){

		var img_el = images[i];
		var img_src = img_el.getAttribute("src");

		_images.push(img_src);

		var data_attributes = {};

		var attrs = img_el.attributes;
		var count_attrs = attrs.length;

		for (var j=0; j< count_attrs; j++){

		    var attr = attrs[j];
		    var key = attr.name;

		    if (! key.startsWith("data-")){
			continue;
		    }
		    
		    var short_key = key.replace("data-", "");
		    data_attributes[short_key] = attr.value;
		}

		_attrs[img_src] = data_attributes;

		var parent = img_el.parentNode;
		
		if (parent.nodeName == "A"){
		    var link = parent.getAttribute("href");
		    _links[ img_src ] = link
		    parent = parent.parentNode;
		}

		parent.style.display = "none";
	    }

	    var rewind_el = document.createElement("li");
	    rewind_el.setAttribute("id", "zoomable-carousel-control-rewind");
	    rewind_el.setAttribute("class", "zoomable-carousel-item zoomable-carousel-control");
	    rewind_el.appendChild(document.createTextNode("<"));

	    rewind_el.onclick = self.rewind;	    

	    _carousel.appendChild(rewind_el);

	    // TO DO: WHAT IF count < _visible, e.g. there are only 2 images

	    for (var i=0; i < _visible; i++){

		var j = (i == 0) ? count - 1 : i - 1;

		var img_src = _images[j];
		
		var img_node = document.createElement("img");

		img_node.setAttribute("class", "zoomable-carousel-item zoomable-carousel-visible");
		img_node.setAttribute("data-index", j);		
		img_node.setAttribute("src", img_src);

		var link = _links[img_src];

		if (link){
		    img_node.onclick = function(){
			location.href = link;
		    };
		}

		var item_node = document.createElement("li");
		item_node.setAttribute("class", "zoomable-carousel-item");
		item_node.appendChild(img_node);

		_carousel.appendChild(item_node);
	    }

	    var advance_el = document.createElement("li");
	    advance_el.setAttribute("id", "zoomable-carousel-control-advance");
	    advance_el.setAttribute("class", "zoomable-carousel-item zoomable-carousel-control");
	    advance_el.appendChild(document.createTextNode(">"));

	    advance_el.onclick = self.advance;
	    _carousel.appendChild(advance_el);

	    self.show();
	},

	'init_keyboard': function(){

	    document.addEventListener('keydown', function(e){
		
		if (e.keyCode == 37){
		    self.rewind();
		}
		
		if (e.keyCode == 39){
		    self.advance();
		}
		
	    });
	},

	'carousel': function(){
	    return _carousel;
	},
	
	'show': function(){
	    _carousel.style.display = "grid";
	},

	'hide': function(){
	    _carousel.style.display = "none";
	},
	
	'advance': function(e){

	    var count_images = _images.length;
	    
	    var visible = document.getElementsByClassName("zoomable-carousel-visible");
	    var count = visible.length;
	    
	    var center = Math.floor(count / 2);	// AGAIN, account for image count of 2

	    for (var i=0; i < count; i++){
		
		var el = visible[i];
		
		var src = el.getAttribute("src");

		var idx = el.getAttribute("data-index");
		idx = parseInt(idx);
		
		var next_idx = (idx == 0) ? count_images - 1 : idx - 1;
		var next_src = _images[next_idx];

		el.setAttribute("src", next_src);
		el.setAttribute("data-index", next_idx);

		if (i == center){
		    var current_attrs = _attrs[src];
		    var next_attrs = _attrs[next_src];
		    self.update(current_attrs, next_attrs);
		}
	    }
	},

	'rewind': function(){

	    var count_images = _images.length;
	    
	    var visible = document.getElementsByClassName("zoomable-carousel-visible");
	    var count = visible.length;

	    var center = Math.floor(count / 2);	// AGAIN, account for image count of 2

	    for (var i=0; i < count; i++){
		
		var el = visible[i];
		
		var src = el.getAttribute("src");
		var idx = el.getAttribute("data-index");
		idx = parseInt(idx);
		
		var prev_idx = (idx == (count_images - 1)) ? 0 : idx + 1;
		var prev_src = _images[prev_idx];

		el.setAttribute("src", prev_src);
		el.setAttribute("data-index", prev_idx);

		if (i == center){
		    var current_attrs = _attrs[src];
		    var prev_attrs = _attrs[prev_src];
		    self.update(current_attrs, prev_attrs);
		}
	    }
	},
	
	'update': function(current_attrs, updated_attrs){
	    console.log("update", current_attrs, updated_attrs);


	    var updated_zoomable = zoomable.builder.make_zoomable_element(updated_attrs);
	    var current_zoomable = document.getElementById("zoomable-image-" + current_attrs["image-id"]);

	    current_zoomable.replaceWith(updated_zoomable);
	    zoomable.images.init();
	},

    };

    return self;
})();
