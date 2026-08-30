/**
 * Utility to resolve active metro city from browser hostname.
 * Supports both standard and www subdomains:
 * - delhi.metro.org.in -> "delhi"
 * - www.delhi.metro.org.in -> "delhi"
 */
export function getActiveCityId() {
  if (typeof window === "undefined") return "delhi";
  
  const hostname = window.location.hostname.toLowerCase();
  const cleanHostname = hostname.startsWith("www.") ? hostname.substring(4) : hostname;
  
  if (cleanHostname.includes(".metro.org.in")) {
    const subdomainPart = cleanHostname.split(".metro.org.in")[0];
    const parts = subdomainPart.split(".");
    const citySubdomain = parts[parts.length - 1];
    if (citySubdomain && citySubdomain !== "metro") {
      return citySubdomain;
    }
  }

  return "delhi";
}
