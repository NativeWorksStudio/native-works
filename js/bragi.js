/* ============================================================================
   bragi.js — "Ask Bragi" chat client for the NativeWorks /ask page.
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
    greeting: "I'm Bragi. Tell me where you are today — building from scratch, or trying to get off rented land — and I'll help you find your bearings.",
    slow:     'Bragi is thinking…',
    network:  'The line went quiet — looks like the connection dropped. Check your network and ask again.',
    server:   'Something faltered on my end, not yours. Give me a moment and try once more.',
    empty:    "Bragi didn't have an answer for that — try rephrasing?",
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

    // (Links are NOT rendered inline — extractLinks() pulls every URL out and
    //  appendBotMessage renders each as a button below the message.)

    // bullet lists: consecutive lines starting "- " or "* " → <ul><li>
    s = s.replace(/(?:^|\n)((?:[-*] .+(?:\n|$))+)/g, function (m, block) {
      var items = block.trim().split('\n')
        .map(function (l) { return '<li>' + l.replace(/^[-*]\s+/, '') + '</li>'; })
        .join('');
      return '\n<ul>' + items + '</ul>';
    });

    return s;
  }

  // ── Links → buttons ─────────────────────────────────────────────────────────
  // Pull every URL out of a reply so each can be shown as a button (not an inline
  // link). Markdown [label](url) keeps `label` inline; bare URLs are removed from
  // the text (the button carries them). Scheme is allowlisted (http/https/mailto).
  function extractLinks(raw) {
    var links = [], seen = {}, text = String(raw);
    function add(url, label) {
      url = url.replace(/[.,!?;:]+$/, '');                 // drop trailing sentence punctuation
      if (!/^(https?:|mailto:)/i.test(url)) return;        // scheme allowlist (no javascript:/data:)
      if (seen[url]) return; seen[url] = 1;
      if (label) label = label.replace(/[*_`]/g, '').trim();  // strip stray markdown from the label
      links.push({ url: url, label: label || null });
    }
    text = text.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, function (_, label, url) {
      add(url, label); return label;                       // keep the label inline as plain text
    });
    text = text.replace(/(^|[\s(])((?:https?:\/\/|mailto:)[^\s)]+)/g, function (_, pre, url) {
      add(url, null); return pre;                          // drop the bare URL from the prose
    });
    // tidy the seam left by removed bare URLs: empty parens, doubled spaces, trailing space
    text = text.replace(/\(\s*\)/g, '').replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+\n/g, '\n').trim();
    return { text: text, links: links };
  }

  function prettyLabel(url) {
    if (/^mailto:/i.test(url)) return url.replace(/^mailto:/i, '');
    var noq = url.replace(/^https?:\/\//i, '').replace(/[#?].*$/, '').replace(/\/+$/, '');
    var host = noq.split('/')[0];
    var seg = noq.split('/').slice(1).pop();               // last path segment (after host)
    if (seg) seg = seg.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || seg.length > 40) return host;              // no slug / over-long → hostname
    if (/^[a-z0-9 ]+$/.test(seg)) {                        // title-case only fully-lowercase slugs
      seg = seg.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); });
    }
    return seg;
  }

  // Dynamically-created controls miss main.js's static hover binding — mirror it so the
  // site's custom cursor still gives hover feedback on chat buttons.
  function bindCursor(el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
  }

  // href set via DOM property + scheme already allowlisted in extractLinks ⇒ no injection.
  function makeLinkButton(lnk) {
    var a = document.createElement('a');
    a.className = 'bragi-cta-button';
    a.href = lnk.url;
    var label = lnk.label || prettyLabel(lnk.url);
    a.textContent = label;                                 // '→' is a CSS ::after (kept out of the a11y name)
    if (/^https?:/i.test(lnk.url)) {
      a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', label + ' (opens in a new tab)');
    }
    bindCursor(a);
    return a;
  }

  // ── Small helpers ───────────────────────────────────────────────────────────
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function removeNode(n) { if (n && n.parentNode) n.parentNode.removeChild(n); }

  // ── Boot ─────────────────────────────────────────────────────────────────────
  function init() {
    var form    = document.getElementById('bragi-form');
    var input   = document.getElementById('bragi-input');
    var send    = document.getElementById('bragi-send');
    var log     = document.getElementById('bragi-log');
    var chips   = document.getElementById('bragi-chips');
    var counter = document.getElementById('bragi-counter');
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
    // Reveal a newly-added message: jump to the START of a tall reply (so the user
    // reads from its top), or to the bottom for a short one.
    function showNewMessage(row) {
      if (row && row.getBoundingClientRect().height > log.clientHeight - 40) {
        log.scrollTop += row.getBoundingClientRect().top - log.getBoundingClientRect().top - 12;
      } else {
        scrollToBottom();
      }
    }

    // ---- DOM builders ----
    function buildMsg(role, vhLabel) {
      var row = document.createElement('div');
      row.className = 'bragi-msg bragi-msg--' + role;
      var vh = document.createElement('span');
      vh.className = 'bragi-visually-hidden';
      vh.textContent = vhLabel;
      var bubble = document.createElement('div');
      bubble.className = 'bragi-bubble';
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
      var m = buildMsg('bot', 'Bragi said: ');
      var parsed = extractLinks(reply);
      m.bubble.innerHTML = renderSafe(parsed.text);  // safe: escaped-then-whitelisted
      parsed.links.forEach(function (lnk) { m.row.appendChild(makeLinkButton(lnk)); });  // URLs → buttons
      log.appendChild(m.row);
      return m.row;
    }

    function appendTyping() {
      var row = document.createElement('div');
      row.className = 'bragi-msg bragi-msg--bot bragi-typing';
      row.setAttribute('aria-hidden', 'true');
      var bubble = document.createElement('div');
      bubble.className = 'bragi-bubble';
      if (prefersReducedMotion) {
        bubble.textContent = COPY.slow;
      } else {
        bubble.innerHTML = '<span class="bragi-dot"></span><span class="bragi-dot"></span><span class="bragi-dot"></span>';
      }
      row.appendChild(bubble);
      log.appendChild(row);
      return row;
    }

    function swapTypingToStatus(typingRow) {
      if (!typingRow || !typingRow.parentNode) return;
      var bubble = typingRow.querySelector('.bragi-bubble');
      if (bubble) bubble.textContent = COPY.slow;
    }

    function appendErrorMessage(err) {
      var row = document.createElement('div');
      row.className = 'bragi-msg bragi-msg--bot bragi-msg--error';
      var vh = document.createElement('span');
      vh.className = 'bragi-visually-hidden';
      vh.textContent = 'Bragi said: ';
      var bubble = document.createElement('div');
      bubble.className = 'bragi-bubble';
      bubble.textContent = (err && err.kind === 'server') ? COPY.server : COPY.network;
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'bragi-retry';
      retry.textContent = COPY.retry;
      bindCursor(retry);
      retry.addEventListener('click', function () {
        input.focus();            // a11y: claim focus before detaching the button, else it falls to <body>
        removeNode(row);
        if (lastUserText) sendMessage(lastUserText, true);
      });
      row.appendChild(vh);
      row.appendChild(bubble);
      row.appendChild(retry);
      log.appendChild(row);
      return row;
    }

    function enterActiveState() {
      if (activated) return;
      activated = true;
      document.body.classList.add('bragi-active');
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
      scrollToBottom();                  // user just sent/retried — show the typing indicator
      setInFlight(true);

      var slowTimer = setTimeout(function () { swapTypingToStatus(typing); }, SLOW_STATUS_MS);
      var minDelay = sleep(MIN_TYPING_MS);

      fetchReply(text).then(function (reply) {
        return minDelay.then(function () {
          clearTimeout(slowTimer);
          var stick = isNearBottom();    // was the user following? measure BEFORE the DOM grows
          removeNode(typing);
          var clean = (reply == null ? '' : String(reply)).trim();
          var row = appendBotMessage(clean || COPY.empty);
          if (stick) showNewMessage(row);
        });
      }).catch(function (err) {
        return minDelay.then(function () {
          clearTimeout(slowTimer);
          var stick = isNearBottom();
          removeNode(typing);
          var row = appendErrorMessage(err);
          if (stick) showNewMessage(row);
        });
      }).then(function () {
        setInFlight(false);
        input.focus();
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
        var chip = e.target.closest ? e.target.closest('.bragi-chip') : null;
        if (chip) sendMessage(chip.textContent.trim());
      });
    }

    // ---- mobile keyboard (visualViewport) — coarse pointers, docked state only
    if (isCoarse && window.visualViewport) {
      var vv = window.visualViewport;
      var onVV = function () {
        if (!document.body.classList.contains('bragi-active')) { form.style.transform = ''; return; }
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
