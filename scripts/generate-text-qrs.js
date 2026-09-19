// Uses the same local QR encoder and payment payloads as the browser.
// Committed text files work in Lynx and do not require JavaScript or an API.
const fs = require('node:fs');
const path = require('node:path');
const QRCode = require('../static/js/qrcode.min.js');
const details = require('../static/js/payment-details.js');
const output = path.join(__dirname, '../static/qr');
const check = process.argv.includes('--check');
const jobs = [
  ['bank-custom', 'Bank transfer - custom amount', details.bankPayload(false),
    ['Beneficiary: ' + details.beneficiary, 'IBAN: ' + details.iban,
     'BIC: ' + details.bic, 'Remittance: ' + details.remittance, 'Amount: enter in your banking app']],
  ['bank-40', 'Bank transfer - EUR 40.00', details.bankPayload(true),
    ['Beneficiary: ' + details.beneficiary, 'IBAN: ' + details.iban,
     'BIC: ' + details.bic, 'Remittance: ' + details.remittance, 'Amount: EUR 40.00']],
  ['ethereum-eurc', 'EURC on Ethereum Mainnet', details.ethereumUri,
    ['Token: EURC', 'Network: Ethereum Mainnet', 'Address: ' + details.ethereumAddress,
     'This QR encodes the recipient address; select EURC in your wallet.']]
];
if (!check) fs.mkdirSync(output, { recursive: true });
for (const [name, title, payload, instructions] of jobs) {
  const modules = QRCode.create(payload, { errorCorrectionLevel: 'Q' }).modules;
  const size = modules.size + 8;
  const dark = (x, y) => x >= 4 && y >= 4 && x < size - 4 && y < size - 4 && modules.get(y - 4, x - 4);
  for (const ascii of [false, true]) {
    const lines = [];
    for (let y = 0; y < size; y += ascii ? 1 : 2) {
      let line = '';
      for (let x = 0; x < size; x++) {
        line += ascii ? (dark(x, y) ? '##' : '  ')
          : [' ', '▄', '▀', '█'][(dark(x, y) ? 2 : 0) + (dark(x, y + 1) ? 1 : 0)];
      }
      lines.push(line);
    }
    const width = ascii ? size * 2 : size;
    const heading = [title, '', ascii ? 'ASCII QR (## represents a dark square).' : 'Text QR (UTF-8 block characters).',
      `Keep the diagram unwrapped: at least ${width} columns.`,
      'Use a fixed-width font with dark text on a light background.',
      ascii ? 'For scanning, the compact block-character version is recommended.' : 'Scanning depends on your terminal font, zoom and payment app.',
      'The written payment details below remain available.', ''];
    const content = heading.join('\n') + '\n' + lines.join('\n') + '\n\n' + instructions.join('\n') + '\n';
    const file = path.join(output, name + (ascii ? '-ascii' : '') + '.txt');
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) throw new Error('Text QR is stale: ' + file);
    } else fs.writeFileSync(file, content);
  }
}
console.log(check ? 'All six text QR files match the current payment payloads.' : 'Generated six text QR files.');
