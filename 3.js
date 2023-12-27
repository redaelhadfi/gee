//// Atmospherically and radiometrically correction of image
//  **********************************************************************************************************************


// Define your area of interest with coordinates
var polygonCoordinates = [
    [83.5263215103027,30.208170729971187],
    [83.52688933542673,30.207445393915872],
    [83.5291584320439,30.208672996170968],
    [83.52811652699322,30.2096420748662],
    [83.5263215103027,30.208170729971187]
  ];
  
  var areaOfInterest = ee.Geometry.Polygon(polygonCoordinates);
  
  // Filter the Landsat 8 collection for images intersecting the area of interest
  var startDate = '2017-01-20';
  var endDate = '2017-02-20';
  
  var landsat8Collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                              .filterDate(startDate, endDate)
                              .filterBounds(areaOfInterest)
                              .sort('CLOUD_COVER');
  
  var landsat8 = landsat8Collection.first(); // Selects the image with the least cloud cover
  
  // Dark Object Subtraction (DOS)
  var addDOS = function(image) {
    var darkPixels = image.reduceRegion({
      reducer: ee.Reducer.min(),
      geometry: areaOfInterest,
      scale: 30,
      maxPixels: 1e9
    });
  
    var darkPixelsImage = ee.Image.constant(darkPixels.values());
    darkPixelsImage = darkPixelsImage.rename(image.bandNames());
  
    return image.subtract(darkPixelsImage);
  };
  
  var correctedImage = addDOS(landsat8);
  
  // Visualization parameters for Landsat 8 to enhance sandy areas
  var sandParams = {bands: ['B6', 'B5', 'B4'], min: 0.03, max: 0.3};
  
  // Add the corrected image layer to the map
  Map.addLayer(correctedImage, sandParams, 'Corrected Landsat 8 image');
  Map.centerObject(areaOfInterest, 10); // Center the map on the area of interest
  
  // Enhanced Vegetation Index (EVI) for comparison
  var calculateEVI = function(image) {
    var nir = image.select('B5');
    var red = image.select('B4');
    var blue = image.select('B2');
    return image.addBands(nir.subtract(red).divide(nir.add(red.multiply(6)).subtract(blue.multiply(7.5)).add(1)).multiply(2.5).rename('EVI'));
  };
  
  var landsatWithEVI = calculateEVI(correctedImage);
  var eviParams = {bands: ['EVI'], min: 0, max: 1};
  Map.addLayer(landsatWithEVI, eviParams, 'EVI');
  
  // Contrast Stretching
  var stretchImage = function(image) {
    return image.visualize({bands: ['B4', 'B3', 'B2'], min: 0.1, max: 0.4, gamma: 1.3});
  };
  
  var stretchedImage = stretchImage(correctedImage);
  Map.addLayer(stretchedImage, {}, 'Stretched Image');
  


