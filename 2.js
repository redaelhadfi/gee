
// draw the area of interest*******************************************************************************************************
// Define the coordinates of the rectangle vertices
var coordinates = [
    [83.5263215103027, 30.208170729971187],
    [83.52688933542673, 30.207445393915872],
    [83.5291584320439, 30.208672996170968],
    [83.52811652699322, 30.2096420748662],
    [83.5263215103027, 30.208170729971187]
  ];
  
  // Create a rectangle geometry
  var rectangle = ee.Geometry.Polygon(coordinates);
  
  // Create a feature from the rectangle geometry
  var feature = ee.Feature(rectangle, {});
  
  // Create a feature collection with the rectangle feature
  var featureCollection = ee.FeatureCollection([feature]);
  
  // Add the feature collection to the map with boundary style
  Map.addLayer(featureCollection, {color: 'white', opacity: 0.1}, 'Rectangle Boundary');
  
  // Center the map on the rectangle
  Map.centerObject(featureCollection);
  

  
