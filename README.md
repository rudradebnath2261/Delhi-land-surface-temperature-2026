# Land Surface Temperature and Urban Thermal Field Variance Index of Delhi, India (2026)

## 1. Introduction

This project examines the spatial distribution of **Land Surface Temperature (LST), Urban Heat Island (UHI), Surface Urban Heat Island (SUHI), and Urban Thermal Field Variance Index (UTFVI)** across Delhi, India, during the summer of 2026 (April–June). The study aims to identify surface heat hotspots, evaluate spatial temperature variations, and assess urban thermal conditions to support environmental monitoring and sustainable urban planning.

## 2. Data and Methodology

The analysis was conducted using **Google Earth Engine (GEE)** with Landsat 8 and Landsat 9 Collection 2 Level-2 satellite imagery and Dynamic World V1 land-cover data.

Landsat imagery was processed using cloud masking, radiometric quality filtering, and seasonal mean compositing. Surface temperature was obtained from the USGS Level-2 `ST_B10` band using the official scaling factors. Dynamic World land-cover classifications were used to distinguish built-up and vegetated areas for thermal comparison.

The methodology includes the following calculations:

**1. Land Surface Temperature (LST)**

`LST (°C) = (ST_B10 × 0.00341802 + 149.0) − 273.15`

**2. Urban Heat Island (UHI) Anomaly**

`UHI = LST_pixel − Mean LST`

**3. Surface Urban Heat Island (SUHI) Intensity**

`SUHI = Mean LST_built-up − Mean LST_vegetation`

**4. Urban Thermal Field Variance Index (UTFVI)**

`UTFVI = (LST_pixel − Mean LST) / Mean LST`

**5. Heat Hotspot Identification**

`Hotspot Threshold = Mean LST + (0.5 × Standard Deviation)`

UHI intensity was classified into five categories using mean temperature and standard deviation, while UTFVI was categorized into six ecological classes, ranging from excellent to worst. The UTFVI calculation followed the published Celsius-based convention.

## 3. Results and Outputs

<escape>The analysis produced the following key results:</escape>

- **Land Surface Temperature:** 34.94°C to 51.72°C.
- **Mean SUHI Intensity:** −0.74°C.
- **UHI Classification:** Five relative thermal-intensity categories.
- **UTFVI Classification:** Six ecological thermal-condition categories.
- **Heat Hotspot Mapping:** Identification of areas with above-average surface temperatures using statistical thresholds.

The negative SUHI intensity (−0.74°C) indicates that the selected built-up surfaces had an average temperature approximately 0.74°C lower than the selected vegetated reference areas during the study period. This result reflects the specific land-cover classification and seasonal composite used in the analysis.

The project generated thematic maps of LST, UHI, SUHI, UTFVI, thermal-intensity classifications, and heat hotspots. Statistical bar graphs were also developed to visualize minimum and maximum index values. Individual raster outputs were exported as **GeoTIFF files at 30 m pixel spacing** for further GIS analysis.

## 4. Conclusion

The study demonstrates the application of satellite remote sensing and Google Earth Engine for assessing urban surface-temperature variations across Delhi. The observed LST range of **34.94°C–51.72°C** highlights substantial spatial differences in summer surface temperatures, while the SUHI and UTFVI analyses provide additional information about relative thermal conditions and land-cover-related temperature patterns.

The results can support the identification of surface heat hotspots, urban environmental assessment, and the planning of targeted heat-mitigation strategies. As the analysis is based on satellite-derived daytime surface temperatures, the findings represent surface thermal conditions rather than direct measurements of human heat exposure.

## 5. Data and Methodological References

**Data sources**

- [USGS Landsat 8 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2)
- [USGS Landsat 9 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_L2)
- [Dynamic World V1 – Google Earth Engine](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1)
- [FAO GAUL 2025 Administrative Boundaries](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_2025_level1)

**Methodological references**

- [USGS Landsat Collection 2 Surface Temperature](https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-temperature) – Surface temperature retrieval and scaling.
- [Brown et al. (2022), Dynamic World: Near Real-Time Global Land Use/Land Cover Mapping](https://doi.org/10.1038/s41597-022-01307-4) – Land-cover classification.
- [Machine-Learning-Algorithm-Based Prediction of Land Use/Land Cover and Land Surface Temperature Changes over Harbin (2024)](https://www.mdpi.com/2073-445X/13/8/1164) – UTFVI calculation and ecological classification.

**Tools:** Google Earth Engine | JavaScript | Landsat 8/9 | Dynamic World V1

**Study Area:** Delhi, India

**Study Period:** April–June 2026
