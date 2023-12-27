
//    showing calculation formula for TCI 1, 2, and 3 which are mentioned in the above table.   :  **********************************************************************************************************************
  


// Define the area of interest - replace with your actual coordinates
var areaOfInterest = ee.Geometry.Polygon([
    [83.5263215103027,30.208170729971187],
       [83.52688933542673,30.207445393915872],
       [83.5291584320439,30.208672996170968],
       [83.52811652699322,30.2096420748662],
       [83.5263215103027,30.208170729971187]
   ]);
   
   // Define the date range - replace with your actual dates
   var startDate = '2017-01-20';
   var endDate = '2017-02-20';
   
     
   // Load the Landsat 8 Image Collection
   var landsat8Collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                               .filterDate(startDate, endDate)
                               .filterBounds(areaOfInterest)
                               .sort('CLOUD_COVER');
   
   // Select the first image from the collection
   var image = landsat8Collection.first();
   print(image)
   
   // Function to calculate Tasseled Cap indices
   var addTasseledCapIndices = function(image) {
     var brightness = image.expression(
       'B1 * 0.3029 + B2 * 0.2786 + B3 * 0.4733 + B4 * 0.5599 + B5 * 0.508 + B6 * 0.1872', 
       {
         'B1': image.select('B2'), // Blue
         'B2': image.select('B4'), // Red
         'B3': image.select('B5'), // NIR
         'B4': image.select('B6'), // SWIR1
         'B5': image.select('B7'), // SWIR2
         'B6': image.select('B3')  // Green
       }).rename('Brightness');
   
     var greenness = image.expression(
       'B1 * (-0.2941) + B2 * (-0.243) + B3 * (-0.5424) + B4 * 0.7276 + B5 * 0.0713 + B6 * (-0.1608)',
       {'B1': image.select('B2'), 'B2': image.select('B4'), 'B3': image.select('B5'), 
        'B4': image.select('B6'), 'B5': image.select('B7'), 'B6': image.select('B3')}
       ).rename('Greenness');
   
     var wetness = image.expression(
       'B1 * 0.1511 + B2 * 0.1973 + B3 * 0.3283 + B4 * 0.3407 + B5 * (-0.7117) + B6 * (-0.4559)',
       {'B1': image.select('B2'), 'B2': image.select('B4'), 'B3': image.select('B5'), 
        'B4': image.select('B6'), 'B5': image.select('B7'), 'B6': image.select('B3')}
       ).rename('Wetness');
   
   
     return image.addBands([brightness, greenness, wetness]);
   };
   
   var tasseledCapImage = addTasseledCapIndices(image);
   
   // Check if the image is valid before proceeding
   if (tasseledCapImage) {
     // Visualization for Brightness
     var brightnessVis = {bands: ['Brightness'], min: -0.1, max: 0.5}; // Adjust min and max based on data range
     Map.addLayer(tasseledCapImage, brightnessVis, 'Tasseled Cap Brightness');
   
     // Visualization for Greenness
     var greennessVis = {bands: ['Greenness'], min: -0.1, max: 0.5}; // Adjust min and max based on data range
     Map.addLayer(tasseledCapImage, greennessVis, 'Tasseled Cap Greenness');
   
     // Visualization for Wetness
     var wetnessVis = {bands: ['Wetness'], min: -0.5, max: 0.5}; // Adjust min and max based on data range
     Map.addLayer(tasseledCapImage, wetnessVis, 'Tasseled Cap Wetness');
   
     // Center the map on the area of interest
     Map.centerObject(areaOfInterest, 10);
   } else {
     print('No valid image found in the collection for the given date range and area.');
   }



