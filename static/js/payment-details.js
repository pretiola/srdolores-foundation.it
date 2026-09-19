/* Shared by browser QR generation and the build-time text QR generator. */
(function (root) {
  'use strict';
  var details = {
    beneficiary: 'Kasibante Emmanuel',
    iban: 'IT41T3608105138265553265858',
    bic: 'BPPIITRRXXX',
    remittance: 'Sr. Dolores Foundation',
    ethereumAddress: '0x344d169735f17D25E0d3AE8aa00b47F88D613017'
  };
  details.bankPayload = function (preset) {
    return ['BCD', '002', '1', 'SCT', details.bic, details.beneficiary,
      details.iban, preset ? 'EUR40.00' : '', '', '', details.remittance, ''].join('\n');
  };
  details.ethereumUri = 'ethereum:' + details.ethereumAddress;
  if (typeof module === 'object' && module.exports) module.exports = details;
  else root.PaymentDetails = details;
})(typeof window !== 'undefined' ? window : this);
