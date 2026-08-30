import fs from "fs";
import path from "path";
import { STATIONS } from "../src/data/stations.js";

const stations = STATIONS;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function getStationSlug(station) {
  return slugify(station.name);
}

const BASE_URL = "https://kochi.metro.org.in";
const today = new Date().toISOString().split("T")[0];

console.log(`Starting Instant Complete Sitemap Generation for ${stations.length} stations...`);

const allRouteUrls = [];

stations.forEach(fromSt => {
  const fromSlug = getStationSlug(fromSt);
  stations.forEach(toSt => {
    if (fromSt.id !== toSt.id) {
      const toSlug = getStationSlug(toSt);
      allRouteUrls.push(`${BASE_URL}/route/${fromSlug}/${toSlug}/`);
    }
  });
});

console.log(`Gathered ${allRouteUrls.length} total route URLs.`);

const MAX_URLS_PER_SITEMAP = 10000;
const sitemapFiles = [];

for (let i = 0; i < allRouteUrls.length; i += MAX_URLS_PER_SITEMAP) {
  const chunk = allRouteUrls.slice(i, i + MAX_URLS_PER_SITEMAP);
  const fileIndex = Math.floor(i / MAX_URLS_PER_SITEMAP) + 1;
  const fileName = `sitemap-${fileIndex}.xml`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  chunk.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const publicPath = path.resolve("public", fileName);
  fs.writeFileSync(publicPath, xml, "utf8");
  console.log(`Wrote ${chunk.length} route URLs to public/${fileName}`);
  sitemapFiles.push(fileName);
}

// Generate Home / Static Pages Sitemap
let homeXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
homeXml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
homeXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

const staticPages = [
  "",
  "about/",
  "contact/",
  "privacy-policy/",
  "terms-of-service/",
  "disclaimer/",
  "stations/"
];

staticPages.forEach(p => {
  homeXml += `  <url>\n`;
  homeXml += `    <loc>${BASE_URL}/${p}</loc>\n`;
  homeXml += `    <lastmod>${today}</lastmod>\n`;
  homeXml += `    <changefreq>daily</changefreq>\n`;
  homeXml += `    <priority>${p === "" ? "1.0" : "0.7"}</priority>\n`;
  homeXml += `  </url>\n`;
});

// Station SEO Pages
stations.forEach(st => {
  homeXml += `  <url>\n`;
  homeXml += `    <loc>${BASE_URL}/station/${getStationSlug(st)}/</loc>\n`;
  homeXml += `    <lastmod>${today}</lastmod>\n`;
  homeXml += `    <changefreq>weekly</changefreq>\n`;
  homeXml += `    <priority>0.9</priority>\n`;
  homeXml += `  </url>\n`;
});

homeXml += `</urlset>\n`;

fs.writeFileSync(path.resolve("public", "sitemap-home.xml"), homeXml, "utf8");
sitemapFiles.unshift("sitemap-home.xml");

// Master Index Sitemap
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
indexXml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

sitemapFiles.forEach(file => {
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>${BASE_URL}/${file}</loc>\n`;
  indexXml += `    <lastmod>${today}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
});

indexXml += `</sitemapindex>\n`;

fs.writeFileSync(path.resolve("public", "sitemap.xml"), indexXml, "utf8");
console.log(`Successfully generated 100% Complete Sitemap Index (${stations.length} stations, ${allRouteUrls.length} route pairs, 7 core pages) at public/sitemap.xml`);
