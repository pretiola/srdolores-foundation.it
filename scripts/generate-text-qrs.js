// Uses the same local QR encoder and payment payloads as the browser.
// Committed text files work in Lynx and do not require JavaScript or an API.
const fs = require('node:fs');
const path = require('node:path');
const QRCode = require('../static/js/qrcode.min.js');
const details = require('../static/js/payment-details.js');
const output = path.join(__dirname, '../static/qr');
const check = process.argv.includes('--check');
const jobs = [
  ['bank-custom', 'Bank transfer - custom amount', details.bankPayload(false)],
  ['bank-40', 'Bank transfer - EUR 40.00', details.bankPayload(true)],
  ['ethereum-eurc', 'EURC on Ethereum Mainnet', details.ethereumUri]
];
if (!check) fs.mkdirSync(output, { recursive: true });
for (const [name, title, payload] of jobs) {
  const modules = QRCode.create(payload, { errorCorrectionLevel: 'L' }).modules;
  const size = modules.size + 8;
  const dark = (x, y) => x >= 4 && y >= 4 && x < size - 4 && y < size - 4 && modules.get(y - 4, x - 4);
  const lines = [];
  // Two vertical modules per terminal cell; retain the four-module quiet zone.
  for (let y = 0; y < size; y += 2) {
    let line = '';
    for (let x = 0; x < size; x++) {
      line += [' ', '▄', '▀', '█'][(dark(x, y) ? 2 : 0) + (dark(x, y + 1) ? 1 : 0)];
    }
    lines.push(line);
  }
  // The parent page already has full written instructions. Keep this view small.
  const content = title + '\n' + lines.join('\n') + '\n';
  if (lines.length + 1 > 24 || size > 80) throw new Error('QR exceeds an 80x24 terminal: ' + name);
  // Preserve old bookmarks, but replace the oversized ASCII layout everywhere.
  for (const suffix of ['', '-ascii']) {
    const file = path.join(output, name + suffix + '.txt');
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw new Error('Text QR is stale: ' + file);
    } else fs.writeFileSync(file, content);
  }
}
console.log(check ? 'All text QR files match and fit within 80 columns by 24 rows.' : 'Generated compact text QR files.');
