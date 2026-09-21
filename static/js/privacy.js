(function () {
  'use strict';
  var id = 'G-DBE2Y1QGNN';
  var key = 'srd-privacy-v2';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var panel = document.getElementById('privacy-choices');
  var settings = document.getElementById('privacy-settings');
  var status = document.getElementById('privacy-status');
  var loaded = false;
  window['ga-disable-' + id] = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  window.gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false,
    ads_data_redaction: true, allow_enhanced_conversions: false });
  window.gtag('set', 'user_data', null);

  function readChoice() {
    try {
      var choice = JSON.parse(localStorage.getItem(key));
      if (choice && choice.version === 2 && typeof choice.allowed === 'boolean' && typeof choice.advertising === 'boolean' &&
          choice.time <= Date.now() && Date.now() - choice.time < lifetime) return choice;
    } catch (error) { /* Storage restrictions must never enable analytics. */ }
    return null;
  }
  function clearCookies() {
    var parts = location.hostname.split('.');
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)|^_gcl_/.test(name)) return;
      var expiry = name + '=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie = expiry;
      for (var i = 0; i < parts.length - 1; i++) {
        document.cookie = expiry + '; domain=' + parts.slice(i).join('.');
      }
    });
  }
  function apply(allowed, advertising) {
    advertising = !!(allowed && advertising);
    window['ga-disable-' + id] = !allowed;
    status.textContent = advertising ? 'Analytics and advertising features are enabled.' : (allowed ? 'Analytics are enabled; advertising features are off.' : 'Optional analytics and advertising are off.');
    if (!allowed) { clearCookies(); return; }
    window.gtag('consent', 'update', { analytics_storage: 'granted',
      ad_storage: advertising ? 'granted' : 'denied', ad_user_data: advertising ? 'granted' : 'denied', ad_personalization: advertising ? 'granted' : 'denied' });
    window.gtag('set', { allow_google_signals: advertising, allow_ad_personalization_signals: advertising });
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', id, {
      allow_google_signals: advertising, allow_ad_personalization_signals: advertising,
      allow_enhanced_conversions: false, user_id: null, user_data: null,
      cookie_expires: 15552000, cookie_update: false,
      page_location: location.origin + location.pathname,
      page_referrer: '', send_page_view: true
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function choose(allowed, advertising) {
    try { localStorage.setItem(key, JSON.stringify({ version: 2, allowed: allowed, advertising: !!advertising, time: Date.now() })); } catch (error) {}
    var wasLoaded = loaded;
    apply(allowed, advertising);
    panel.hidden = true;
    settings.focus();
    // Unload Google's library after withdrawal, including its event listeners.
    if (wasLoaded) { window['ga-disable-' + id] = true; clearCookies(); location.reload(); }
  }
  settings.hidden = false;
  settings.addEventListener('click', function () {
    panel.hidden = false;
    document.getElementById('privacy-decline').focus();
  });
  document.getElementById('privacy-accept').addEventListener('click', function () { choose(true, false); });
  document.getElementById('privacy-decline').addEventListener('click', function () { choose(false); });
  document.getElementById('privacy-ads').addEventListener('click', function () { choose(true, true); });
  var saved = readChoice();
  apply(!!(saved && saved.allowed), !!(saved && saved.advertising));
  panel.hidden = !!saved;
  // A withdrawal in another tab also stops collection in this tab.
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) {
      apply(false);
      if (loaded) location.reload();
    }
  });
}());
