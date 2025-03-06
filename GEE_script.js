
// Define date range
var startDate = '2015-01-01';
var endDate = '2025-01-01';
var point = ee.Geometry.Point([114.172889,22.297646])//a point in;
var region = geometry.buffer(10000).bounds();

// Load the Landsat 9 C2 SR collection and filter
var filteredCollection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate(startDate, endDate)
  .filterMetadata('CLOUD_COVER', 'less_than', 5) // low cloud coverage
  .filterMetadata("SUN_ELEVATION", "greater_than", 0) // day light
  
// Get the most recent image
var scene = ee.Image(filteredCollection.sort("DATE_ACQUIRED", false).first());


// Get the image
var bands = ['SR_B4', 'SR_B3', 'SR_B2'];

bands.forEach(function(bandName) {
  Export.image.toDrive({
    image: scene.select([bandName]),
    description: bandName + '_export', // Task name
    fileNamePrefix: 'landsat9_HK_' + bandName,
    region: region,
    scale: 30,
    maxPixels: 1e13
  });
});