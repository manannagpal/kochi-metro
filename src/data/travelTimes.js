// Central Configuration for Travel Time Penalties and Transfer Buffer Times

export const INTERCHANGE_PENALTIES = {
  default: 4,               // Standard transfer walking + wait time (mins)
  major: 5,                 // Major hub transfer wait time (mins)
  cross_platform: 2,        // Platform switch across same platform (mins)
  walkway: 5,               // FOB / long tunnel travelator (mins)
  paid_area_transfer: 5,     // Dedicated paid area transfer (mins)
  nearby_station_transfer: 8 // Walking / shuttle between different stations (mins)
};

export const CONSTANTS = {
  STATION_STOP_BUFFER_MINS: 0.4, // Extra dwelling time per intermediate stop (mins)
  AVERAGE_TRAIN_WAIT_MINS: 2.0    // Initial platform train wait time (mins)
};
