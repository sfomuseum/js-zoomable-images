# js-zoomable-images

## Important

Work in progress.

## Example

```
```

```
<div class="zoomable-image" id="zoomable-image" data-id="1527857867">

  <div class="zoomable-static" id="zoomable-static-1527857867" style="background-image:url(https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_ds.jpg)">

    <button class="btn btn-sm btn-light zoomable-button zoomable-toggle-tiles" id="zoomable-toggle-tiles-1527857867" data-id="1527857867" title="View this image in full screen mode"/>

    <p id="zoomable-loading-1527857867" class="zoomable-loading">
      <span class="zoomable-loading-text">loading</span>
    </p>

    <picture class="zoomable-picture" id="zoomable-picture-1527857867">
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_c.jpg" media="(min-height:800px) and (min-width: 800px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_z.jpg" media="(min-height:400px) and (min-width: 400px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_n.jpg" media="(min-height:400px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_b.jpg" media="(min-width: 1024px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_c.jpg" media="(min-width: 800px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_z.jpg" media="(min-width: 400px)"/>
      <source srcset="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_n.jpg" media="(min-width: 320px)"/>
      <img id="zoomable-picture-default-1527857867" class="card-img-top zoomable-picture-default image-square" src="https://static.sfomuseum.org/media/152/785/786/7/1527857867_798DeBf50Co2S01r4aOR6YsGJX5B3ste_ds.jpg" alt="model airplane: Braniff International, Boeing 707" x-loading="lazy" onload="zoomable.images.onload_image('1527857867');"/>
    </picture>
  </div>

  <div class="zoomable-tiles" id="zoomable-tiles-1527857867" data-tiles-url="https://static.sfomuseum.org/media/152/785/786/7/tiles/">
    <div class="zoomable-map" id="zoomable-map-1527857867"/>
  </div>

  <div class="zoomable-caption" id="zoomable-caption-1527857867"></div>
  
</div>
```

```
window.addEventListener("load", function load(event){
    zoomable.images.init();
});
```

## See also

* https://leafletjs.com/
* https://github.com/Leaflet/Leaflet.fullscreen
* https://github.com/mejackreed/Leaflet-IIIF
* https://github.com/sfomuseum/leaflet-image-control
* https://github.com/mapbox/leaflet-image
* https://github.com/eligrey/FileSaver.js