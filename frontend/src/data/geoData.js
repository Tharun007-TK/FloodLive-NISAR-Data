// ============================================================
// FloodMap Live — GeoJSON Demo Data
// All geographic data is SIMULATED for demonstration purposes.
// Approximate coordinates for Sindh Province, Pakistan.
// ============================================================

// Study area bounding box (Sindh Province)
export const studyAreaGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Sindh Province Study Area" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [66.5, 23.5], [71.0, 23.5], [71.0, 28.5], [66.5, 28.5], [66.5, 23.5]
        ]]
      }
    }
  ]
};

// Flood extent polygons per district (simplified demo polygons)
export const floodExtentGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        district: "Dadu",
        severity: "CRITICAL",
        floodedAreaKm2: 820.4,
        observationDate: "2024-08-22",
        population: 185000,
        villages: 312,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.5, 26.3], [68.1, 26.3], [68.1, 26.8], [67.5, 26.8], [67.5, 26.3]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Larkana",
        severity: "CRITICAL",
        floodedAreaKm2: 710.6,
        observationDate: "2024-08-22",
        population: 162000,
        villages: 285,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.8, 27.2], [68.4, 27.2], [68.4, 27.7], [67.8, 27.7], [67.8, 27.2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Qambar Shahdadkot",
        severity: "CRITICAL",
        floodedAreaKm2: 650.3,
        observationDate: "2024-08-22",
        population: 148000,
        villages: 260,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.4, 27.5], [67.9, 27.5], [67.9, 28.0], [67.4, 28.0], [67.4, 27.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Jacobabad",
        severity: "CRITICAL",
        floodedAreaKm2: 580.1,
        observationDate: "2024-08-22",
        population: 132000,
        villages: 230,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.2, 27.9], [68.8, 27.9], [68.8, 28.4], [68.2, 28.4], [68.2, 27.9]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Shikarpur",
        severity: "HIGH",
        floodedAreaKm2: 490.7,
        observationDate: "2024-08-22",
        population: 112000,
        villages: 196,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.5, 27.8], [69.0, 27.8], [69.0, 28.2], [68.5, 28.2], [68.5, 27.8]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Sukkur",
        severity: "HIGH",
        floodedAreaKm2: 420.5,
        observationDate: "2024-08-22",
        population: 96000,
        villages: 168,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.7, 27.5], [69.2, 27.5], [69.2, 27.9], [68.7, 27.9], [68.7, 27.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Khairpur",
        severity: "HIGH",
        floodedAreaKm2: 380.2,
        observationDate: "2024-08-22",
        population: 87000,
        villages: 152,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.0, 27.0], [69.6, 27.0], [69.6, 27.5], [69.0, 27.5], [69.0, 27.0]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Naushahro Feroze",
        severity: "HIGH",
        floodedAreaKm2: 310.9,
        observationDate: "2024-08-22",
        population: 71000,
        villages: 124,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.5, 26.5], [69.0, 26.5], [69.0, 27.0], [68.5, 27.0], [68.5, 26.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Nawabshah",
        severity: "MODERATE",
        floodedAreaKm2: 265.4,
        observationDate: "2024-08-22",
        population: 61000,
        villages: 106,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.2, 26.2], [68.7, 26.2], [68.7, 26.6], [68.2, 26.6], [68.2, 26.2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Sanghar",
        severity: "MODERATE",
        floodedAreaKm2: 230.1,
        observationDate: "2024-08-22",
        population: 53000,
        villages: 92,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.5, 25.8], [69.1, 25.8], [69.1, 26.3], [68.5, 26.3], [68.5, 25.8]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Mirpurkhas",
        severity: "MODERATE",
        floodedAreaKm2: 198.3,
        observationDate: "2024-08-22",
        population: 45000,
        villages: 79,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.0, 25.4], [69.5, 25.4], [69.5, 25.9], [69.0, 25.9], [69.0, 25.4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Badin",
        severity: "LOW",
        floodedAreaKm2: 125.0,
        observationDate: "2024-08-22",
        population: 29000,
        villages: 50,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.5, 24.5], [69.0, 24.5], [69.0, 25.0], [68.5, 25.0], [68.5, 24.5]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Thatta",
        severity: "LOW",
        floodedAreaKm2: 108.4,
        observationDate: "2024-08-22",
        population: 25000,
        villages: 43,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.7, 24.2], [68.3, 24.2], [68.3, 24.7], [67.7, 24.7], [67.7, 24.2]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        district: "Hyderabad",
        severity: "LOW",
        floodedAreaKm2: 95.2,
        observationDate: "2024-08-22",
        population: 22000,
        villages: 38,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.2, 25.1], [68.6, 25.1], [68.6, 25.5], [68.2, 25.5], [68.2, 25.1]
        ]]
      }
    },
  ]
};

