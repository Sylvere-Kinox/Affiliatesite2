const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // List of URLs to prerender (relative to site root)
  const urls = [
    '/',
    '/top10.html',
    '/blog.html',
    '/comparator.html',
    '/faq.html',
    '/jura-e8.html',
    '/krups-evidence-ea815b.html',
    '/legal.html',
    '/nespresso-vertuo-next.html',
    '/philips-serie-5000.html',
    '/philips-serie-5500-lattego.html',
    '/philips-series-3200.html',
    '/saeco-picobaristo.html',
    '/siemens-eq9-s500.html',
    '/tendances-cafe-2026.html',
    '/product.html',
    '/guest-article-1.html',
    '/guest-article-2.html',
    '/guest-article-3.html',
    '/breville-barista-express.html',
    '/delonghi-dinamica.html'
  ];

  const baseUrl = 'file://' + path.resolve(__dirname, '..'); // Parent directory

  for (const urlPath of urls) {
    const fullUrl = baseUrl + urlPath;
    console.log(`Prerendering ${fullUrl}...`);
    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      const html = await page.content();
      const outputPath = path.join(__dirname, '..', 'prerendered', urlPath === '/' ? 'index.html' : urlPath);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
      console.log(`Saved to ${outputPath}`);
    } catch (error) {
      console.error(`Error prerendering ${fullUrl}:`, error.message);
    }
  }

  await browser.close();
  console.log('Prerendering complete.');
})();