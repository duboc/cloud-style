const packs = new Map();
const activePacks = new WeakMap();

export const DEMO_PACK_IDS = [
  'image-studio',
  'video-studio',
  'analytics',
  'databases',
  'business-flows',
];

/** @param {import('./types.js').DemoPack} pack */
export function registerDemoPack(pack) {
  if (!pack?.id || typeof pack.render !== 'function') {
    throw new TypeError('A demo pack requires an id and render function.');
  }
  if (packs.has(pack.id)) throw new Error(`Demo pack already registered: ${pack.id}`);
  packs.set(pack.id, pack);
  return pack;
}

export function getDemoPack(id) {
  return packs.get(id) || null;
}

export function unmountDemoPack(host) {
  const pack = activePacks.get(host);
  if (pack) pack.unmount?.(host);
  activePacks.delete(host);
  delete host.dataset.demoPack;
  host.replaceChildren();
}

export function mountDemoPack(host, id, data = {}) {
  unmountDemoPack(host);
  const pack = getDemoPack(id);
  if (!pack) {
    host.innerHTML = `<div class="gc-pack-unavailable" role="status">
      <strong>Demo unavailable</strong>
      <span>This sample pack has not been installed.</span>
    </div>`;
    return null;
  }
  host.dataset.demoPack = pack.id;
  host.innerHTML = pack.render(data);
  activePacks.set(host, pack);
  pack.mount?.(host, data);
  return pack;
}
