/* Cookie-Info (Motti_TV-Projekte): Link „Cookies“ in der Fußzeile öffnet ein Fenster mit allem, was diese Seite
 * speichert – notwendige Cookies/Speicher, optional Komfort-Speicher mit Schalter. Kein Tracking, keine Werbung,
 * deshalb kein Zustimmungs-Banner. Ohne Inline-Skripte/-Styles (CSP), Sprache aus <html lang> (en/de/pl).
 * Erzeugt aus _Tools/cookie-info/cookies.base.js – Projekt-Liste steht in CONFIG. */
(function () {
  "use strict";
  var CONFIG = {
  "privacy": "privacy-policy.html",
  "necessary_note": {
    "en": "Only your chosen language – these pages have no sign-in.",
    "de": "Nur deine gewählte Sprache – diese Seiten haben keine Anmeldung.",
    "pl": "Tylko wybrany język – te strony nie mają logowania."
  },
  "necessary": [
    {
      "name": "wg_lang",
      "kind": "storage",
      "what": {
        "en": "Your chosen language.",
        "de": "Deine gewählte Sprache.",
        "pl": "Wybrany język."
      },
      "keep": {
        "en": "Until you clear it in the browser",
        "de": "Bis du ihn im Browser löschst",
        "pl": "Do wyczyszczenia w przeglądarce"
      }
    }
  ]
};
  var COMFORT_KEY = "cookie-comfort";   // "0" = Komfort-Speicher aus
  var T = {
    link: ["Cookies", "Cookies", "Cookies"],
    title: ["Cookies & storage", "Cookies & Speicher", "Pliki cookie i pamięć"],
    lead: ["This site only stores what it needs to work. No tracking, no analytics, no advertising – so there is nothing you have to agree to.",
           "Diese Seite speichert nur, was sie zum Funktionieren braucht. Kein Tracking, keine Analyse, keine Werbung – deshalb musst du nichts zustimmen.",
           "Ta strona zapisuje tylko to, czego potrzebuje do działania. Bez śledzenia, analityki i reklam – więc nie musisz na nic się zgadzać."],
    necessary: ["Strictly necessary", "Notwendig", "Niezbędne"],
    necessary_note: ["Needed for sign-in, security and your chosen language. Cannot be switched off.",
                     "Für Anmeldung, Sicherheit und deine gewählte Sprache. Lässt sich nicht abschalten.",
                     "Potrzebne do logowania, bezpieczeństwa i wybranego języka. Nie można ich wyłączyć."],
    comfort: ["Comfort", "Komfort", "Wygoda"],
    comfort_note: ["Small conveniences stored only in your browser. Switch off and they are deleted and no longer saved.",
                   "Kleine Annehmlichkeiten, nur in deinem Browser gespeichert. Ausschalten löscht sie und speichert sie nicht mehr.",
                   "Drobne udogodnienia zapisane tylko w Twojej przeglądarce. Po wyłączeniu zostaną usunięte i nie będą zapisywane."],
    unused: ["Not used", "Nicht verwendet", "Nieużywane"],
    unused_text: ["Analytics, advertising, social-media pixels or any other tracking – none.",
                  "Analyse, Werbung, Social-Media-Pixel oder sonstiges Tracking – nichts davon.",
                  "Analityka, reklamy, piksele mediów społecznościowych ani inne śledzenie – nic z tego."],
    external: ["External content", "Externe Inhalte", "Treści zewnętrzne"],
    cookie: ["Cookie", "Cookie", "Cookie"],
    storage: ["Browser storage", "Browser-Speicher", "Pamięć przeglądarki"],
    always: ["Always on", "Immer an", "Zawsze włączone"],
    on: ["On", "An", "Wł."],
    off: ["Off", "Aus", "Wył."],
    privacy: ["Privacy policy", "Datenschutzerklärung", "Polityka prywatności"],
    close: ["Close", "Schließen", "Zamknij"]
  };
  var LANGS = ["en", "de", "pl"];

  function lang() {
    var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(l) >= 0 ? l : "en";
  }
  function t(key) { return T[key][LANGS.indexOf(lang())]; }
  function pick(value) {                       // Projekt-Text: {en, de, pl} oder ein String
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[lang()] || value.en || "";
  }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function storageGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* kein Speicher */ } }
  function storageRemove(key) { try { window.localStorage.removeItem(key); } catch (e) { /* kein Speicher */ } }

  // Für die Seiten: dürfen Komfort-Einträge gespeichert werden?
  window.cookieComfort = {
    allowed: function () { return storageGet(COMFORT_KEY) !== "0"; }
  };
  function applyComfort(on) {
    if (on) {
      storageRemove(COMFORT_KEY);
    } else {
      storageSet(COMFORT_KEY, "0");
      (CONFIG.comfort || []).forEach(function (item) { storageRemove(item.name); });
    }
  }
  if (!window.cookieComfort.allowed()) applyComfort(false);   // falls die Seite doch etwas abgelegt hat

  function itemRow(item) {
    var row = el("li", "ck-item");
    var head = el("div", "ck-item-head");
    head.appendChild(el("code", "ck-name", item.name));
    head.appendChild(el("span", "ck-kind", t(item.kind === "cookie" ? "cookie" : "storage")));
    row.appendChild(head);
    row.appendChild(el("p", "ck-what", pick(item.what)));
    if (item.keep) row.appendChild(el("p", "ck-keep", pick(item.keep)));
    return row;
  }

  function section(titleKey, noteKey, items, control, noteText) {
    var box = el("section", "ck-section");
    var head = el("div", "ck-section-head");
    var titles = el("div");
    titles.appendChild(el("h3", null, t(titleKey)));
    if (noteKey) titles.appendChild(el("p", "ck-note", noteText || t(noteKey)));
    head.appendChild(titles);
    if (control) head.appendChild(control);
    box.appendChild(head);
    if (items && items.length) {
      var list = el("ul", "ck-list");
      items.forEach(function (item) { list.appendChild(itemRow(item)); });
      box.appendChild(list);
    }
    return box;
  }

  function switchControl(checked, disabled, onChange) {
    var label = el("label", "ck-switch" + (disabled ? " ck-switch-locked" : ""));
    var input = el("input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    input.checked = checked;
    input.disabled = !!disabled;
    var text = el("span", "ck-switch-text", disabled ? t("always") : t(checked ? "on" : "off"));
    input.addEventListener("change", function () {
      text.textContent = t(input.checked ? "on" : "off");
      onChange(input.checked);
    });
    label.appendChild(input);
    label.appendChild(el("span", "ck-switch-track"));
    label.appendChild(text);
    return label;
  }

  var dialog = null;
  function build() {
    if (dialog) dialog.remove();
    dialog = el("dialog", "ck-dialog");
    dialog.tabIndex = -1;
    dialog.setAttribute("aria-labelledby", "ck-title");
    var top = el("div", "ck-top");
    var h = el("h2", null, t("title"));
    h.id = "ck-title";
    top.appendChild(h);
    var x = el("button", "ck-x", "×");
    x.type = "button";
    x.setAttribute("aria-label", t("close"));
    x.addEventListener("click", function () { dialog.close(); });
    top.appendChild(x);
    dialog.appendChild(top);
    dialog.appendChild(el("p", "ck-lead", t("lead")));
    dialog.appendChild(section("necessary", "necessary_note", CONFIG.necessary, switchControl(true, true), pick(CONFIG.necessary_note)));
    if (CONFIG.comfort && CONFIG.comfort.length) {
      dialog.appendChild(section("comfort", "comfort_note", CONFIG.comfort,
        switchControl(window.cookieComfort.allowed(), false, applyComfort)));
    }
    var unused = section("unused", null, null, null);
    unused.appendChild(el("p", "ck-note", t("unused_text")));
    dialog.appendChild(unused);
    if (CONFIG.external) {
      var ext = section("external", null, null, null);
      ext.appendChild(el("p", "ck-note", pick(CONFIG.external)));
      dialog.appendChild(ext);
    }
    var foot = el("div", "ck-foot");
    if (CONFIG.privacy) {
      var a = el("a", "ck-privacy", t("privacy"));
      a.href = pick(CONFIG.privacy);
      foot.appendChild(a);
    }
    var close = el("button", "ck-close", t("close"));
    close.type = "button";
    close.addEventListener("click", function () { dialog.close(); });
    foot.appendChild(close);
    dialog.appendChild(foot);
    dialog.addEventListener("click", function (ev) { if (ev.target === dialog) dialog.close(); });   // Klick daneben
    document.body.appendChild(dialog);
  }

  function open(ev) {
    if (ev) ev.preventDefault();
    build();                                    // jedes Mal frisch – Sprache kann gewechselt haben
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.focus();                              // Fokus aufs Fenster, nicht aufs × (kein Fokusrahmen beim Öffnen)
  }

  function labelLinks() {
    var links = document.querySelectorAll("[data-cookie-info]");
    for (var i = 0; i < links.length; i++) links[i].textContent = t("link");
  }

  function init() {
    var links = document.querySelectorAll("[data-cookie-info]");
    for (var i = 0; i < links.length; i++) links[i].addEventListener("click", open);
    labelLinks();
    if (window.MutationObserver) {
      new MutationObserver(labelLinks).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
    if (window.location.hash === "#cookies") open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
