<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | Kochi Metro Route Finder</title>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="https://kochi.metro.org.in/favicon.svg?v=2" />
        <link rel="icon" type="image/png" sizes="48x48" href="https://kochi.metro.org.in/favicon-48x48.png?v=2" />
        <link rel="shortcut icon" href="https://kochi.metro.org.in/favicon.ico?v=2" />
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; padding: 2rem; margin: 0; }
          .container { max-width: 1100px; margin: 0 auto; background: #0f172a; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #1e293b; }
          h1 { color: #e52e2d; font-size: 1.75rem; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; }
          p { color: #94a3b8; font-size: 0.95rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
          th { text-align: left; background: #1e293b; padding: 0.75rem 1rem; font-size: 0.85rem; text-transform: uppercase; color: #cbd5e1; }
          td { padding: 0.75rem 1rem; border-bottom: 1px solid #1e293b; font-size: 0.85rem; }
          a { color: #38bdf8; text-decoration: none; font-weight: 500; word-break: break-all; }
          a:hover { text-decoration: underline; color: #7dd3fc; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚇 Kochi Metro Route Finder — XML Sitemap</h1>
          <p>This is the official XML Sitemap index &amp; route list for kochi.metro.org.in, generated for Google Search.</p>

          <xsl:if test="sitemap:sitemapindex">
            <table>
              <thead>
                <tr>
                  <th>Sitemap Chunk</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <xsl:if test="sitemap:urlset">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Frequency</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                    <td><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><xsl:value-of select="sitemap:priority"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
