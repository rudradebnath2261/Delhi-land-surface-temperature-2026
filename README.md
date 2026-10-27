# Delhi-land-surface-temperature-2026
Geospatial analysis of Delhi's summer 2026 urban thermal environment using Google Earth Engine and Landsat 8/9 imagery. Assesses Land Surface Temperature (LST), Urban Heat Island (UHI), Surface Urban Heat Island (SUHI), and Urban Thermal Field Variance Index (UTFVI) to identify heat hotspots and support sustainable urban planning.
## Project Overview and Methodology

This project analyzes **urban thermal conditions and heat hotspot distribution across Delhi, India, during summer 2026 (April–June)** using Google Earth Engine (GEE). Landsat 8 and 9 Collection 2 Level-2 satellite imagery was processed through cloud masking, temperature scaling, and seasonal compositing to estimate **Land Surface Temperature (LST)**. Dynamic World land-cover data was used to distinguish built-up and vegetated areas.

The analysis includes **Urban Heat Island (UHI) temperature anomalies, Surface Urban Heat Island (SUHI) intensity, and Urban Thermal Field Variance Index (UTFVI)** to evaluate spatial temperature variations and relative thermal conditions. Statistical classification using mean temperature and standard deviation was applied to identify urban heat hotspots and thermal-intensity zones.

## Mathematical Formulas Used

The following mathematical formulas were applied to analyze urban thermal conditions across Delhi during summer 2026.

### 1. Land Surface Temperature (LST)

$$
LST\ (^\circ C)=(ST_{B10}\times0.00341802)+149.0-273.15
$$

**Source:** USGS Landsat Collection 2 Level-2 Surface Temperature.

### 2. Urban Heat Island (UHI) Temperature Anomaly

$$
UHI_i=LST_i-\overline{LST}
$$

Where \(\overline{LST}\) represents the mean land surface temperature of Delhi.

### 3. Surface Urban Heat Island (SUHI) Intensity

$$
SUHI=\overline{LST}_{Built-up}-\overline{LST}_{Vegetation}
$$

For spatial mapping of individual built-up pixels:

$$
SUHI_i=LST_i-\overline{LST}_{Vegetation}
$$

### 4. Urban Thermal Field Variance Index (UTFVI)

$$
UTFVI_i=\frac{LST_i-\overline{LST}}{\overline{LST}}
$$

*The implementation uses LST in degrees Celsius.*

### 5. UHI Intensity Classification

$$
T=\mu\pm k\sigma
$$

Where:

- \(\mu\) = Mean land surface temperature.
- \(\sigma\) = Standard deviation of land surface temperature.
- \(k\) = 0.5 or 1.5, depending on the classification threshold.

### 6. Heat Hotspot Identification

$$
Hotspot_i=
\begin{cases}
1, & LST_i\geq\mu+0.5\sigma\\
0, & LST_i<\mu+0.5\sigma
\end{cases}
$$

### 7. Minimum and Maximum Index Values

$$
Index_{min}=\min(X_1,X_2,\ldots,X_n)
$$

$$
Index_{max}=\max(X_1,X_2,\ldots,X_n)
$$

These formulas were implemented in **Google Earth Engine (JavaScript)** to generate LST, UHI, SUHI, UTFVI, thermal classification, heat hotspot maps, and statistical bar graphs.

## Outputs

The project generates **LST, UHI, SUHI, UTFVI, UHI intensity classification, UTFVI ecological classification, and heat hotspot maps**, along with minimum–maximum statistical bar charts. Individual raster outputs are exported as **GeoTIFF files at 30 m pixel spacing**, supporting further GIS analysis, urban heat assessment, and sustainable urban planning.

## Data Sources

- **USGS:** [Landsat 8 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2) and [Landsat 9 Collection 2 Level-2](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_L2)
- **Google and World Resources Institute:** [Dynamic World V1](https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1)
- **FAO:** [GAUL 2025 Administrative Boundaries](https://developers.google.com/earth-engine/datasets/catalog/FAO_GAUL_2025_level1)

**Platform:** Google Earth Engine | **Language:** JavaScript | **Study Period:** April–June 2026