// Permanent water bodies (rivers, lakes)
export const permanentWaterGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Indus River (Main Channel)", type: "river" },
      geometry: {
        type: "LineString",
        coordinates: [
          [68.5, 28.4], [68.4, 27.8], [68.3, 27.3], [68.2, 26.8],
          [68.1, 26.3], [68.0, 25.8], [67.9, 25.3], [67.8, 24.8],
          [67.7, 24.3], [67.6, 24.0]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Manchhar Lake", type: "lake" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.5, 26.3], [67.8, 26.3], [67.8, 26.6], [67.5, 26.6], [67.5, 26.3]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Guddu Barrage Reservoir", type: "reservoir" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [69.5, 28.3], [69.8, 28.3], [69.8, 28.5], [69.5, 28.5], [69.5, 28.3]
        ]]
      }
    }
  ]
};

// Agricultural land zones
export const agriculturalLandGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { district: "Dadu", cropType: "Rice & Cotton", areaKm2: 340.2 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.6, 26.4], [68.0, 26.4], [68.0, 26.7], [67.6, 26.7], [67.6, 26.4]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Larkana", cropType: "Wheat & Rice", areaKm2: 298.5 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [67.9, 27.3], [68.3, 27.3], [68.3, 27.6], [67.9, 27.6], [67.9, 27.3]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Sukkur", cropType: "Cotton & Sugarcane", areaKm2: 175.2 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.8, 27.6], [69.1, 27.6], [69.1, 27.8], [68.8, 27.8], [68.8, 27.6]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { district: "Nawabshah", cropType: "Sugarcane & Wheat", areaKm2: 110.5 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [68.3, 26.3], [68.6, 26.3], [68.6, 26.5], [68.3, 26.5], [68.3, 26.3]
        ]]
      }
    },
  ]
};

// Village/settlement locations
export const villageLocations = [
  { name: "Mehar", lat: 67.78, lng: 26.13, severity: "CRITICAL", district: "Dadu", population: 42000 },
  { name: "Johi", lat: 67.60, lng: 26.70, severity: "CRITICAL", district: "Dadu", population: 18000 },
  { name: "Khairpur Nathan Shah", lat: 67.75, lng: 26.97, severity: "CRITICAL", district: "Dadu", population: 25000 },
  { name: "Larkana City", lat: 68.21, lng: 27.56, severity: "CRITICAL", district: "Larkana", population: 490000 },
  { name: "Ratodero", lat: 68.29, lng: 27.80, severity: "CRITICAL", district: "Larkana", population: 110000 },
  { name: "Qambar", lat: 67.81, lng: 27.57, severity: "CRITICAL", district: "Qambar Shahdadkot", population: 95000 },
  { name: "Jacobabad City", lat: 68.44, lng: 28.28, severity: "CRITICAL", district: "Jacobabad", population: 200000 },
  { name: "Thul", lat: 69.14, lng: 28.24, severity: "CRITICAL", district: "Jacobabad", population: 35000 },
  { name: "Shikarpur City", lat: 68.64, lng: 27.95, severity: "HIGH", district: "Shikarpur", population: 155000 },
  { name: "Sukkur City", lat: 68.87, lng: 27.70, severity: "HIGH", district: "Sukkur", population: 500000 },
  { name: "Rohri", lat: 68.90, lng: 27.68, severity: "HIGH", district: "Sukkur", population: 85000 },
  { name: "Khairpur City", lat: 69.08, lng: 27.52, severity: "HIGH", district: "Khairpur", population: 125000 },
  { name: "Gambat", lat: 68.52, lng: 27.35, severity: "HIGH", district: "Khairpur", population: 65000 },
  { name: "Nawabshah City", lat: 68.41, lng: 26.24, severity: "MODERATE", district: "Nawabshah", population: 220000 },
  { name: "Sanghar City", lat: 68.95, lng: 26.04, severity: "MODERATE", district: "Sanghar", population: 95000 },
  { name: "Mirpurkhas City", lat: 69.01, lng: 25.53, severity: "MODERATE", district: "Mirpurkhas", population: 180000 },
  { name: "Badin City", lat: 68.84, lng: 24.65, severity: "LOW", district: "Badin", population: 130000 },
  { name: "Thatta City", lat: 67.92, lng: 24.75, severity: "LOW", district: "Thatta", population: 45000 },
  { name: "Hyderabad City", lat: 68.37, lng: 25.37, severity: "LOW", district: "Hyderabad", population: 1750000 },
  { name: "Kotri", lat: 68.31, lng: 25.36, severity: "LOW", district: "Hyderabad", population: 55000 },
];
