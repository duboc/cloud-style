/* =============================================================================
   cloud-style — BEHAVIOUR

   Three small things, none of them a framework:

     gcNavigate(update)   run a DOM change inside a View Transition
     gcDragRail(el)       make a card rail draggable with the mouse
     gcOnKeys(handlers)   arrow-key / Escape navigation for presenting

   Everything degrades: if View Transitions are unsupported the update just
   happens instantly, and the rail still scrolls natively.
   ========================================================================== */

/**
 * Wrap a DOM mutation so the named regions cross-fade instead of snapping.
 *
 * Elements you want animated must carry a `view-transition-name` that matches
 * one of the names in cloud-style.css §14 (gc-lede, gc-cta, gc-menu, gc-detail).
 * Anything without a name is part of the `root` snapshot, which is explicitly
 * set to `animation: none` — that is what keeps the wordmark and the ripple
 * perfectly still while the content changes.
 *
 * @param {() => void} update  Synchronous DOM mutation.
 * @returns {Promise<void>}    Resolves once the transition has finished.
 */
function gcNavigate(update) {
  if (!document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return Promise.resolve();
  }
  return document.startViewTransition(update).finished.catch(function () {});
}

/**
 * Click-and-drag horizontal scrolling for a `.gc-rail`.
 *
 * On desktop the rail has `overflow: visible` and no scrollbar, so it is moved
 * by translating the track. On mobile the CSS switches to native snap
 * scrolling and this is skipped entirely.
 *
 * @param {HTMLElement} rail  The `.gc-rail` element.
 */
function gcDragRail(rail) {
  var track = rail.querySelector('.gc-rail-track');
  if (!track) return;

  var DRAG_THRESHOLD = 6; // px of travel before this counts as a drag

  var offset = 0;      // current translation, px
  var startX = 0;      // pointer x at drag start
  var startOffset = 0; // offset at drag start
  var pointerDown = false;
  var captured = false; // pointer capture is deferred — see pointermove
  var moved = 0;       // total px travelled — used to suppress stray clicks

  function maxScroll() {
    // How far the track can move before its right edge reaches the rail's.
    return Math.max(0, track.scrollWidth - rail.clientWidth);
  }

  function apply() {
    track.style.transform = 'translateX(' + offset + 'px)';
  }

  function clamp(v) {
    return Math.min(0, Math.max(-maxScroll(), v));
  }

  rail.addEventListener('pointerdown', function (e) {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    pointerDown = true;
    captured = false;
    moved = 0;
    startX = e.clientX;
    startOffset = offset;
    // Deliberately NOT calling setPointerCapture here. Capturing on pointerdown
    // retargets the subsequent click event to the rail, so clicks would never
    // reach the cards. Capture is deferred until movement proves it's a drag.
  });

  rail.addEventListener('pointermove', function (e) {
    if (!pointerDown) return;
    var dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));

    if (!captured) {
      if (moved <= DRAG_THRESHOLD) return;   // still just a click
      captured = true;
      try { rail.setPointerCapture(e.pointerId); } catch (_) {}
    }

    offset = clamp(startOffset + dx);
    apply();
  });

  function end(e) {
    if (!pointerDown) return;
    pointerDown = false;
    if (captured) {
      try { rail.releasePointerCapture(e.pointerId); } catch (_) {}
      captured = false;
    }
  }
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);

  // Swallow the click that ends a real drag, so cards don't open by accident.
  rail.addEventListener('click', function (e) {
    if (moved > DRAG_THRESHOLD) { e.stopPropagation(); e.preventDefault(); }
    moved = 0;
  }, true);

  // Trackpad / shift-wheel horizontal scrolling.
  rail.addEventListener('wheel', function (e) {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    var dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!dx) return;
    e.preventDefault();
    offset = clamp(offset - dx);
    apply();
  }, { passive: false });
}

/**
 * Keyboard navigation, for driving the deck from a clicker on stage.
 *
 * @param {{next?:Function, prev?:Function, home?:Function, back?:Function}} h
 */
function gcOnKeys(h) {
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': h.next && h.next(); break;
      case 'ArrowLeft':  case 'PageUp':           h.prev && h.prev(); break;
      case 'Escape':                              h.back && h.back(); break;
      case 'Home':                                h.home && h.home(); break;
      default: return;
    }
    e.preventDefault();
  });
}

/** Auto-wire every rail on the page once the DOM is ready. */
function gcInitRails(root) {
  (root || document).querySelectorAll('.gc-rail').forEach(gcDragRail);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { gcInitRails(); });
} else {
  gcInitRails();
}
