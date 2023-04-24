# minify is https://github.com/tdewolff/minify

dist-all:
	@make dist-js
	@make dist-css

dist-js:
	minify --bundle --output dist/zoomable.images.rollup.js lib/javascript/leaflet.js lib/javascript/leaflet-image.js lib/javascript/leaflet.image.control.js lib/javascript/leaflet.fullscreen.js src/zoomable.images.js lib/javascript/leaflet-iiif.js lib/javascript/FileSaver.min.js 

dist-css:
	minify --bundle --output dist/zoomable.images.rollup.css lib/css/leaflet.css lib/css/leaflet.fullscreen.css lib/css/leaflet.image.control.css src/zoomable.images.css
