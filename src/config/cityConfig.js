// Central Configuration Blueprint for Kolkata Metro Portal
export const CITY_CONFIG = {
  cityName: 'Kolkata',
  systemName: 'Kolkata Metro',
  tagline: 'Official Route & Station Guide',
  operatorName: 'Metro Railway Kolkata',
  domain: 'kolkata.metro.org.in',
  storagePrefix: 'km_',
  themeColor: '#005DAA',
  
  // Center coordinates for map view and GPS fallback (Esplanade / Central Kolkata)
  mapCenter: { lat: 22.5645, lng: 88.3517 },
  
  // Default stations for route finder
  defaultFromStationId: 'howrah-maidan',
  defaultToStationId: 'salt-lake-sector-v',
  
  // Search input placeholders
  searchPlaceholders: 'Howrah, Esplanade, Salt Lake Sector V...',
  
  // Network operators for parking & timing modals
  defaultNetworkKey: 'KOLKATA',

  // SEO default tags
  metaTitle: 'Kolkata Metro Route Finder | Interactive Map, Fares & Station Timings',
  metaDescription: 'Calculate fastest routes, fares, travel time, and line interchange details for Kolkata Metro (Line 1 Blue, Line 2 Green, Line 3 Purple, Line 6 Orange) with interactive station map.'
};
