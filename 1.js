
// Downloading Landsat 8 OLI surface reflectance image closest to field data collection date *******************************************************************************************************
// Import the Landsat 8 SR image collection.
var fieldPoints = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point(83.52892349, 30.20869111), {'ID': 1}),
    ee.Feature(ee.Geometry.Point(83.52825814, 30.20939914), {'ID': 2}),
    ee.Feature(ee.Geometry.Point(83.52852814, 30.20893755), {'ID': 3}),
    ee.Feature(ee.Geometry.Point(83.52811709, 30.20923992), {'ID': 4}),
    ee.Feature(ee.Geometry.Point(83.52790473, 30.20939099), {'ID': 5}),
    ee.Feature(ee.Geometry.Point(83.52857281, 30.20861375), {'ID': 6}),
    ee.Feature(ee.Geometry.Point(83.5280727, 30.20904624), {'ID': 7}),
    ee.Feature(ee.Geometry.Point(83.52826882, 30.2086869), {'ID': 8}),
    ee.Feature(ee.Geometry.Point(83.52838287, 30.20834519), {'ID': 9}),
    ee.Feature(ee.Geometry.Point(83.5280078, 30.20874262), {'ID': 10}),
    ee.Feature(ee.Geometry.Point(83.5278016, 30.20903447), {'ID': 11}),
    ee.Feature(ee.Geometry.Point(83.52801826, 30.20854686), {'ID': 12}),
    ee.Feature(ee.Geometry.Point(83.52772054, 30.20875878), {'ID': 13}),
    ee.Feature(ee.Geometry.Point(83.52757649, 30.20865578), {'ID': 14}),
    ee.Feature(ee.Geometry.Point(83.52791495, 30.20817533), {'ID': 15}),
    ee.Feature(ee.Geometry.Point(83.52713698, 30.20872255), {'ID': 16}),
    ee.Feature(ee.Geometry.Point(83.5275074, 30.20815622), {'ID': 17}),
    ee.Feature(ee.Geometry.Point(83.52733691, 30.20829192), {'ID': 18}),
    ee.Feature(ee.Geometry.Point(83.52698429, 30.20850694), {'ID': 19}),
    ee.Feature(ee.Geometry.Point(83.52733194, 30.20787283), {'ID': 20}),
    ee.Feature(ee.Geometry.Point(83.52707014, 30.20818082), {'ID': 21}),
    ee.Feature(ee.Geometry.Point(83.5269009, 30.2080372), {'ID': 22}),
    ee.Feature(ee.Geometry.Point(83.52689592, 30.20761811), {'ID': 23}),
    ee.Feature(ee.Geometry.Point(83.52647286, 30.20814536), {'ID': 24})
  ]);
   
// Define the time period to filter by
var startDate = '2017-01-20';
var endDate = '2017-02-20';

// Convert the fieldPoints to a list
var pointsList = fieldPoints.geometry().coordinates();

// Create a MultiPoint geometry from the list
var multiPoint = ee.Geometry.MultiPoint(pointsList);

// Calculate the convex hull of the MultiPoint
var convexHull = multiPoint.convexHull();

// Buffer the convex hull to add a little extra space
var bufferedConvexHull = convexHull.buffer(2); // Adjust the buffer size as needed

// Print the Convex Hull for reference
print("Convex Hull:", bufferedConvexHull);

// Filter the Landsat collection by the buffered convex hull
var landsatCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterBounds(bufferedConvexHull)
  .filterDate(startDate, endDate)
  .sort('CLOUD_COVER');

// Select the first image from the collection
var landsatImage = ee.Image(landsatCollection.first());



//  Print the image date to the console
var imageDate = ee.Date(landsatImage.get('system:time_start'));

print(imageDate);


// 
Map.centerObject(landsatImage, 9);

 
// Display the image
Map.addLayer(fieldPoints, {color: 'FF0000'}, 'Field Points');

// Display the Convex Hull
Map.addLayer(bufferedConvexHull, {color: '00FF00'}, 'Convex Hull');



