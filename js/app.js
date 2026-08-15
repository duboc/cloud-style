import { APP_CONFIG } from './config.js';
import { createRouter } from './router.js';
import { renderCover } from './screens/cover.js';
import { renderCatalog } from './screens/catalog.js';
import { renderCards } from './screens/cards.js';
import { renderDetail } from './screens/detail.js';

const esc = value => String(value).replace(/[&<>"']/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const pad = value => String(value + 1).padStart(2, '0');
const mark = (bold, light) => `<b>${esc(bold)}</b><span>${esc(light)}</span>`;

export function startApp({ content, demoHtml }) {
  const screen = document.getElementById('screen');
  const veil = document.getElementById('veil');

  document.getElementById('wordmark').innerHTML = mark(
    content.brand.wordmarkBold,
    content.brand.wordmarkLight,
  );
  document.getElementById('edition').textContent = content.brand.edition;
  document.getElementById('status-label').textContent = APP_CONFIG.status;
  document.querySelectorAll('.gc-nav-link').forEach(button => {
    button.textContent = APP_CONFIG.navigation[button.dataset.go];
  });

  function setActiveNavigation(view) {
    document.querySelectorAll('.gc-nav-link').forEach(button => {
      const active = button.dataset.go === view ||
        (button.dataset.go === 'menu' && ['cards', 'article'].includes(view));
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function render(state) {
    const context = { config: APP_CONFIG, content, state, esc, mark, pad, demoHtml };
    const renderer = {
      cover: renderCover,
      menu: renderCatalog,
      cards: renderCards,
      article: renderDetail,
    }[state.view] || renderCover;
    screen.innerHTML = renderer(context);
    veil.hidden = state.view === 'cover' || state.view === 'menu';
    setActiveNavigation(state.view);
    gcInitRails(screen);
    gcInitDemos(screen);
  }

  const router = createRouter({
    initialState: { view: APP_CONFIG.defaultView },
    onChange: state => gcNavigate(() => render(state)),
  });

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-go]');
    if (!target) return;
    const current = router.getState();
    router.go({
      view: target.dataset.go,
      cat: target.dataset.cat !== undefined ? +target.dataset.cat : current.cat,
      fact: target.dataset.fact !== undefined ? +target.dataset.fact : current.fact,
    });
  });

  document.getElementById('wordmark').addEventListener('click', () => router.go({ view: 'cover' }));

  gcOnKeys({
    home: () => router.go({ view: 'cover' }),
    back: () => {
      const state = router.getState();
      if (state.view === 'article') router.go({ view: 'cards', cat: state.cat });
      else if (state.view === 'cards') router.go({ view: 'menu' });
      else if (state.view === 'menu') router.go({ view: 'cover' });
    },
    next: () => {
      const state = router.getState();
      if (state.view === 'cover') return router.go({ view: 'menu' });
      if (state.view === 'cards') return router.go({ view: 'article', cat: state.cat, fact: 0 });
      if (state.view === 'article' && state.fact + 1 < content.categories[state.cat].facts.length) {
        router.go({ view: 'article', cat: state.cat, fact: state.fact + 1 });
      }
    },
    prev: () => {
      const state = router.getState();
      if (state.view === 'article' && state.fact > 0) {
        return router.go({ view: 'article', cat: state.cat, fact: state.fact - 1 });
      }
      if (state.view === 'article') return router.go({ view: 'cards', cat: state.cat });
      if (state.view === 'cards') return router.go({ view: 'menu' });
      if (state.view === 'menu') return router.go({ view: 'cover' });
    },
  });

  render(router.getState());
  return router;
}
