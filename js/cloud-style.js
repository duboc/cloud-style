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
  var transition = document.startViewTransition(update);
  transition.ready.catch(function () {});
  return transition.finished.catch(function () {});
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

/**
 * Initialize interactive behaviors for Google Cloud demo components:
 * Camera scanner, Video player, Gemini Chat, BigQuery SQL metrics,
 * Zero Trust security validator, and UI controls suite.
 *
 * @param {HTMLElement} root Container element containing demo components.
 */
function gcInitDemos(root) {
  var scope = root || document;

  // 1. Camera / Vision Scanner Demo
  var shutterBtn = scope.querySelector('#camera-shutter-btn');
  var viewfinder = scope.querySelector('#camera-viewfinder');
  var docTypeEl = scope.querySelector('#camera-doc-type');
  var latencyEl = scope.querySelector('#camera-latency');

  if (shutterBtn && viewfinder) {
    var targets = [
      { doc: 'Enterprise Identity Document', lat: '24ms (TPU v5p)' },
      { doc: 'Financial Invoice & Line Items', lat: '31ms (Vertex AI)' },
      { doc: 'Cloud Architecture Diagram', lat: '19ms (Gemini Vision)' },
      { doc: 'Container Security Asset ID', lat: '28ms (Edge TPU)' },
    ];
    var targetIdx = 0;
    shutterBtn.onclick = function () {
      viewfinder.style.transition = 'filter 0.1s';
      viewfinder.style.filter = 'brightness(2.2)';
      setTimeout(function () {
        viewfinder.style.filter = 'brightness(1)';
        targetIdx = (targetIdx + 1) % targets.length;
        if (docTypeEl) docTypeEl.textContent = targets[targetIdx].doc;
        if (latencyEl) latencyEl.textContent = targets[targetIdx].lat;
      }, 150);
    };
  }

  // 2. Video Player Demo
  var videoToggleBtn = scope.querySelector('#video-toggle-btn');
  var videoPlayIcon = scope.querySelector('#video-play-icon');
  var videoProgress = scope.querySelector('#video-progress');
  var videoTimeEl = scope.querySelector('#video-time-elapsed');
  var isPlaying = false;
  var progressTimer = null;

  if (videoToggleBtn && videoProgress) {
    videoToggleBtn.onclick = function () {
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (videoPlayIcon) videoPlayIcon.innerHTML = '<use href="#gc-icon-pause"/>';
        var pct = parseInt(videoProgress.style.width, 10) || 42;
        progressTimer = setInterval(function () {
          pct = (pct + 1) % 100;
          videoProgress.style.width = pct + '%';
          var secs = Math.floor((pct / 100) * 750);
          var m = String(Math.floor(secs / 60)).padStart(2, '0');
          var s = String(secs % 60).padStart(2, '0');
          if (videoTimeEl) videoTimeEl.textContent = m + ':' + s;
        }, 300);
      } else {
        if (videoPlayIcon) videoPlayIcon.innerHTML = '<use href="#gc-icon-play"/>';
        if (progressTimer) clearInterval(progressTimer);
      }
    };

    scope.querySelectorAll('.gc-video-chapter-card').forEach(function (card) {
      card.onclick = function () {
        scope.querySelectorAll('.gc-video-chapter-card').forEach(function (c) {
          c.classList.remove('is-active');
        });
        card.classList.add('is-active');
        var pct = card.getAttribute('data-pct') || 20;
        videoProgress.style.width = pct + '%';
        var time = card.getAttribute('data-time') || '00:00';
        if (videoTimeEl) videoTimeEl.textContent = time;
      };
    });
  }

  // 3. Gemini Chat Demo
  var chatInput = scope.querySelector('#chat-input');
  var chatSendBtn = scope.querySelector('#chat-send-btn');
  var chatStream = scope.querySelector('#chat-stream');
  var chatBody = scope.querySelector('#chat-body');

  function sendChatMessage(text) {
    if (!text || !chatStream) return;
    var userBubble = document.createElement('div');
    userBubble.className = 'gc-chat-msg is-user';
    userBubble.textContent = text;
    chatStream.appendChild(userBubble);
    if (chatInput) chatInput.value = '';
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

    var typingBubble = document.createElement('div');
    typingBubble.className = 'gc-chat-msg is-agent';
    typingBubble.innerHTML = '<span style="font-style:italic;opacity:0.7">Gemini is reasoning...</span>';
    chatStream.appendChild(typingBubble);
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(function () {
      typingBubble.innerHTML =
        'Optimized configuration generated for your workload.' +
        '<div class="gc-chat-tool-badge">' +
        '<svg><use href="#gc-icon-sparkle"/></svg>' +
        'VertexAI Tool: GeminiAgent.execute()' +
        '</div>' +
        'Executed with zero downtime across Google Cloud regions.';
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);
  }

  if (chatSendBtn && chatInput) {
    chatSendBtn.onclick = function () {
      sendChatMessage(chatInput.value.trim());
    };
    chatInput.onkeydown = function (e) {
      if (e.key === 'Enter') {
        sendChatMessage(chatInput.value.trim());
      }
    };
  }

  scope.querySelectorAll('.gc-prompt-pill').forEach(function (pill) {
    pill.onclick = function () {
      var promptText = pill.getAttribute('data-prompt') || pill.textContent;
      sendChatMessage(promptText);
    };
  });

  // 4. Metrics / BigQuery SQL Query Runner Demo
  var metricsRunBtn = scope.querySelector('#metrics-run-btn');
  var kpiThroughput = scope.querySelector('#kpi-throughput');
  var kpiLatency = scope.querySelector('#kpi-latency');
  var runText = scope.querySelector('#metrics-run-text');

  if (metricsRunBtn) {
    metricsRunBtn.onclick = function () {
      if (runText) runText.textContent = 'Executing on BigQuery...';
      metricsRunBtn.style.opacity = '0.7';
      setTimeout(function () {
        if (runText) runText.textContent = 'Query Complete (0.38s)';
        metricsRunBtn.style.opacity = '1';
        var throughputs = ['54.8k/s', '61.2k/s', '48.9k/s', '72.4k/s'];
        var latencies = ['9ms', '11ms', '14ms', '8ms'];
        var randIdx = Math.floor(Math.random() * throughputs.length);
        if (kpiThroughput) kpiThroughput.textContent = throughputs[randIdx];
        if (kpiLatency) kpiLatency.textContent = latencies[randIdx];
      }, 400);
    };
  }

  // 5. Security & Zero Trust Demo
  var securityVerifyBtn = scope.querySelector('#security-verify-btn');
  var securityShield = scope.querySelector('#security-shield');
  var securityStatus = scope.querySelector('#security-status-text');

  if (securityVerifyBtn && securityShield) {
    securityVerifyBtn.onclick = function () {
      securityShield.style.background = 'var(--gc-google-yellow)';
      if (securityStatus) securityStatus.textContent = 'Validating Posture...';
      setTimeout(function () {
        securityShield.style.background = 'var(--gc-google-green)';
        if (securityStatus) securityStatus.textContent = 'Zero Trust: 100% Compliant';
      }, 450);
    };
  }

  // 6. Button & UI Controls Demo
  scope.querySelectorAll('.gc-switch').forEach(function (sw) {
    sw.onclick = function () {
      sw.classList.toggle('is-on');
    };
  });

  scope.querySelectorAll('.gc-segmented').forEach(function (seg) {
    seg.querySelectorAll('.gc-segmented-btn').forEach(function (btn) {
      btn.onclick = function () {
        seg.querySelectorAll('.gc-segmented-btn').forEach(function (b) {
          b.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');
      };
    });
  });

  var slider = scope.querySelector('#demo-slider');
  var sliderVal = scope.querySelector('#demo-slider-val');
  if (slider && sliderVal) {
    slider.oninput = function () {
      sliderVal.textContent = slider.value + ' vCPU';
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    gcInitRails();
    gcInitDemos();
  });
} else {
  gcInitRails();
  gcInitDemos();
}

