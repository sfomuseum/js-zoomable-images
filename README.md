# js-zoomable-images

## Important

Work in progress.

## Example

```
<div class="zoomable-image" id="zoomable-image-{IMAGE_ID}" data-image-id="{IMAGE_ID}">

  <div class="zoomable-static" id="zoomable-static-{IMAGE_ID}" style="background-image:url({THUMBNAIL_URL});">
    <button class="btn btn-sm btn-light zoomable-button zoomable-toggle-tiles" id="zoomable-toggle-tiles-{IMAGE_ID}" data-id="{IMAGE_ID}" title="View this image in full screen mode"/>
    <p id="zoomable-loading-{IMAGE_ID}" class="zoomable-loading"><span class="zoomable-loading-text">loading</span></p>

    <img id="zoomable-picture-default-{IMAGE_ID}" class="zoomable-picture-default " src="{IMAGE_URL}" alt="..." onload="zoomable.images.onload_image('{IMAGE_ID}');"/>

  </div>

  <div class="zoomable-tiles" id="zoomable-tiles-{IMAGE_ID}" data-tiles-url="{TILES_URL}">
    <div class="zoomable-map" id="zoomable-map-{IMAGE_ID}"/>
  </div>
</div>
```

* `{IMAGE_ID}` is whatever you want it to be. It only needs to be unique to a specific image.
* `{THUMBNAIL_URL}` is a smaller version of the static image you want to show. It will be hidden once `{IMAGE_URL}` is loaded.
* `{IMAGE_URL}` is the static image you want to show.
* `{TILE_URL}` is the directory where a IIIF `info.json` document can be found.

```
window.addEventListener("load", function load(event){
    zoomable.images.init();
});
```

## CSS

#### zoomable-image-{IMAGE_ID}

#### zoomable-loading-{IMAGE_ID}

#### zoomable-map-{IMAGE_ID}

#### zoomable-static-{IMAGE_ID}

#### zoomable-tiles-{IMAGE_ID}

#### zoomable-toggle-tiles-{IMAGE_ID}

### Classes

#### zoomable-button

#### zoomable-image

#### zoomable-loading

#### zoomable-loading-text

#### zoomable-map

#### zoomable-picture-default

#### zoomable-static

#### zoomable-tiles

#### zoomable-toggle-tiles

### IDs

## See also

* https://leafletjs.com/
* https://github.com/Leaflet/Leaflet.fullscreen
* https://github.com/mejackreed/Leaflet-IIIF
* https://github.com/sfomuseum/leaflet-image-control
* https://github.com/mapbox/leaflet-image
* https://github.com/eligrey/FileSaver.js