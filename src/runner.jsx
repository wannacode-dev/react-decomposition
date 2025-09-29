function getEntryFromEnvOrUrl() {
  const fromEnv = import.meta.env.VITE_ENTRY;
  if (fromEnv && typeof fromEnv === 'string') {
    return fromEnv;
  }
  const url = new URL(window.location.href);
  console.log('url', url);
  const fromQuery = url.searchParams.get('f');
  console.log('fromQuery', fromQuery);
  return fromQuery || null;
}

function normalizeToVitePath(entry) {
  let normalized = entry.replace(/\\/g, '/');
  if (normalized.startsWith('./')) normalized = normalized.slice(2);
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  return normalized;
}

async function run() {
  try {
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    if (!window.React) {
      window.React = React;
    }
    if (!window.ReactDOM) {
      window.ReactDOM = ReactDOM;
    }
  } catch (e) {
    console.error(e);
  }
  const entry = getEntryFromEnvOrUrl();

  console.log('entry', entry);
  if (!entry) {
    const el = document.getElementById('root');
    if (el) {
      el.innerHTML = '<pre style="white-space:pre-wrap">Не указан VITE_ENTRY или параметр URL ?f=путь/к/файлу</pre>';
    }
    return;
  }
  const path = normalizeToVitePath(entry);
  try {
    if (path.toLowerCase().endsWith('.html')) {
      window.location.replace(path);
      return;
    }
    await import(/* @vite-ignore */ path);
  } catch (error) {
    const el = document.getElementById('root');
    if (el) {
      el.innerHTML = `<pre style="white-space:pre-wrap">Ошибка импорта: ${path}\n${error && error.stack || error}</pre>`;
    }
    console.error(error);
  }
}

run();


