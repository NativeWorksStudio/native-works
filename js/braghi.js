/* ============================================================================
   braghi.js — "Ask Braghi" chat client for the NativeWorks /ask page.
   Talks to the KAI relay (single-shot, no streaming). No deps, no build step.
   Contract (verified): POST /api/message { userId, text, mustReply:true } -> { text }
   Rendering is XSS-safe: all HTML entity-escaped first, then a fixed tag
   whitelist is re-introduced by regex — model output can never inject markup.
   ========================================================================== */
(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  var API_URL            = 'https://chat-api.178.104.31.77.sslip.io/api/message';
  var STORAGE_KEY        = 'kai.userId';
  var REQUEST_TIMEOUT_MS = 30000;
  var MIN_TYPING_MS      = 350;
  var SLOW_STATUS_MS     = 2500;
  var MAXLEN             = 4000;
  var COUNTER_THRESHOLD  = 3600;

  var COPY = {
    greeting: "I'm Braghi. Tell me where you are today — building from scratch, or trying to get off rented land — and I'll help you find your bearings.",
    slow:     'Braghi is thinking…',
    network:  'The line went quiet — looks like the connection dropped. Check your network and ask again.',
    server:   'Something faltered on my end, not yours. Give me a moment and try once more.',
    empty:    "Braghi didn't have an answer for that — try rephrasing?",
    retry:    'Try again'
  };

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches;
  var supportsFieldSizing = !!(window.CSS && CSS.supports && CSS.supports('field-sizing', 'content'));

  // ── userId — identical scheme to kai-widget.js ──────────────────────────────
  function getUserId() {
    var id = null;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw && /^\d+$/.test(raw)) id = parseInt(raw, 10);
    } catch (e) {}
    if (!id) {
      id = Math.floor(Math.random() * 9e9) + 1e9;
      try { localStorage.setItem(STORAGE_KEY, String(id)); } catch (e) {}
    }
    return id;
  }

  // ── XSS-safe rendering: escape-first, then whitelist (strong/em/code/a/ul/li)
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderSafe(raw) {
    var s = escapeHtml(String(raw));

    // inline code `code`
    s = s.replace(/`([^`]+?)`/g, function (_, c) { return '<code>' + c + '</code>'; });

    // bold **text**, then italic *text* / _text_
    s = s.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[\s(])\*([^*\n]+?)\*(?=[\s).,!?]|$)/g, '$1<em>$2</em>');
    s = s.replace(/(^|[\s(])_([^_\n]+?)_(?=[\s).,!?]|$)/g, '$1<em>$2</em>');

    // links [label](url) — http/https/mailto only; javascript:/data: cannot match
    s = s.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
      function (_, label, url) {
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
      });

    // bullet lists: consecutive lines starting "- " or "* " → <ul><li>
    s = s.replace(/(?:^|\n)((?:[-*] .+(?:\n|$))+)/g, function (m, block) {
      var items = block.trim().split('\n')
        .map(function (l) { return '<li>' + l.replace(/^[-*]\s+/, '') + '</li>'; })
        .join('');
      return '\n<ul>' + items + '</ul>';
    });

    return s;
  }

  // ── Small helpers ───────────────────────────────────────────────────────────
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function removeNode(n) { if (n && n.parentNode) n.parentNode.removeChild(n); }

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function init() {
    var form    = document.getElementById('braghi-form');
    var input   = document.getElementById('braghi-input');
    var send    = document.getElementById('braghi-send');
    var log     = document.getElementById('braghi-log');
    var chips   = document.getElementById('braghi-chips');
    var counter = document.getElementById('braghi-counter');
    if (!form || !input || !send || !log) return;

    var userId      = getUserId();
    var inFlight    = false;
    var activated   = false;
    var lastUserText = '';

    // ---- state helpers ----
    function updateSendState() {
      send.disabled = inFlight || input.value.trim().length === 0;
    }
    function updateCounter() {
      if (!counter) return;
      if (input.value.length >= COUNTER_THRESHOLD) {
        counter.textContent = input.value.length + ' / ' + MAXLEN;
        counter.removeAttribute('aria-hidden');
      } else if (counter.textContent) {
        counter.textContent = '';
        counter.setAttribute('aria-hidden', 'true');
      }
    }
    function autoGrow() {
      if (supportsFieldSizing) return;
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 200) + 'px';
    }
    function setInFlight(b) {
      inFlight = b;
      log.setAttribute('aria-busy', b ? 'true' : 'false');
      updateSendState();
    }
    function clearInput() {
      input.value = '';
      if (!supportsFieldSizing) input.style.height = 'auto';
      updateCounter();
      updateSendState();
    }

    // ---- scroll ----
    function isNearBottom() {
      return log.scrollHeight - log.scrollTop - log.clientHeight < 120;
    }
    function scrollToBottom() { log.scrollTop = log.scrollHeight; }
    function scrollToBottomIfNear() { if (isNearBottom()) scrollToBottom(); }

    // ---- DOM builders ----
    function buildMsg(role, vhLabel) {
      var row = document.createElement('div');
      row.className = 'braghi-msg braghi-msg--' + role;
      var vh = document.createElement('span');
      vh.className = 'braghi-visually-hidden';
      vh.textContent = vhLabel;
      var bubble = document.createElement('div');
      bubble.className = 'braghi-bubble';
      row.appendChild(vh);
      row.appendChild(bubble);
      return { row: row, bubble: bubble };
    }

    function appendUserMessage(text) {
      var m = buildMsg('user', 'You said: ');
      m.bubble.textContent = text;            // hard-escaped: user input as plain text
      log.appendChild(m.row);
      scrollToBottom();
    }

    function appendBotMessage(reply) {
      var m = buildMsg('bot', 'Braghi said: ');
      m.bubble.innerHTML = renderSafe(reply);  // safe: escaped-then-whitelisted
      log.appendChild(m.row);
      scrollToBottomIfNear();
      return m.row;
    }

    function appendTyping() {
      var row = document.createElement('div');
      row.className = 'braghi-msg braghi-msg--bot braghi-typing';
      row.setAttribute('aria-hidden', 'true');
      var bubble = document.createElement('div');
      bubble.className = 'braghi-bubble';
      if (prefersReducedMotion) {
        bubble.textContent = COPY.slow;
      } else {
        bubble.innerHTML = '<span class="braghi-dot"></span><span class="braghi-dot"></span><span class="braghi-dot"></span>';
      }
      row.appendChild(bubble);
      log.appendChild(row);
      scrollToBottomIfNear();
      return row;
    }

    function swapTypingToStatus(typingRow) {
      if (!typingRow || !typingRow.parentNode) return;
      var bubble = typingRow.querySelector('.braghi-bubble');
      if (bubble) bubble.textContent = COPY.slow;
    }

    function appendErrorMessage(err) {
      var row = document.createElement('div');
      row.className = 'braghi-msg braghi-msg--bot braghi-msg--error';
      var vh = document.createElement('span');
      vh.className = 'braghi-visually-hidden';
      vh.textContent = 'Braghi said: ';
      var bubble = document.createElement('div');
      bubble.className = 'braghi-bubble';
      bubble.textContent = (err && err.kind === 'server') ? COPY.server : COPY.network;
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'braghi-retry';
      retry.textContent = COPY.retry;
      retry.addEventListener('click', function () {
        input.focus();            // a11y: claim focus before detaching the button, else it falls to <body>
        removeNode(row);
        if (lastUserText) sendMessage(lastUserText, true);
      });
      row.appendChild(vh);
      row.appendChild(bubble);
      row.appendChild(retry);
      log.appendChild(row);
      scrollToBottomIfNear();
    }

    function enterActiveState() {
      if (activated) return;
      activated = true;
      document.body.classList.add('braghi-active');
      if (!log.children.length) appendBotMessage(COPY.greeting);  // greeting as message #0
    }

    // ---- network ----
    function fetchReply(text) {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS);
      return fetch(API_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, text: text, mustReply: true }),
        signal: ctrl.signal
      }).then(function (res) {
        if (!res.ok) { var e = new Error('http'); e.kind = 'server'; e.status = res.status; throw e; }
        return res.text();
      }).then(function (raw) {
        var data; try { data = JSON.parse(raw); } catch (_) { data = raw; }
        if (data && typeof data === 'object') {
          return data.reply || data.message || data.text || data.answer || data.response || '';
        }
        return (typeof data === 'string') ? data : '';   // 2xx with non-JSON body → treat body as the reply
      }).catch(function (err) {
        if (err && err.kind === 'server') throw err;
        var e = new Error('network'); e.kind = 'network'; throw e;
      }).then(function (v) { clearTimeout(t); return v; }, function (err) { clearTimeout(t); throw err; });
    }

    // ---- send pipeline ----
    function sendMessage(text, isRetry) {
      text = (text || '').trim();
      if (!text || inFlight) return;
      lastUserText = text;
      enterActiveState();
      if (!isRetry) appendUserMessage(text);   // on retry the original user bubble is still in the log
      if (!isRetry) clearInput();
      var typing = appendTyping();
      setInFlight(true);

      var slowTimer = setTimeout(function () { swapTypingToStatus(typing); }, SLOW_STATUS_MS);
      var minDelay = sleep(MIN_TYPING_MS);

      fetchReply(text).then(function (reply) {
        return minDelay.then(function () {
          clearTimeout(slowTimer); removeNode(typing);
          var clean = (reply == null ? '' : String(reply)).trim();
          appendBotMessage(clean || COPY.empty);
        });
      }).catch(function (err) {
        return minDelay.then(function () {
          clearTimeout(slowTimer); removeNode(typing);
          appendErrorMessage(err);
        });
      }).then(function () {
        setInFlight(false);
        input.focus();
        scrollToBottomIfNear();
      });
    }

    function submitFromInput() { sendMessage(input.value); }

    // ---- listeners ----
    input.addEventListener('input', function () {
      autoGrow(); updateSendState(); updateCounter();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        submitFromInput();
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitFromInput();
    });
    if (chips) {
      chips.addEventListener('click', function (e) {
        var chip = e.target.closest ? e.target.closest('.braghi-chip') : null;
        if (chip) sendMessage(chip.textContent.trim());
      });
    }

    // ---- mobile keyboard (visualViewport) — coarse pointers, docked state only
    if (isCoarse && window.visualViewport) {
      var vv = window.visualViewport;
      var onVV = function () {
        if (!document.body.classList.contains('braghi-active')) { form.style.transform = ''; return; }
        var offset = window.innerHeight - vv.height - vv.offsetTop;
        form.style.transform = offset > 0 ? 'translateY(' + (-offset) + 'px)' : '';
      };
      vv.addEventListener('resize', onVV);
      vv.addEventListener('scroll', onVV);
    }

    // ---- initial state ----
    updateSendState();
    if (!isCoarse) { try { input.focus(); } catch (e) {} }   // don't pop mobile keyboard on landing
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
