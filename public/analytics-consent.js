(() => {
  'use strict';
  const id = 'G-J489LXFFLN';
  const key = 'top-mariage-analytics-consent-v1';
  const ttl = 180 * 24 * 60 * 60 * 1000;
  const panel = document.getElementById('analytics-consent');
  const preferences = document.getElementById('analytics-preferences');
  if (!panel || !preferences) return;
  let started = false;
  let choice = null;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && ['granted', 'denied'].includes(stored.value) && Number.isFinite(stored.at) && stored.at <= Date.now() && Date.now() - stored.at < ttl) choice = stored.value;
  } catch {}
  function start() {
    if (started || !['top-mariage.fr', 'www.top-mariage.fr'].includes(location.hostname)) return;
    started = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    script.id = 'top-mariage-ga4';
    document.head.appendChild(script);
  }
  function clearAnalyticsCookies() {
    const domains = ['', location.hostname, '.' + location.hostname, 'top-mariage.fr', '.top-mariage.fr'];
    const paths = new Set(['/']);
    const parts = location.pathname.split('/').filter(Boolean);
    let path = '';
    for (const part of parts) { path += '/' + part; paths.add(path); paths.add(path + '/'); }
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
      for (const domain of domains) for (const cookiePath of paths) document.cookie = name + '=; Max-Age=0; path=' + cookiePath + '; SameSite=Lax; Secure' + (domain ? '; domain=' + domain : '');
    }
  }
  function show() {
    panel.hidden = false;
    preferences.hidden = true;
    panel.querySelector('h2')?.focus();
  }
  function hide() { panel.hidden = true; preferences.hidden = false; }
  preferences.addEventListener('click', show);
  panel.querySelectorAll('[data-analytics-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      choice = button.dataset.analyticsChoice;
      try { localStorage.setItem(key, JSON.stringify({ value: choice, at: Date.now() })); } catch {}
      if (choice === 'granted') { start(); hide(); preferences.focus(); }
      else {
        window['ga-disable-' + id] = true;
        clearAnalyticsCookies();
        if (started) { location.reload(); return; }
        hide();
        preferences.focus();
      }
    });
  });
  if (choice === 'granted') { start(); hide(); }
  else if (choice === 'denied') { window['ga-disable-' + id] = true; clearAnalyticsCookies(); hide(); }
  else { window['ga-disable-' + id] = true; clearAnalyticsCookies(); panel.hidden = false; }
})();
