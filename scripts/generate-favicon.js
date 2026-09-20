// Preserve the portrait source; derive a contrasting circular favicon and fallbacks.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.join(__dirname, '..');
(async () => {
  const original = fs.readFileSync(path.join(root, 'static/pictures/sr-dolores_t_512.svg'), 'utf8');
  const artwork = original.slice(original.indexOf('>', original.indexOf('<svg')) + 1, original.lastIndexOf('</svg>'));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#8b0000"/><g transform="translate(51.2 51.2) scale(0.8)">' + artwork + '</g></svg>\n';
  fs.writeFileSync(path.join(root, 'static/favicon.svg'), svg);
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(root, 'static/favicon-32.png'));
  await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(root, 'static/apple-touch-icon.png'));
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(size => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()));
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((data, i) => {
    const entry = 6 + i * 16;
    header[entry] = sizes[i]; header[entry + 1] = sizes[i];
    header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  fs.writeFileSync(path.join(root, 'static/favicon.ico'), Buffer.concat([header, ...images]));
})();
