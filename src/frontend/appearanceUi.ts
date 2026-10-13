import { ACCENTS, DEFAULT_PREFS } from './theme';

export function renderPublicAccentStyles(scope: string): string {
  const tokens = (tone: typeof ACCENTS[number]['dark']) => `--accent:${tone.accent};--accent-hover:${tone.hover};--accent-text:${tone.text};--on-accent:${tone.on};`;
  return `${scope}{${tokens(ACCENTS[0].dark)}}${ACCENTS.map(a => `html[data-accent="${a.id}"] ${scope}{${tokens(a.dark)}}`).join('')}`;
}

// Public pages read the accent chosen in logged-in appearance settings.
export function renderAppearanceHead(publicPage = false): string {
  const palette = Object.fromEntries(ACCENTS.map(a => [a.id, { dark: a.dark, light: a.light }]));
  const tokens = (tone: typeof ACCENTS[number]['dark']) => `--accent:${tone.accent};--accent-hover:${tone.hover};--accent-text:${tone.text};--on-accent:${tone.on};`;
  return `${publicPage ? `<style>:root{${tokens(ACCENTS[0].dark)}--ease-out:cubic-bezier(0.23,1,0.32,1);--dur-press:160ms;--dur-fast:150ms;--dur-base:200ms;} ${ACCENTS.map(a => `html[data-accent="${a.id}"]{${tokens(a.dark)}}`).join('')}</style>` : ''}
    <script>
      (() => {
        const palette = ${JSON.stringify(palette)};
        const root = document.documentElement;
        const read = () => {
          try { const saved = JSON.parse(localStorage.getItem('jesm_prefs') || '{}'); return saved && typeof saved === 'object' ? saved : {}; }
          catch (_) { return {}; }
        };
        const validAccent = value => Object.prototype.hasOwnProperty.call(palette, value) ? value : '${DEFAULT_PREFS.accent}';
        root.setAttribute('data-accent', validAccent(read().accent));
        let lastIcon = '';
        function sync() {
          const accent = validAccent(root.getAttribute('data-accent'));
          const landing = document.getElementById('landing-page');
          const tone = palette[accent][${publicPage ? "'dark'" : "(landing && !landing.hidden) || !root.classList.contains('light') ? 'dark' : 'light'"}];
          const iconKey = tone.accent + tone.on;
          if (iconKey === lastIcon) return;
          lastIcon = iconKey;
          const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="' + tone.accent + '"/><g fill="' + tone.on + '"><rect x="4" y="14.75" width="24" height="2.5" rx="1.25"/><rect x="8.5" y="9" width="3" height="14" rx="1.25"/><rect x="20.5" y="9" width="3" height="14" rx="1.25"/><rect x="5.5" y="11.5" width="2.25" height="9" rx="1"/><rect x="24.25" y="11.5" width="2.25" height="9" rx="1"/></g></svg>';
          // Keep one favicon candidate so a static PNG cannot override the selected color.
          const icons = Array.from(document.querySelectorAll('link[rel="icon"]'));
          const icon = icons.shift() || document.createElement('link');
          icons.forEach(item => item.remove());
          icon.rel = 'icon'; icon.type = 'image/svg+xml'; icon.removeAttribute('sizes');
          icon.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
          if (!icon.isConnected) document.head.appendChild(icon);
        }
        new MutationObserver(sync).observe(root, { attributes:true, attributeFilter:['data-accent','class'] });
        window.addEventListener('storage', event => {
          if (event.key === 'jesm_prefs' || event.key === null) {
            const prefs = read();
            root.setAttribute('data-accent', validAccent(prefs.accent));
            if (typeof applyPrefs === 'function') { applyPrefs(getPrefs()); updateChartTheme(root.classList.contains('dark')); }
            sync();
          }
        });
        window.addEventListener('DOMContentLoaded', () => {
          const landing = document.getElementById('landing-page');
          if (landing) new MutationObserver(sync).observe(landing, {attributes:true,attributeFilter:['hidden']});
          sync();
        });
      })();
    </script>`;
}
