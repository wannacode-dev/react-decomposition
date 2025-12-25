function getEntryFromEnvOrUrl() {
  const fromEnv = import.meta.env.VITE_ENTRY;
  if (fromEnv && typeof fromEnv === 'string') {
    return fromEnv;
  }
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get('f');
  return fromQuery || null;
}

function normalizeToVitePath(entry) {
  let normalized = entry.replace(/\\/g, '/');
  if (normalized.startsWith('./')) normalized = normalized.slice(2);
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  return normalized;
}

async function run() {
  let React, ReactDOM;
  try {
    React = await import('react');
    ReactDOM = await import('react-dom/client');
    if (!window.React) {
      window.React = React;
    }
    if (!window.ReactDOM) {
      window.ReactDOM = ReactDOM;
    }
  } catch (e) {
    // ok
  }
  const entry = getEntryFromEnvOrUrl();
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
    const module = await import(/* @vite-ignore */ path);
    
    // Если модуль экспортирует default компонент - рендерим его
    if (module.default && ReactDOM) {
      const el = document.getElementById('root');
      if (el) {
        const root = ReactDOM.createRoot(el);
        root.render(React.createElement(module.default));
      }
    }
  } catch (error) {
    const el = document.getElementById('root');
    if (el) {
      el.innerHTML = `<pre style="white-space:pre-wrap">Ошибка импорта: ${path}\n${error && error.stack || error}</pre>`;
    }
    console.error(error);
  }
}

run();


