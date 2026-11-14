import fs from "fs";
import path from "path";
import { stations } from "../src/data/kochiMetroData.js";
import { calculateRoutes } from "../src/routing/routeEngine.js";
import { getStationSlug } from "../src/utils/slugify.js";

const BASE_URL = "https://kochi.metro.org.in";
const today = new Date().toISOString().split("T")[0];

console.log(`Starting Staged 100% Parity Sitemap Generation for Kochi Metro (${stations.length} stations)...`);

const publicDir = path.resolve("public");
if (fs.existsSync(publicDir)) {
  fs.readdirSync(publicDir).forEach(f => {
    if (/^sitemap(-\d+)?\.xml$/.test(f) && f !== "sitemap.xml") {
      try { fs.unlinkSync(path.join(publicDir, f)); } catch (_) {}
    }
  });
}

const allRouteUrls = [];

stations.forEach(fromSt => {
  const fromSlug = getStationSlug(fromSt);
  stations.forEach(toSt => {
    if (fromSt.id !== toSt.id) {
      try {
        const routes = calculateRoutes(fromSt.id, toSt.id);
        if (routes && routes.length > 0) {
          const toSlug = getStationSlug(toSt);
          allRouteUrls.push(`${BASE_URL}/route/${fromSlug}/${toSlug}/`);
        }
      } catch (_) {}
    }
  });
});

console.log(`Gathered ${allRouteUrls.length} valid routable pairs for Kochi Metro.`);

// 1. Write sitemap-routes.xml
const routesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRouteUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(publicDir, "sitemap-routes.xml"), routesXml, "utf8");
console.log(`Wrote ${allRouteUrls.length} routes to public/sitemap-routes.xml`);

// 2. Write sitemap-home.xml (Core + All Stations)
const coreUrls = [
  `${BASE_URL}/`,
  `${BASE_URL}/stations/`,
  `${BASE_URL}/about/`,
  `${BASE_URL}/contact/`,
  `${BASE_URL}/privacy-policy/`,
  `${BASE_URL}/terms-of-service/`,
  `${BASE_URL}/disclaimer/`,
  `${BASE_URL}/sitemap/`
];

const stationUrls = stations.map(s => `${BASE_URL}/station/${getStationSlug(s)}/`);

const homeXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...coreUrls, ...stationUrls].map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url === `${BASE_URL}/` ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === `${BASE_URL}/` ? '1.0' : (url.includes('/station/') ? '0.85' : '0.5')}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.join(publicDir, "sitemap-home.xml"), homeXml, "utf8");
console.log(`Wrote ${stations.length} stations and ${coreUrls.length} core pages to public/sitemap-home.xml`);

// 3. Write sitemap index (sitemap.xml)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-home.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-routes.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapIndexXml, "utf8");
console.log(`Successfully generated Staged Sitemap Index (Total URLs: ${allRouteUrls.length + coreUrls.length + stations.length}) at public/sitemap.xml`);
