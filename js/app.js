(function () {
  "use strict";
  var SITES = ["elevat.ing", "hmrfamily.life", "personaldash.life", "claudebomb.com", "endgame.life", "ilovedogs.dog", "funsies.fun", "reactionapp.life", "workdash.life"];  // same as the hmrfamily.life footer (audit 2026-11-27)
  var EFFECTS = [["float","Float"],["tilt","Tilt"],["drop","Drop"],["magnet","Magnet"],["balls","Balls"],["bubbles","Bubbles"],["tensegrity","Tensegrity toy"],["lightning","Lightning"],["missiles","Missiles"],["rocket","Rocket"],["burn","Burn"],["dragons","Dragons"],["drones","Drones"],["meteors","Meteors"],["ufo","UFO"],["sea","Sea"],["bees","Bees"],["melt","Melt"],["spartans","Marchers"],["ants","Ants"],["blackhole","Black hole"],["earthquake","Earthquake"],["tornado","Tornado"],["snow","Snow"],["confetti","Confetti"],["fireworks","Fireworks"],["paint","Paint"],["flip","Flip"],["words","Words"],["laser","Laser"],["rubber","Rubber"],["wreck","Wreck"],["slime","Slime"],["disco","Disco"]];
  function el(t, a, kids) {
    var e = document.createElement(t), k;
    for (k in (a || {})) { if (k === "text") e.textContent = a[k]; else e.setAttribute(k, a[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function store(get, k, v) { try { return get ? localStorage.getItem(k) : localStorage.setItem(k, v); } catch (e) { return null; } }

  /* footer */
  var foot = document.getElementById("footlinks");
  SITES.forEach(function (h) {
    foot.appendChild(el("li", {}, [el("a", { href: "https://" + h, text: h })]));
  });

  /* play overlay: the dock's own full screen overlay (has open in new tab) */
  Array.prototype.forEach.call(document.querySelectorAll("[data-open]"), function (b) {
    b.addEventListener("click", function () {
      if (window.HMRDock && window.HMRDock.play) window.HMRDock.play(b.getAttribute("data-open"));
      else window.open(b.nextElementSibling.href, "_blank", "noopener");
    });
  });


  /* ---- this page's own fire and dragons ----
     Burn: real fire. Letters catch fire one by one, glow, rise as ash, and the page puts itself back.
     Dragons: three small, cute dragons fly across breathing fire; letters they breathe on catch fire. */
  var reduceFx = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FX_SEL = "header h1, header .lead, header .eyebrow, main h2, main .sub, .pcard h3, .pcard p, .soon li";
  var fxOn = false, fxSaved = [], fxChars = [];
  function fxWrap() {
    if (fxOn) return; fxOn = true; fxSaved = []; fxChars = [];
    Array.prototype.forEach.call(document.querySelectorAll(FX_SEL), function (e) {
      fxSaved.push([e, e.innerHTML]);
      var walk = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, false), nodes = [], n;
      while ((n = walk.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
      nodes.forEach(function (tn) {
        var frag = document.createDocumentFragment();
        tn.nodeValue.split("").forEach(function (ch) { var sp = document.createElement("span"); sp.className = "fx-ch"; sp.textContent = ch; frag.appendChild(sp); if (ch.trim()) fxChars.push(sp); });
        tn.parentNode.replaceChild(frag, tn);
      });
      e.setAttribute("aria-label", e.textContent);
    });
  }
  function fxRestore() {
    fxSaved.forEach(function (p) { p[0].innerHTML = p[1]; p[0].removeAttribute("aria-label"); });
    fxSaved = []; fxChars = []; fxOn = false;
  }
  function ignite(sp, delay) { setTimeout(function () { if (sp.isConnected && !sp.classList.contains("lit")) sp.classList.add("lit"); }, delay || 0); }
  function flame(x, y) { var f = document.createElement("div"); f.className = "fx-flame"; f.style.left = (x - 13) + "px"; f.style.top = (y - 17) + "px"; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 950); }
  function inView(r) { return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; }
  var fxTimer = 0;
  function fxBurn() {
    if (fxOn) return; fxWrap();
    var vis = fxChars.filter(function (sp) { return inView(sp.getBoundingClientRect()); });
    if (!vis.length) vis = fxChars.slice(0, 200);
    if (!vis.length) { fxRestore(); return; }
    var start = vis[Math.floor(Math.random() * vis.length)].getBoundingClientRect();
    vis.forEach(function (sp) {
      var r = sp.getBoundingClientRect(), d = Math.hypot(r.left - start.left, r.top - start.top);
      ignite(sp, reduceFx ? 0 : d * 4 + Math.random() * 300);
      if (!reduceFx && Math.random() < 0.06) setTimeout(function () { flame(r.left + r.width / 2, r.top + r.height / 2); }, d * 4);
    });
    clearTimeout(fxTimer); fxTimer = setTimeout(fxRestore, reduceFx ? 2500 : 7500);
  }
  var DRAGON = '<svg viewBox="0 0 76 60" width="76" height="60" aria-hidden="true">' +
    '<g class="w"><path d="M34 26 C30 6 46 2 52 10 C46 12 44 18 46 24 Z" fill="#9be15d" stroke="#2b8a3e" stroke-width="2"/></g>' +
    '<path d="M8 36 C2 34 0 40 6 42 C10 44 14 40 18 40" fill="none" stroke="#2b8a3e" stroke-width="4" stroke-linecap="round"/>' +
    '<ellipse cx="32" cy="38" rx="18" ry="13" fill="#51cf66" stroke="#2b8a3e" stroke-width="2"/>' +
    '<ellipse cx="32" cy="42" rx="11" ry="7" fill="#d8f5a2"/>' +
    '<circle cx="54" cy="28" r="13" fill="#51cf66" stroke="#2b8a3e" stroke-width="2"/>' +
    '<path d="M50 16 l2 -7 l3 7 M57 16 l3 -6 l1 7" fill="#ffd43b" stroke="#e67700" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<circle cx="57" cy="26" r="4.2" fill="#fff"/><circle cx="58.2" cy="26.4" r="2.4" fill="#212529"/><circle cx="59" cy="25.4" r=".9" fill="#fff"/>' +
    '<circle cx="64" cy="33" r="1.2" fill="#2b8a3e"/><path d="M58 35 q4 3 8 0" fill="none" stroke="#2b8a3e" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="50" cy="33" r="2.6" fill="#ffa8a8" opacity=".7"/>' +
    '<path d="M24 50 v5 M38 50 v5" stroke="#2b8a3e" stroke-width="3" stroke-linecap="round"/></svg>';
  var dragonsOn = false;
  function fxDragons() {
    if (dragonsOn) return; dragonsOn = true; fxWrap();
    var W = innerWidth, H = innerHeight, list = [], dur = reduceFx ? 2500 : 8000, t0 = performance.now(), lastPuff = 0;
    for (var i = 0; i < 3; i++) {
      var d = document.createElement("div"); d.className = "fx-dragon"; d.innerHTML = DRAGON; document.body.appendChild(d);
      list.push({ el: d, y: H * (0.2 + 0.25 * i), delay: i * 700, amp: 18 + i * 8, ph: i * 2 });
    }
    function frame(now) {
      var t = now - t0, puff = now - lastPuff > 260;
      if (puff) lastPuff = now;
      list.forEach(function (g) {
        var k = Math.max(0, (t - g.delay) / (dur - 1400)), x = -90 + k * (W + 180), y = g.y + Math.sin(k * 12 + g.ph) * g.amp;
        g.el.style.transform = "translate(" + x + "px," + y + "px)";
        if (puff && k > 0 && k < 1 && !reduceFx) {
          var fx = x + 72, fy = y + 34; flame(fx, fy);
          fxChars.forEach(function (sp) { var r = sp.getBoundingClientRect(); if (Math.abs(r.left - fx - 20) < 60 && Math.abs(r.top - fy - 10) < 50) ignite(sp, Math.random() * 200); });
        }
      });
      if (t < dur) requestAnimationFrame(frame);
      else { list.forEach(function (g) { g.el.remove(); }); dragonsOn = false; clearTimeout(fxTimer); fxTimer = setTimeout(fxRestore, 2800); }
    }
    requestAnimationFrame(frame);
  }
  var LOCAL = { burn: fxBurn, dragons: fxDragons };

  /* wreck buttons: each calls a dock effect by name; if the dock lacks it, open the Funsies menu */
  var wreck = document.getElementById("wreck");
  EFFECTS.forEach(function (f) {
    var b = el("button", { type: "button", "class": "wbtn", "data-fx": f[0], text: f[1] });
    b.addEventListener("click", function () {
      if (LOCAL[f[0]]) { LOCAL[f[0]](); return; }   /* this page's own real fire and small cute dragons */
      var d = window.HMRDock;
      if (!d) return;
      if (d.effects && d.effects.indexOf(f[0]) >= 0) d.funsies(f[0]); else d.openFunsies();
    });
    wreck.appendChild(b);
  });
  wreck.appendChild(function () {
    var b = el("button", { type: "button", "class": "wbtn", text: "More fun menu" });
    b.addEventListener("click", function () { if (window.HMRDock) window.HMRDock.openFunsies(); });
    return b;
  }());

  /* design picker: 3 looks, four-level rating */
  var DESIGNS = ["Sunrise", "Meadow", "Grape"];
  var LEVELS = [["strong like", "Strong like"], ["like", "Like"], ["dislike", "Dislike"], ["strong dislike", "Strong dislike"]];
  var KEY = "hmrfunsies.ratings.v1", ratings = {};
  try { ratings = JSON.parse(store(true, KEY) || "{}") || {}; } catch (e) { ratings = {}; }
  var design = parseInt(new URLSearchParams(location.search).get("design"), 10);
  if (!(design >= 1 && design <= 3)) design = parseInt(store(true, "hmrfunsies.design"), 10);
  if (!(design >= 1 && design <= 3)) design = 1;
  var pk = document.getElementById("picker");
  var openBtn = el("button", { type: "button", "class": "pk-open", "aria-expanded": "false", "aria-controls": "pk-panel", text: "Design" });
  var panel = el("div", { "class": "pk-panel", id: "pk-panel", role: "region", "aria-label": "Design picker", hidden: "" });
  pk.appendChild(panel); pk.appendChild(openBtn);
  function save() { store(false, KEY, JSON.stringify(ratings)); }
  function msg(t) { var m = document.getElementById("pk-msg"); if (m) m.textContent = t; }
  function closePanel() { panel.setAttribute("hidden", ""); openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); }
  function ratingText() {
    var out = ["funsies.fun design ratings"];
    DESIGNS.forEach(function (n, i) { var r = ratings[i + 1] || {}; out.push((i + 1) + " " + n + ": " + (r.level || "not rated") + (r.note ? " | note: " + r.note : "")); });
    return out.join("\n");
  }
  function submitRatings(email) {
    if (!window.HMRDock || !window.HMRDock.send) { msg("Still loading. Try again in a moment."); return; }
    msg("Sending...");
    window.HMRDock.send({ kind: "design", subject: "funsies.fun design ratings", message: ratingText(), email: email || "", details: { ratings: ratings } }).then(function (r) {
      msg(r && r.ok ? "Sent. Thank you so much for your contribution." : "Your email app should have opened with your ratings. They are still saved here.");
    }, function () { msg("Not sent. Your ratings are still saved here. Try again."); });
  }
  function render() {
    document.documentElement.setAttribute("data-design", String(design));
    store(false, "hmrfunsies.design", String(design));
    panel.textContent = "";
    var top = el("div", { "class": "pk-top" }, [el("b", { text: "Pick a design" }), el("button", { type: "button", "class": "btn", text: "Close" })]);
    top.lastChild.addEventListener("click", closePanel);
    panel.appendChild(top);
    var row = el("div", { "class": "pk-designs", role: "group", "aria-label": "Designs" });
    DESIGNS.forEach(function (n, i) {
      var b = el("button", { type: "button", "aria-pressed": String(design === i + 1), text: (i + 1) + " " + n });
      b.addEventListener("click", function () {
        design = i + 1;
        try { history.replaceState(null, "", "?design=" + design); } catch (e) {}
        render(); panel.querySelector(".pk-designs button[aria-pressed=true]").focus();
      });
      row.appendChild(b);
    });
    panel.appendChild(row);
    var r = ratings[design] || {};
    var fs = el("fieldset"); fs.appendChild(el("legend", { text: "Your rating of design " + design }));
    LEVELS.forEach(function (l) {
      var inp = el("input", { type: "radio", name: "rate", value: l[0] });
      if (r.level === l[0]) inp.checked = true;
      inp.addEventListener("change", function () { ratings[design] = ratings[design] || {}; ratings[design].level = l[0]; save(); msg("Saved."); });
      fs.appendChild(el("label", {}, [inp, document.createTextNode(" " + l[1])]));
    });
    panel.appendChild(fs);
    var ta = el("textarea", { id: "pk-note", maxlength: "500" }); ta.value = r.note || "";
    ta.addEventListener("input", function () { ratings[design] = ratings[design] || {}; ratings[design].note = ta.value; save(); });
    panel.appendChild(el("label", { "for": "pk-note", text: "Note (optional)" })); panel.appendChild(ta);
    /* Submit, like every design picker: with my email (shows the email field) or anonymously */
    var emRow = el("div", { "class": "pk-em", hidden: "" }), em = el("input", { type: "email", id: "pk-em", autocomplete: "email" });
    emRow.appendChild(el("label", { "for": "pk-em", text: "Your email, so we can reply" })); emRow.appendChild(em);
    var bMail = el("button", { type: "button", "class": "btn primary", text: "Submit with my email" });
    var bAnon = el("button", { type: "button", "class": "btn", text: "Submit anonymously" });
    bMail.addEventListener("click", function () {
      if (emRow.hasAttribute("hidden")) { emRow.removeAttribute("hidden"); em.focus(); msg("Add your email, then press Submit with my email again."); return; }
      var v = em.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg("That email does not look complete. Check it, or submit anonymously."); em.focus(); return; }
      submitRatings(v);
    });
    bAnon.addEventListener("click", function () { submitRatings(""); });
    panel.appendChild(emRow);
    panel.appendChild(el("p", { "class": "pk-sub" }, [bMail, document.createTextNode(" "), bAnon]));
    panel.appendChild(el("p", { "class": "pk-msg", id: "pk-msg", role: "status" }));
  }
  openBtn.addEventListener("click", function () {
    var open = panel.hasAttribute("hidden");
    if (open) { panel.removeAttribute("hidden"); openBtn.setAttribute("aria-expanded", "true"); } else closePanel();
  });
  render();
})();
