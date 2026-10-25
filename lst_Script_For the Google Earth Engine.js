
/*******************************************************
 DELHI SUMMER 2026 — LST, UHI, SUHI AND UTFVI
 Study period: April 1 – June 30, 2026
 Data: Landsat 8/9 C2 L2 and Dynamic World 2026
*******************************************************/

// 1. STUDY PERIOD AND AREA
var startDate = '2026-04-01';
var endDate = '2026-07-01';  // Exclusive end date

var delhiFC = ee.FeatureCollection(
  'FAO/GAUL/2025/level1'
)
.filter(ee.Filter.eq('GAUL0_NAME', 'India'))
.filter(ee.Filter.stringContains('GAUL1_NAME', 'Delhi'));

var delhi = delhiFC.geometry();

print('Delhi Boundary', delhiFC);
Map.centerObject(delhiFC, 10);

// 2. LANDSAT 8 AND 9 DATA COLLECTION
function getLandsat(id) {
  return ee.ImageCollection(id)
    .filterBounds(delhi)
    .filterDate(startDate, endDate)
    .filter(
      ee.Filter.eq('PROCESSING_LEVEL', 'L2SP')
    );
}

var landsat8 = getLandsat(
  'LANDSAT/LC08/C02/T1_L2'
);

var landsat9 = getLandsat(
  'LANDSAT/LC09/C02/T1_L2'
);

var landsat = landsat8.merge(landsat9);

print('Total Landsat Scenes', landsat.size());

// 3. CLOUD MASK AND LST CALCULATION
function calculateLST(image) {

  var qa = image.select('QA_PIXEL');

  // Mask fill, dilated cloud, cirrus,
  // clouds, cloud shadows and snow.
  var cloudMask = qa.bitwiseAnd(63).eq(0);

  var saturationMask = image
    .select('QA_RADSAT').eq(0);

  var cloudDistanceMask = image
    .select('ST_CDIST')
    .multiply(0.01)
    .gte(1);

  // Official USGS Collection 2 scaling
  var lst = image.select('ST_B10')
    .multiply(0.00341802)
    .add(149.0)
    .subtract(273.15)
    .rename('LST_C');

  return lst
    .updateMask(cloudMask)
    .updateMask(saturationMask)
    .updateMask(cloudDistanceMask)
    .copyProperties(image, ['system:time_start']);
}

var lstCollection = landsat.map(calculateLST);

// 4. DYNAMIC WORLD 2026 LAND COVER
var dw = ee.ImageCollection(
  'GOOGLE/DYNAMICWORLD/V1'
)
.filterBounds(delhi)
.filterDate(startDate, endDate);

var dwCount = dw.select('label').count();

var landcover = dw.select('label')
  .mode()
  .rename('LandCover')
  .updateMask(dwCount.gte(3))
  .clip(delhi);

// Exclude water
var landMask = landcover.neq(0);

// Built-up areas
var builtMask = landcover.eq(6);

// Vegetated reference:
// Trees, grass, crops and shrubs
var referenceMask = landcover.eq(1)
  .or(landcover.eq(2))
  .or(landcover.eq(4))
  .or(landcover.eq(5));

// 5. SUMMER MEAN LST
var lst = lstCollection.mean()
  .updateMask(landMask)
  .clip(delhi)
  .rename('LST_C');

var observationCount = lstCollection.count()
  .updateMask(landMask)
  .clip(delhi);

Map.addLayer(
  lst,
  {
    min: 25,
    max: 55,
    palette: [
      '243b8a', '2c96ba', '74c69d',
      'fee08b', 'fdae61', 'd73027'
    ]
  },
  'Summer 2026 LST',
  true
);

// 6. DELHI LST STATISTICS
var lstStats = lst.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine({
      reducer2: ee.Reducer.stdDev(),
      sharedInputs: true
    })
    .combine({
      reducer2: ee.Reducer.minMax(),
      sharedInputs: true
    }),
  geometry: delhi,
  scale: 30,
  maxPixels: 1e10,
  tileScale: 4
});

var meanLST = ee.Number(
  lstStats.get('LST_C_mean')
);

var sdLST = ee.Number(
  lstStats.get('LST_C_stdDev')
);

print('Summer 2026 LST Statistics', lstStats);

// 7. URBAN HEAT ISLAND ANOMALY
var uhi = lst.subtract(meanLST)
  .rename('UHI_Anomaly_C');

Map.addLayer(
  uhi,
  {
    min: -8,
    max: 8,
    palette: [
      '2166ac', '67a9cf', 'f7f7f7',
      'ef8a62', 'b2182b'
    ]
  },
  'UHI Temperature Anomaly',
  false
);

// 8. UHI INTENSITY CLASSIFICATION
// Class 0 = Very Low
// Class 1 = Low
// Class 2 = Moderate
// Class 3 = High
// Class 4 = Very High

var uhiClasses = lst.multiply(0).toByte()

  .where(
    lst.gte(meanLST.subtract(sdLST.multiply(1.5))),
    1
  )

  .where(
    lst.gte(meanLST.subtract(sdLST.multiply(0.5))),
    2
  )

  .where(
    lst.gte(meanLST.add(sdLST.multiply(0.5))),
    3
  )

  .where(
    lst.gte(meanLST.add(sdLST.multiply(1.5))),
    4
  )

  .rename('UHI_Class');

