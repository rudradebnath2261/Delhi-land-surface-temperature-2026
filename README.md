# Delhi-land-surface-temperature-2026
Geospatial analysis of Delhi's summer 2026 urban thermal environment using Google Earth Engine and Landsat 8/9 imagery. Assesses Land Surface Temperature (LST), Urban Heat Island (UHI), Surface Urban Heat Island (SUHI), and Urban Thermal Field Variance Index (UTFVI) to identify heat hotspots and support sustainable urban planning.
## Project Overview and Methodology

This project analyzes **urban thermal conditions and heat hotspot distribution across Delhi, India, during summer 2026 (April–June)** using Google Earth Engine (GEE). Landsat 8 and 9 Collection 2 Level-2 satellite imagery was processed through cloud masking, temperature scaling, and seasonal compositing to estimate **Land Surface Temperature (LST)**. Dynamic World land-cover data was used to distinguish built-up and vegetated areas.

The analysis includes **Urban Heat Island (UHI) temperature anomalies, Surface Urban Heat Island (SUHI) intensity, and Urban Thermal Field Variance Index (UTFVI)** to evaluate spatial temperature variations and relative thermal conditions. Statistical classification using mean temperature and standard deviation was applied to identify urban heat hotspots and thermal-intensity zones.
### 1. Land Surface Temperature (LST)

\\[ LST\ (^\circ C)=(ST\\\_B10\times0.00341802+149)-273.15 \\]

### 2. Urban Heat Island (UHI)

\\[ UHI_i=LST_i-\overline{LST}\_{Delhi} \\]

### 3. Surface Urban Heat Island Intensity (SUHII)

\\[ SUHII=\overline{LST}\_{built}-\overline{LST}\_{reference} \\]

### 4. Surface Urban Heat Island (SUHI) – Pixel Level

\\[ SUHI_i=LST_i-\overline{LST}\_{reference} \\]

### 5. Urban Thermal Field Variance Index (UTFVI)

\\[ UTFVI_i=\frac{LST_i-\overline{LST}}{\overline{LST}} \\]

### 6. Heat Hotspot Identification

\\[ LST_i\geq\overline{LST}+0.5\sigma \\]

### 7. UHI Intensity Classification

\\[ \begin{aligned} \text{Very Low: }&LST_i<\mu-1.5\sigma\\\ \text{Low: }&\mu-1.5\sigma\leq LST_i<\mu-0.5\sigma\\\ \text{Moderate: }&\mu-0.5\sigma\leq LST_i<\mu+0.5\sigma\\\ \text{High: }&\mu+0.5\sigma\leq LST_i<\mu+1.5\sigma\\\ \text{Very High: }&LST_i\geq\mu+1.5\sigma \end{aligned} \\]

Where: \\(LST_i\\) = pixel-level land surface temperature; \\(\overline{LST}\\) or \\(\mu\\) = mean land surface temperature; \\(\sigma\\) = standard deviation; \\(\overline{LST}\_{built}\\) = mean built-up surface temperature; and \\(\overline{LST}\_{reference}\\) = mean vegetated reference surface temperature.

## Outputs

The project generates **LST, UHI, SUHI, UTFVI, UHI intensity classification, UTFVI ecological classification, and heat hotspot maps**, along with minimum–maximum statistical bar charts. Individual raster outputs are exported as **GeoTIFF files at 30 m pixel spacing**, supporting further GIS analysis, urban heat assessment, and sustainable urban planning.

## Data Sources

- **USGS:** [Landsat 8 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2) and [Landsat 9 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_L2)
- **Google and World Resources Institute:** [Dynamic World V1](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1)
- **FAO:** [GAUL 2025 Administrative Boundaries](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_2025_level1)

**Platform:** Google Earth Engine | **Language:** JavaScript | **Study Period:** April–June 2026
