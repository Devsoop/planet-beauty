function isValidUtmValue(value) {
  return /^[a-zA-Z0-9-_.]+$/.test(value);
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}

function setWithExpiry(storage, key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  try {
    storage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error('Error setting storage item:', e);
  }
}

function getWithExpiry(storage, key) {
  try {
    const itemStr = storage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      storage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error('Error getting storage item:', e);
    return null;
  }
}

function setInitialUtm() {
  const utmParams = ['utm_source', 'utm_medium', 'utm_referrer'];
  const currentUrl = new URL(window.location.href);
  const initialUtm = {};

  utmParams.forEach((param) => {
    const value = currentUrl.searchParams.get(param);
    if (value) {
      if ((param === 'utm_source' || param === 'utm_medium') && isValidUtmValue(value)) {
        initialUtm[param] = value;
      } else if (param === 'utm_referrer' && isValidUrl(value)) {
        initialUtm[param] = value;
      }
    }
  });

  if (Object.keys(initialUtm).length > 0) {
    const ttl = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    setWithExpiry(localStorage, 'initial_utm', JSON.stringify(initialUtm), ttl);
  }
}

function getInitialUtm() {
  let initialUtm = getWithExpiry(localStorage, 'initial_utm');

  if (!initialUtm) {
    initialUtm = getWithExpiry(sessionStorage, 'initial_utm');
  }

  if (!initialUtm) {
    initialUtm = getInitialUtmFromCookie();
  }

  return initialUtm;
}

function getInitialUtmFromCookie() {
  const cookieName = 'initial_utm=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(cookieName) === 0) {
      return JSON.parse(c.substring(cookieName.length, c.length));
    }
  }

  return null;
}

function getReferrerInfo() {
  const initialUtm = getInitialUtm();
  if (initialUtm) {
    return {
      source: initialUtm.utm_source || 'direct',
      medium: initialUtm.utm_medium || 'none',
      referrer: initialUtm.utm_referrer || document.referrer || '',
    };
  }

  const referrer = document.referrer;
  let source = 'direct';
  let medium = 'none';

  if (referrer) {
    const a = document.createElement('a');
    a.href = referrer;
    source = a.hostname;
    medium = 'referral';
  }

  return { source: source, medium: medium, referrer: referrer };
}
document.addEventListener('DOMContentLoaded', function () {
  setInitialUtm();
  const referrerInfo = getReferrerInfo();

  const internalLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]'));

  internalLinks.forEach(function (link) {
    const url = new URL(link.href);

    const utmParams = [
      { name: 'utm_source', value: referrerInfo.source },
      { name: 'utm_medium', value: referrerInfo.medium },
      { name: 'utm_referrer', value: referrerInfo.referrer },
      // Add more UTM parameters if needed
    ];

    utmParams.forEach(function (utm) {
      url.searchParams.set(utm.name, utm.value);
    });

    link.href = url.toString();
    // console.log('Updated link:', link.href); // Add this line to log the updated link
  });
});
