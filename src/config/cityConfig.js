// Central Configuration Blueprint for Kochi Metro Portal
export const CITY_CONFIG = {
  cityName: 'Kochi',
  systemName: 'Kochi Metro',
  tagline: 'Official Route & Station Guide',
  operatorName: 'Kochi Metro Rail Limited (KMRL)',
  domain: 'kochi.metro.org.in',
  storagePrefix: 'km_',
  themeColor: '#005DAA',
  
  // Center coordinates for map view and GPS fallback (Esplanade / Central Kolkata)
  mapCenter: { lat: 22.5645, lng: 88.3517 },
  
  // Default stations for route finder
  defaultFromStationId: 'line1',
  defaultToStationId: 'line1',
  
  // Search input placeholders
  searchPlaceholders: 'Aluva, Edapally, JLN Stadium, MG Road, Tripunithura...',
  
  // Network operators for parking & timing modals
  defaultNetworkKey: 'KOCHI',

  // SEO default tags
  metaTitle: 'Kochi Metro Route Finder | Interactive Map, Fares & Station Timings',
  metaDescription: 'Calculate fastest routes, fares, travel time, and line interchange details for Kochi Metro (Line 1 Blue, Line 2 Green, Line 3 Purple, Line 6 Orange) with interactive station map.'
};
