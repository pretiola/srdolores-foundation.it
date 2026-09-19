(function () {
  'use strict';
  var details = window.PaymentDetails;
  if (!details) return;
  var address = details.ethereumAddress;
  var counter = document.getElementById('crypto-counter');

  // Plain payment instructions are already in the HTML. Add controls only
  // when their required browser APIs are available.
  if (window.QRCode && typeof QRCode.toCanvas === 'function') {
    var bankHost = document.getElementById('bank-qr');
    var cryptoHost = document.getElementById('crypto-qr');
    var bankCanvas = document.createElement('canvas');
    bankCanvas.id = 'qr-canvas';
    bankCanvas.setAttribute('role', 'img');
    bankCanvas.setAttribute('aria-label', 'SEPA bank transfer QR code; payment details are listed below');
    var cryptoCanvas = document.createElement('canvas');
    cryptoCanvas.id = 'crypto-qr-canvas';
    cryptoCanvas.setAttribute('role', 'img');
    cryptoCanvas.setAttribute('aria-label', 'Ethereum address QR code; send EURC on Ethereum Mainnet only');
    var options = { errorCorrectionLevel: 'Q', margin: 4, scale: 6,
      color: { dark: '#8b0000', light: '#ffffff' } };
    var controls = document.getElementById('bank-qr-controls');
    var buttons = [];

    function renderBank(preset) {
      var payload = details.bankPayload(preset);
      return QRCode.toCanvas(bankCanvas, payload, options).then(function () {
        bankHost.appendChild(bankCanvas);
        document.getElementById('amount-label').textContent = preset ? '€40.00' : 'Custom / Enter in App';
        buttons.forEach(function (button, index) {
          var selected = preset === (index === 1);
          button.classList.toggle('active', selected);
          button.setAttribute('aria-pressed', String(selected));
        });
      }).catch(function () {
        bankHost.textContent = 'QR code unavailable. Use the bank details below.';
        controls.textContent = '';
        document.getElementById('amount-label').textContent = 'Custom / Enter in App';
      });
    }

    ['Custom amount', '€40.00 preset'].forEach(function (label, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'bank-btn';
      button.textContent = label;
      button.addEventListener('click', function () { renderBank(index === 1); });
      buttons.push(button);
      controls.appendChild(button);
    });
    controls.className = 'bank-toggle-container';
    renderBank(false);
    QRCode.toCanvas(cryptoCanvas, details.ethereumUri, options).then(function () {
      cryptoHost.appendChild(cryptoCanvas);
    }).catch(function () {
      cryptoHost.textContent = 'QR code unavailable. Use the Ethereum address below.';
    });
  }

  if (navigator.clipboard && window.isSecureContext) {
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'bank-btn';
    copy.textContent = 'Copy Ethereum address';
    var status = document.createElement('span');
    status.setAttribute('role', 'status');
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(address).then(function () {
        status.textContent = ' Address copied.';
      }).catch(function () {
        status.textContent = ' Could not copy. Select and copy the address above.';
      });
    });
    document.getElementById('crypto-copy-controls').appendChild(copy);
    document.getElementById('crypto-copy-controls').appendChild(status);
  }

  if (window.fetch && counter) {
    fetch('/api/crypto/total-donated').then(function (response) {
      if (!response.ok) throw new Error('Total unavailable');
      return response.json();
    }).then(function (data) {
      if (typeof data.total_eurc === 'number' && isFinite(data.total_eurc) && data.total_eurc >= 0) {
        counter.textContent = data.total_eurc.toFixed(2) + ' EURC';
      }
    }).catch(function () { /* Keep the honest static fallback and ledger link. */ });
  }
})();
