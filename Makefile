# minify is https://github.com/tdewolff/minify

dist-all:
	@make dist-js
	@make dist-css

dist-js:
	minify --bundle \
		--output dist/zoomable.image.webcomponent.bundle.js \
		lib/javascript/leaflet.js \
		lib/javascript/leaflet-image.js \
		lib/javascript/leaflet.image.control.js \
		lib/javascript/leaflet.fullscreen.js \
		lib/javascript/leaflet-iiif.js \
		lib/javascript/FileSaver.min.js \
		src/zoomable.images.js \
		src/zoomable-image.js

dist-css:
	minify --bundle \
		--output dist/zoomable.image.webcomponent.bundle.css \
		lib/css/leaflet.css \
		lib/css/leaflet.fullscreen.css \
		lib/css/leaflet.image.control.css \
		src/zoomable.images.css
