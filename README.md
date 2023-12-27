# Landsat 8 OLI Surface Reflectance Analysis Project

## Project Overview
This project focuses on analyzing Landsat 8 OLI surface reflectance images to assess vegetation health and salinity levels. The analysis is based on field data collected on February 6, 2017, which includes 24 sample points with respective latitude, longitude, and Electrical Conductivity (EC) values.

## Data Collection
**Date:** February 6, 2017
- **Sample Points:** 24 field sample points
- **Data Collected:** Latitude and longitude of points, and their EC values

## Methodology
### 1. Image Acquisition
- **Task:** Downloading Landsat 8 OLI surface reflectance image closest to the field data collection date.

### 2. Image Preprocessing
- **Task:** Atmospheric and radiometric correction of the Landsat 8 OLI image.

### 3. Indices Calculation
- **Task:** Adding 20 Vegetation and Salinity Indices layers to the image.
- **Note:** The calculation formulas for TCI 1, 2, and 3 are included in the project. PCI 1, 2, and 3 calculations are not required.

### 4. Data Analysis
- **Task:** Calculate the numeric values of pixels at the locations of field sample points.
- **Output:** A table of 24 × 20, where 24 represents the EC values of field data, and 20 represents the indices' numeric values of the pixel at each sample point.


