import { IMAGE_STUDIO_SAMPLE } from './sample-data.js';

const controllers = new WeakMap();

export const imageStudioPack = {
  id: 'image-studio',
  label: 'Image Studio',
  description: 'Crop, retouch, compare, and approve a campaign visual.',
  render(data = {}) {
    const sample = { ...IMAGE_STUDIO_SAMPLE, ...data.imageStudio };
    return `<section class="gc-image-studio" data-edit-state="source" aria-label="Image Studio">
      <header class="gc-pack-header">
        <div><strong>Image Studio</strong><span>SIMULATED DATA</span></div>
        <span class="gc-pack-state" data-role="status">Ready to edit</span>
      </header>
      <div class="gc-image-preview" data-role="preview">
        <img src="${sample.asset}" alt="Super Cloud campaign artwork">
        <span class="gc-image-label" data-role="preview-label">Source</span>
      </div>
      <div class="gc-pack-toolbar" aria-label="Image editing controls">
        <button type="button" data-action="crop" aria-pressed="false">Crop</button>
        <button type="button" data-action="retouch" aria-pressed="false">Retouch</button>
        <button type="button" data-action="compare" aria-pressed="false">Compare</button>
        <button type="button" class="gc-pack-primary" data-action="approve">Approve</button>
      </div>
      <p class="gc-image-prompt"><strong>Edit prompt</strong>${sample.prompt}</p>
      <ol class="gc-pack-history" data-role="history" aria-label="Edit history">
        <li>Source opened</li>
      </ol>
    </section>`;
  },
  mount(host) {
    const controller = new AbortController();
    controllers.set(host, controller);
    const studio = host.querySelector('.gc-image-studio');
    const status = host.querySelector('[data-role="status"]');
    const label = host.querySelector('[data-role="preview-label"]');
    const history = host.querySelector('[data-role="history"]');

    host.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'approve') {
        studio.dataset.editState = 'approved';
        status.textContent = 'Approved';
        history.insertAdjacentHTML('beforeend', '<li>Marketing review approved the asset</li>');
        return;
      }
      const active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      if (action === 'compare') {
        studio.classList.toggle('is-comparing', active);
        label.textContent = active ? 'Source comparison' : 'Edited';
      } else {
        studio.classList.toggle(`has-${action}`, active);
        studio.dataset.editState = active ? action : 'edited';
        status.textContent = active ? `${action[0].toUpperCase()}${action.slice(1)} applied` : 'Edited';
        label.textContent = 'Edited';
        history.insertAdjacentHTML('beforeend', `<li>${action[0].toUpperCase()}${action.slice(1)} ${active ? 'applied' : 'removed'}</li>`);
      }
    }, { signal: controller.signal });
  },
  unmount(host) {
    controllers.get(host)?.abort();
    controllers.delete(host);
  },
};
