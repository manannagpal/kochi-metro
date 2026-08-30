import { calculateRoutes } from '../src/routing/routeEngine.js';
import { getStationById } from '../src/data/stations.js';

const howrahMaidan = getStationById('line1');
const saltLakeSectorV = getStationById('line1');
const dakshineswar = getStationById('dakshineswar');
const sealdah = getStationById('sealdah');

console.log("=== TEST 1: Howrah Maidan -> Salt Lake Sector V ===");
const routes1 = calculateRoutes(howrahMaidan, saltLakeSectorV);
if (routes1.length > 0) {
  const r = routes1[0];
  console.log(`Route: ${howrahMaidan.name} -> ${saltLakeSectorV.name}`);
  console.log(`Time: ${r.totalTimeMins} mins, Distance: ${r.totalDistanceKm} km, Fare: ₹${r.fare} (Smart Card: ₹${r.smartCardFare}), Switches: ${r.switches}`);
  r.legs.forEach((leg, i) => {
    console.log(`  Leg ${i+1}: ${leg.lineDef?.name || leg.lineId} (${leg.fromStationName} -> ${leg.toStationName}, ${leg.stopsCount} stops)`);
  });
} else {
  console.error("FAILED TO CALCULATE ROUTE 1");
}

console.log("\n=== TEST 2: Dakshineswar -> Sealdah (Interchange at Esplanade) ===");
const routes2 = calculateRoutes(dakshineswar, sealdah);
if (routes2.length > 0) {
  const r = routes2[0];
  console.log(`Route: ${dakshineswar.name} -> ${sealdah.name}`);
  console.log(`Time: ${r.totalTimeMins} mins, Distance: ${r.totalDistanceKm} km, Fare: ₹${r.fare} (Smart Card: ₹${r.smartCardFare}), Switches: ${r.switches}`);
  r.legs.forEach((leg, i) => {
    console.log(`  Leg ${i+1}: ${leg.lineDef?.name || leg.lineId} (${leg.fromStationName} -> ${leg.toStationName}, ${leg.stopsCount} stops)`);
  });
} else {
  console.error("FAILED TO CALCULATE ROUTE 2");
}
