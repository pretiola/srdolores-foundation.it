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

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error('Clipboard unavailable'));
  }
  function selectText(element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  {
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'bank-btn';
    copy.textContent = 'Copy Ethereum address';
    var status = document.getElementById('crypto-copy-status');
    status.setAttribute('role', 'status');
    copy.addEventListener('click', function () {
      copyText(address).then(function () {
        status.textContent = ' Address copied.';
      }).catch(function () {
        selectText(document.querySelector('#pay-crypto .payment-address'));
        status.textContent = ' Address selected. Copy it using your browser or keyboard.';
      });
    });
    document.getElementById('crypto-copy-controls').appendChild(copy);
    var email = document.getElementById('paypal-email');
    var paypalCopy = document.createElement('button');
    paypalCopy.type = 'button';
    paypalCopy.className = 'paypal-copy-field';
    var paypalAddress = email.textContent;
    var emailLabel = document.createElement('span');
    emailLabel.textContent = paypalAddress;
    paypalCopy.appendChild(emailLabel);
    var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('aria-hidden', 'true');
    var outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outline.setAttribute('d', 'M8 8h12v12H8z M16 8V4H4v12h4');
    icon.appendChild(outline);
    paypalCopy.appendChild(icon);
    paypalCopy.setAttribute('aria-label', 'Copy PayPal email ' + email.textContent);
    paypalCopy.addEventListener('click', function () {
      copyText(paypalAddress).then(function () {
        document.getElementById('paypal-copy-status').textContent = 'Email copied. Paste it into the PayPal app.';
      }).catch(function () {
        selectText(emailLabel);
        document.getElementById('paypal-copy-status').textContent = 'Email selected. Copy it using your browser or keyboard, then paste it into PayPal.';
      });
    });
    email.textContent = '';
    email.appendChild(paypalCopy);
    email.classList.add('is-enhanced');
    document.getElementById('paypal-copy-help').textContent = 'Click the email to copy it to the clipboard for use in the PayPal app.';
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