Map.addLayer(
  uhiClasses,
  {
    min: 0,
    max: 4,
    palette: [
      '2166ac', '67a9cf', 'ffffbf',
      'fdae61', 'd7191c'
    ]
  },
  'UHI Intensity Classes',
  false
);

// 9. BUILT-UP VS VEGETATED SUHI

var builtStats = lst.updateMask(builtMask)
  .reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: delhi,
    scale: 30,
    maxPixels: 1e10,
    tileScale: 4
  });

var referenceStats = lst.updateMask(referenceMask)
  .reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: delhi,
    scale: 30,
    maxPixels: 1e10,
    tileScale: 4
  });

var builtMean = ee.Number(
  builtStats.get('LST_C')
);

var referenceMean = ee.Number(
  referenceStats.get('LST_C')
);

var suhiIntensity = builtMean.subtract(referenceMean);

var suhi = lst.subtract(referenceMean)
  .updateMask(builtMask)
  .rename('SUHI_C');

print('Mean Built-up LST', builtMean);
print('Mean Vegetated LST', referenceMean);
print('SUHI Intensity', suhiIntensity);

Map.addLayer(
  suhi,
  {
    min: -8,
    max: 8,
    palette: [
      '2166ac', '67a9cf', 'f7f7f7',
      'ef8a62', 'b2182b'
    ]
  },
  'Surface Urban Heat Island',
  false
);

// 10. URBAN THERMAL FIELD VARIANCE INDEX
// Published Celsius-based convention

var utfvi = lst.subtract(meanLST)
  .divide(meanLST)
  .rename('UTFVI');

// Categories:
// 0: Excellent, UTFVI < 0
// 1: Good,      0 to 0.005
// 2: Normal,    0.005 to 0.010
// 3: Bad,       0.010 to 0.015
// 4: Worse,     0.015 to 0.020
// 5: Worst,     >= 0.020

var utfviClasses = lst.multiply(0).toByte()
  .where(utfvi.gte(0), 1)
  .where(utfvi.gte(0.005), 2)
  .where(utfvi.gte(0.010), 3)
  .where(utfvi.gte(0.015), 4)
  .where(utfvi.gte(0.020), 5)
  .rename('UTFVI_Class');

Map.addLayer(
  utfviClasses,
  {
    min: 0,
    max: 5,
    palette: [
      '1a9850', '91cf60', 'd9ef8b',
      'fee08b', 'fc8d59', 'd73027'
    ]
  },
  'UTFVI Ecological Classes',
  false
);

// 11. IDENTIFY HEAT HOTSPOTS
// LST >= mean + 0.5 standard deviations

var hotspots = lst.gte(
  meanLST.add(sdLST.multiply(0.5))
).rename('Hotspots').toByte();

Map.addLayer(
  hotspots.selfMask(),
  {palette: ['ff0000']},
  'Summer 2026 Heat Hotspots',
  false
);

// 12. EXPORT THERMAL INDICES TO DRIVE

var output = ee.Image.cat([
  lst,
  uhi,
  uhiClasses,
  suhi,
  utfvi,
  utfviClasses,
  hotspots,
  observationCount.rename('Observation_Count')
]).toFloat();

Export.image.toDrive({
  image: output.unmask({
    value: -9999,
    sameFootprint: false
  }),
  description: 'Delhi_Summer_2026_Thermal_Analysis',
  folder: 'Delhi_Heat_Analysis_2026',
  fileNamePrefix: 'Delhi_2026_LST_UHI_SUHI_UTFVI',
  region: delhi,
  scale: 30,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true,
    noData: -9999
  }
});




// 13. MINIMUM AND MAXIMUM BAR GRAPHS

// Combine all indices with correct band names
var allIndices = ee.Image.cat([
  lst.rename('LST'),
  uhi.rename('UHI'),
  suhi.rename('SUHI'),
  utfvi.rename('UTFVI'),
  uhiClasses.rename('UHI_Class'),
  utfviClasses.rename('UTFVI_Class'),
  hotspots.rename('Hotspots')
]);

print('Combined Indices', allIndices.bandNames());

// Calculate minimum and maximum values
var minMax = allIndices.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: delhi,
  scale: 30,
  maxPixels: 1e10,
  tileScale: 4
});

print('Minimum and Maximum Values', minMax);

// Function to create bar graphs
function barGraph(indexNames, chartTitle, unit) {

  var data = ee.FeatureCollection(
    indexNames.map(function(name) {
      return ee.Feature(null, {
        Index: name,
        Minimum: minMax.get(name + '_min'),
        Maximum: minMax.get(name + '_max')
      });
    })
  );

  var chart = ui.Chart.feature.byFeature(
    data, 'Index', ['Minimum', 'Maximum']
  )
  .setChartType('BarChart')
  .setOptions({
    title: chartTitle,
    hAxis: {title: unit},
    vAxis: {title: 'Indices'},
    colors: ['#2196F3', '#F44336'],
    legend: {position: 'top'},
    bar: {groupWidth: '70%'},
    width: 750,
    height: 350
  });

  print(chart);
}

// Graph 1: LST, 
barGraph(
  ['LST'],
  'Delhi Summer 2026: Thermal Indices',
  'Temperature / Difference (°C)'
);

// Graph 2: UTFVI
barGraph(
  ['UTFVI'],
  'Delhi Summer 2026: UTFVI',
  'UTFVI Value'
);

// Graph 3: Classification and Hotspots
barGraph(
  ['UHI_Class', 'UTFVI_Class', 'Hotspots'],
  'Delhi Summer 2026: Classification Ranges',
  'Class Value'
);
