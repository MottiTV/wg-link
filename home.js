/* Startseite: Command-Center-Reiter schalten den Screenshot um (je Sprachblock). */
(function () {
  document.querySelectorAll(".show").forEach(function (box) {
    var tabs = box.querySelectorAll(".tab");
    var imgs = box.querySelectorAll(".shot img");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.toggle("on", t === tab); });
        imgs.forEach(function (img, i) { img.classList.toggle("on", String(i) === tab.getAttribute("data-i")); });
      });
    });
  });
  // Kopfleisten-Links (#how usw.) zeigen auf den Abschnitt der aktiven Sprache
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var lang = document.documentElement.getAttribute("data-lang") || "en";
      var base = a.getAttribute("href").slice(1).replace(/-(en|de|pl)$/, "");
      var el = document.getElementById(base + "-" + lang);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", location.search + "#" + base); }
    });
  });
})();
