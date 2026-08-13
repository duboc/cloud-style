/* =============================================================================
   cloud-style — ICON SPRITE

   Why a JS file and not an .svg sprite?
   `<use href="icons.svg#id">` needs an HTTP origin; it silently fails on
   file://. Shipping the sprite as a string and injecting it keeps the
   templates working whether you double-click the HTML or serve it.

   Usage:
     <script src="js/gc-icons.js"></script>          <!-- anywhere in <head> -->
     <svg class="..."><use href="#gc-icon-home"/></svg>

   All icons are on a 24x24 grid, drawn as strokes in `currentColor`, so they
   inherit the colour of whatever tile or button holds them. Do not add fills
   unless the icon is explicitly a solid (only gc-icon-cloud is).

   To add an icon: append a <symbol> below, keep the 24x24 viewBox, and use
   stroke="currentColor" fill="none" with round caps and joins.
   ========================================================================== */
(function () {
  var SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">

  <!-- 01 · Identity / onboarding. Person inside a shield-hexagon. -->
  <symbol id="gc-icon-identity" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2.5 20.2 7.25V16.75L12 21.5 3.8 16.75V7.25Z"/>
    <circle cx="12" cy="9.9" r="2.3"/>
    <path d="M7.7 16.4C7.7 13.6 16.3 13.6 16.3 16.4"/>
  </symbol>

  <!-- 02 · Catalog / products. Bulleted list in a rounded frame. -->
  <symbol id="gc-icon-catalog" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round">
    <rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3.6"/>
    <circle cx="8" cy="8.8"  r="0.75" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="12"   r="0.75" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="15.2" r="0.75" fill="currentColor" stroke="none"/>
    <path d="M11 8.8H16.6"/>
    <path d="M11 12H16.6"/>
    <path d="M11 15.2H16.6"/>
  </symbol>

  <!-- 03 · Service / accessibility. Figure at a desk with signal marks. -->
  <symbol id="gc-icon-support" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.3"
          stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 2)">
      <path d="M5.2 1.4 6.9 3.1 5.2 4.8 3.5 3.1Z" stroke-width="1"/>
      <circle cx="11.6" cy="0.6" r="1.45" stroke-width="1"/>
      <circle cx="18.4" cy="3.2" r="1.45" stroke-width="1"/>
      <circle cx="12" cy="7" r="2.1" fill="currentColor" stroke="none"/>
      <path d="M4.3 12.8H19.7"/>
      <rect x="8.6" y="12" width="6.8" height="8" rx="1.4"
            fill="currentColor" stroke="none"/>
    </g>
  </symbol>

  <!-- 04 · Mobile trust. Phone with a check and a side button. -->
  <symbol id="gc-icon-mobile-check" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round">
    <rect x="6.5" y="3" width="10.5" height="18" rx="2.8"/>
    <path d="M9.4 12.1 11.1 13.9 14.6 10"/>
    <path d="M17 9.8V12.2"/>
  </symbol>

  <!-- 05 · Open ecosystem. Dashed ring with one solid arc. -->
  <symbol id="gc-icon-open" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="7.6" stroke-dasharray="0.6 2.9"/>
    <path d="M5.1 15.2A7.6 7.6 0 0 0 9.6 19.3"
          stroke-width="2.4" stroke-linecap="round"/>
  </symbol>

  <!-- Home. -->
  <symbol id="gc-icon-home" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9.2 12 2.5 21 9.2V19.5a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 19.5Z"/>
    <path d="M9 21.3V12.5h6v8.8"/>
  </symbol>

  <!-- Back. -->
  <symbol id="gc-icon-back" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 5 8 12 15 19"/>
  </symbol>

  <!-- Google Cloud mark. The one solid icon — it is a logo, not a UI glyph. -->
  <symbol id="gc-icon-cloud" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z"/>
  </symbol>

  <!-- Camera / Vision -->
  <symbol id="gc-icon-camera" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </symbol>

  <!-- Video / Media -->
  <symbol id="gc-icon-video" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </symbol>

  <!-- Play -->
  <symbol id="gc-icon-play" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6 4 20 12 6 20 6 4"/>
  </symbol>

  <!-- Pause -->
  <symbol id="gc-icon-pause" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="6" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="4" width="4" height="16" rx="1"/>
  </symbol>

  <!-- Gemini AI Sparkle -->
  <symbol id="gc-icon-sparkle" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
  </symbol>

  <!-- Send / Arrow -->
  <symbol id="gc-icon-send" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </symbol>

  <!-- Microphone -->
  <symbol id="gc-icon-mic" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </symbol>

  <!-- Terminal / Code -->
  <symbol id="gc-icon-terminal" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <polyline points="4 17 10 11 4 5"/>
    <line x1="12" y1="19" x2="20" y2="19"/>
  </symbol>

  <!-- Shield / Security -->
  <symbol id="gc-icon-shield" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </symbol>

  <!-- Check -->
  <symbol id="gc-icon-check" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </symbol>

  <!-- Database -->
  <symbol id="gc-icon-database" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </symbol>

  <!-- Analytics / Chart -->
  <symbol id="gc-icon-chart" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </symbol>

  <!-- Volume -->
  <symbol id="gc-icon-volume" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </symbol>

  <!-- Maximize / Fullscreen -->
  <symbol id="gc-icon-maximize" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8"
          stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </symbol>

</svg>`;

  function inject() {
    if (document.getElementById('gc-sprite')) return;
    var host = document.createElement('div');
    host.id = 'gc-sprite';
    host.style.display = 'none';
    host.innerHTML = SPRITE;
    document.body.insertBefore(host, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
