# satellite-image-tutorial
This is a simplified and updated version based of a tutorial at NICAR19 by [David Yanofsky](https://github.com/yanofsky/nicar19-landsat). Please refer to it for additional useful links.

## First things first

- Request access to Google Earth Engine code environment
https://signup.earthengine.google.com/#!/

- Install [GIMP](https://www.gimp.org/)

The GIMP process can be achived in Photoshop as well. We use GIMP here because it is free. 

## Data we use

We will be using the images from [Landsat-9](https://landsat.gsfc.nasa.gov/data/), a NASA-run satellite that does one round around the earth every 99 minutes and ensures one image of the location captured every 16 days. 

## Get data from Google Earth Engine

1. Navigate to https://code.earthengine.google.com/

2. Create a new script

3. Pick a point you want to focus on

4. Define date range and area of interest

```javascript
var startDate = '2015-01-01';
var endDate = '2025-01-01';
var point = geometry;
var region = geometry.buffer(10000).bounds();

```
You can also draw a shape (a rectangle, for example) on the map viewer and using it for the region variable. 

5. Load the landsat images and filter

```javascript
var filteredCollection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata('CLOUD_COVER', 'less_than', 5) // low cloud coverage
  .filterMetadata("SUN_ELEVATION", "greater_than", 0) // daylight

```

6. Get the most recent image in your collection

```javascript
var scene = ee.Image(filteredCollection.sort("DATE_ACQUIRED", false).first());

```

7. Define the bands we need to produce a true-color image and export the image to Google Drive

We will loop through the three bands for green, blue and red to get three images.

```javascript
var bands = ['SR_B4', 'SR_B3', 'SR_B2'];
bands.forEach(function(bandName) {
  // Save to your google drive as a GEOTIFF
  Export.image.toDrive({
    image: scene.select([bandName]),
    description: bandName + '_export', 
    fileNamePrefix: 'landsat9_' + bandName,
    region: region,
    scale: 30, // cannot go lower than 30
    maxPixels: 1e13
  });
});
```

8. Click the "Run" button to exicute your code. In the "Tasks" panel clikc "Run" on the item created to begin the image export process.


## Process the images with GIMP

1. Open the three images in GIMP
	* You want the XXX_B2.tif XXX_B3.tif and XXX_B4.tif files 

2. Open the Compose panel under `Colors > Components > Compose`

3. Select "RGB" in Color Model

4. Specify your channels 
	* Red: X_B4.tif
	* Green: X_B3.tif
	* Blue: X_B2.tif

	Click OK

6. Your image is really dark. Lighten it up by going to `Colors > Levels`
	take the white carrot and drag it to the edge of the histogram

7. From the set of eyedropper buttons on the bottom right of the panel, select the middle one, "Pick gray point"

8. Zoom into your image and find a cloud or white roofed building, click it. Click "OK" in the Levels panel

9. Open the Curves panel `Colors > Curves`

9. In panel, select each channel from the Channel drop down, and drag the dot on the bottom left for each to the point on the histogram where the curve gets steep.

10. Switch back to the Value view in the histogram and pull the middle of the black line up. Click OK

Using this method will remove all of the geographic metadata from your image. [Here is a way to get it back](https://gis.stackexchange.com/a/108703) using the command line tool GDAL.


## Is there an easier way to use Landsat?

Yes! Here are some free options:

- You can install Google Earth Engine to get images of locations you want. The Desktop app is much more powerful than the web version, and they may provide you with better resolution (not in terms of image size.) 

- [The USGS Exploror](https://earthexplorer.usgs.gov/) provides good coverage of the US.

- [The Copernicus broswer](https://browser.dataspace.copernicus.eu/) is an excellent tool to browse images from Sentinels (a very similar satellite like the Landsat, maintained by the European Space Agency.) It's rumored that they may have Landsat integration soon. 

## Real world examples 

* [These satellite images show China’s footprints across Africa](https://qz.com/africa/1696712/these-satellite-images-show-chinas-footprints-in-africa) by Quartz

* [The island Bangladesh is thinking of putting refugees on is hardly an island at all](https://qz.com/1075444/the-island-bangladesh-is-thinking-of-putting-refugees-is-hardly-an-island-at-all/) by Quartz

* [A Rogue State Along Two Rivers](https://www.nytimes.com/interactive/2014/07/03/world/middleeast/syria-iraq-isis-rogue-state-along-two-rivers.html) by The New York Times
