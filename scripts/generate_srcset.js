// Node script to generate resized images and WebP/AVIF variants using sharp
// Usage: node generate_srcset.js images/hero.jpg

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [320, 480, 768, 1024, 1600];
(async ()=>{
  const input = process.argv[2];
  if (!input) { console.error('Provide input image'); process.exit(1); }
  const ext = path.extname(input);
  const name = path.basename(input, ext);
  const dir = path.dirname(input);
  for (const w of sizes) {
    const outJpeg = path.join(dir, `${name}-${w}.jpg`);
    const outWebp = path.join(dir, `${name}-${w}.webp`);
    const outAvif = path.join(dir, `${name}-${w}.avif`);
    await sharp(input).resize({width: w}).jpeg({quality:80}).toFile(outJpeg);
    await sharp(input).resize({width: w}).webp({quality:75}).toFile(outWebp);
    await sharp(input).resize({width: w}).avif({quality:60}).toFile(outAvif);
    console.log('Written', outJpeg, outWebp, outAvif);
  }
})();
