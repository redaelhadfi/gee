

// Define the area of interest with the coordinates of your field sample points
var fieldSamplePoints = ee.FeatureCollection([
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
  
var areaOfInterest = fieldSamplePoints.geometry().buffer(500); // Buffer the points by 500m



// Define the date range 
var startDate = '2017-01-20';
var endDate = '2017-02-20';


// Load the Landsat 8 Image Collection and filter by date and bounds
var landsat8Collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
  .filterDate(startDate, endDate)
  .filterBounds(areaOfInterest);

// Function to calculate vegetation and salinity indices
var addIndicesToImage = function(image) {
  // Normalized Difference Vegetation Index (NDVI)
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  
  // Soil Adjusted Vegetation Index (SAVI)
  var savi = image.expression(
    '((NIR - RED) * (1.0 + L)) / (NIR + RED + L)', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'L': 0.5
    }).rename('SAVI');
  
  // Enhanced Vegetation Index (EVI)
  var evi = image.expression(
    '2.5 * (NIR - RED) / (NIR + 6.0 * RED - 7.5 * BLUE + 1.0)', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'BLUE': image.select('B2')
    }).rename('EVI');
  
  // Generalized Difference Vegetation Index (GDVI)
  var gdvi = image.expression(
    'NIR - RED', {
      'NIR': image.select('B5'),
      'RED': image.select('B4')
    }).rename('GDVI');
  
  // Canopy Response Salinity Index (CRSI)
  var crsi = image.expression(
    '((NIR * RED) - (GREEN * BLUE)) / ((NIR * RED) + (GREEN * BLUE))', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'GREEN': image.select('B3'),
      'BLUE': image.select('B2')
    }).rename('CRSI');
  
  // Simple Ratio vegetation index (SR)
  var sr = image.expression(
    'NIR / RED', {
      'NIR': image.select('B5'),
      'RED': image.select('B4')
    }).rename('SR');
  
  // Two-band Enhanced Vegetation Index (EVI2)
  var evi2 = image.expression(
    '2.5 * (NIR - RED) / (NIR + 2.4 * RED + 1)', {
      'NIR': image.select('B5'),
      'RED': image.select('B4')
    }).rename('EVI2');
  
  // Extended NDVI (ENDVI)
  var endvi = image.expression(
    '(NIR + SWIR2 - RED) / (NIR + SWIR2 + RED)', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'SWIR2': image.select('B7')
    }).rename('ENDVI');
  
  // Extended EVI (EEVI)
  var eevi = image.expression(
    '2.5 * (NIR + SWIR1 - RED) / (NIR + 2.5 * SWIR1 + 6 * NIR - 7.5 * SWIR1 - RED + 1)', {
      'NIR': image.select('B5'),
      'RED': image.select('B4'),
      'SWIR1': image.select('B6')
    }).rename('EEVI');
  
  // Salinity Index I (SII)
  var sii = image.expression(
    'BLUE * RED', {
      'BLUE': image.select('B2'),
      'RED': image.select('B4')
    }).rename('SII');
  
  // Salinity Index II (SI2)
  var si2 = image.expression(
    'GREEN * RED', {
      'GREEN': image.select('B3'),
      'RED': image.select('B4')
    }).rename('SI2');
  
  // Salinity Index III (SI3)
  var si3 = image.expression(
    'GREEN * GREEN + NIR', {
      'GREEN': image.select('B3'),
      'NIR': image.select('B5')
    }).rename('SI3');
  
  // Salinity Index IV (SI4)
  var si4 = image.expression(
    '(BLUE - RED) / GREEN', {
      'BLUE': image.select('B2'),
      'RED': image.select('B4'),
      'GREEN': image.select('B3')
    }).rename('SI4');
  
  // Salinity Index V (SI5)
  var si5 = image.expression(
    '(GREEN + RED) * (GREEN + RED)', {
      'GREEN': image.select('B3'),
      'RED': image.select('B4')
    }).rename('SI5');
  
  // Add all the computed indices as bands
  return image.addBands([
    ndvi, savi, evi, gdvi, crsi, sr, evi2, endvi, eevi, sii, si2, si3, si4, si5
  ]);
};


// Apply the function to calculate indices to each image in the collection
var indexedCollection = landsat8Collection.map(addIndicesToImage);

// Sample the pixel values at the field sample points for all indices
var sampledValues = indexedCollection.first().sampleRegions({
  collection: fieldSamplePoints,
  properties: ['name_of_property_containing_EC_values'],
  scale: 30
});

// Print the results to the Console or export them
print(sampledValues);

// Export the sampled data to a CSV file
Export.table.toDrive({
  collection: sampledValues,
  description: 'sampled_index_values',
  fileFormat: 'CSV'
});
