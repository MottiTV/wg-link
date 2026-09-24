(function () {
  var KEY = "wg_lang";
  var LABELS = { en: "Language", de: "Sprache", pl: "Język" };

  function current() {
    var lang = document.documentElement.getAttribute("data-lang") || "en";
    return /^(en|de|pl)$/.test(lang) ? lang : "en";
  }

  function stampLinks(lang) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|#)/i.test(href)) return;
      var url;
      try {
        url = new URL(href, location.href);
      } catch (e) {
        return;
      }
      if (url.origin !== location.origin) return;
      if (!/\.html$/i.test(url.pathname)) return;
      url.searchParams.set("lang", lang);
      var file = url.pathname.split("/").pop() || "index.html";
      a.setAttribute("href", file + url.search + url.hash);
    });
  }

  function apply(lang, push) {
    if (!/^(en|de|pl)$/.test(lang)) lang = "en";
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
    var sel = document.getElementById("lang");
    if (sel) {
      sel.value = lang;
      sel.setAttribute("aria-label", LABELS[lang]);
    }
    var block = document.querySelector('.lang-block[data-lang="' + lang + '"]');
    if (block && block.getAttribute("data-title")) {
      document.title = block.getAttribute("data-title");
    }
    stampLinks(lang);
    try {
      var url = new URL(location.href);
      if (url.searchParams.get("lang") !== lang) {
        url.searchParams.set("lang", lang);
        if (push) history.pushState({ lang: lang }, "", url);
        else history.replaceState({ lang: lang }, "", url);
      }
    } catch (e) {}
  }

  var sel = document.getElementById("lang");
  if (sel) {
    sel.addEventListener("change", function () {
      apply(sel.value, true);
    });
  }
  window.addEventListener("popstate", function () {
    var q = "";
    try {
      q = new URL(location.href).searchParams.get("lang") || "";
    } catch (e) {}
    if (/^(en|de|pl)$/.test(q)) apply(q, false);
  });
  apply(current(), false);
})();
