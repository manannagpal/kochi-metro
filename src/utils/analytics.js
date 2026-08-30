export function logRouteSearch(fromStationName, toStationName) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "search_route", {
      from_station: fromStationName,
      to_station: toStationName,
      route_pair: `${fromStationName} to ${toStationName}`
    });
  }
}

