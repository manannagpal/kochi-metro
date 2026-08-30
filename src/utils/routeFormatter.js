/**
 * Natural language route explanation generator.
 */
export function generateRouteSummary(route, lang = 'en') {
  if (!route || !route.legs || route.legs.length === 0) return '';

  if (lang === 'hi') {
    return generateHindiSummary(route);
  }

  const parts = [];
  route.legs.forEach((leg, index) => {
    const lineName = leg.lineDef ? leg.lineDef.name : leg.lineId;
    if (index === 0) {
      parts.push(`Take the ${lineName} from ${leg.fromStationName} towards ${leg.direction}.`);
    } else {
      parts.push(`Change at ${leg.fromStationName} to the ${lineName} towards ${leg.direction}.`);
    }
  });

  const lastLeg = route.legs[route.legs.length - 1];
  parts.push(`Get down at ${lastLeg.toStationName}.`);

  return parts.join(' ');
}

function generateHindiSummary(route) {
  const parts = [];
  route.legs.forEach((leg, index) => {
    const lineName = leg.lineDef ? leg.lineDef.name : leg.lineId;
    if (index === 0) {
      parts.push(`${leg.fromStationName} से ${leg.direction} की ओर ${lineName} लें।`);
    } else {
      parts.push(`${leg.fromStationName} पर ${lineName} (${leg.direction} की ओर) में बदलें।`);
    }
  });

  const lastLeg = route.legs[route.legs.length - 1];
  parts.push(`${lastLeg.toStationName} पर उतरें।`);

  return parts.join(' ');
}
