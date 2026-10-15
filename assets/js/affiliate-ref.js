/* ─────────────────────────────────────────────────────────────
   Lien d'affiliation sur le site vitrine.

   Un affilié partage « ?ref=<code> ». Ce script fait deux choses :

   1. Mémorise le code dans un COOKIE posé sur « .wiz-expert.com », donc
      partagé avec les sous-domaines : www, wiz-tax et wiz-app le lisent tous.
      (Le localStorage ne conviendrait pas : il est cloisonné par origine, un
      code enregistré sur www serait invisible depuis wiz-tax.)

   2. Ajoute « ?ref=<code> » aux liens sortants vers les apps. Les trois hôtes
      d'acquisition étant sous wiz-expert.com, le cookie suffirait en théorie ;
      la décoration reste une ceinture pour les cas où il manque (mode privé,
      cookies bloqués, lien copié vers un autre navigateur).

   3. Compte le clic auprès du dashboard, via un endpoint PUBLIC verrouillé sur
      l'origine de ce site et limité en débit (le site étant statique, il ne
      peut pas porter le secret du webhook). Une seule fois par session et par
      code : un rechargement ou une navigation interne ne recompte pas.
   ───────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var PARAM = "ref";
  var COOKIE = "wiz_affiliate_ref";
  var COOKIE_DOMAIN = ".wiz-expert.com";
  var MAX_AGE_DAYS = 90;
  // Domaines des apps vers lesquels propager le code.
  // Les trois hôtes d'acquisition, tous sous wiz-expert.com depuis la bascule
  // de WizValue. Le cookie les couvre déjà ; la décoration reste une ceinture.
  var APP_HOSTS = [
    "wiz-tax.wiz-expert.com",
    "wiz-app.wiz-expert.com",
    "wiz-value.wiz-expert.com",
  ];
  var DASHBOARD_URL = "https://dashboard.wiz-expert.com";
  var COUNTED_KEY = "wiz_affiliate_counted";
  // Produit déduit du chemin : /wiz-tax/ -> wiztax. Ailleurs (accueil, CGV…),
  // le clic est rangé sur WizTax côté serveur, faute de mieux.
  var PRODUCT_BY_PATH = [
    ["/wiz-tax", "wiztax"],
    ["/wiz-value", "wizvalue"],
    ["/wiz-app", "wizapp"],
  ];

  /** Minuscules, caractères sûrs pour une URL ; null si rien d'exploitable. */
  function sanitize(raw) {
    var cleaned = String(raw || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "");
    return cleaned.length >= 2 && cleaned.length <= 40 ? cleaned : null;
  }

  function readCookie(name) {
    var m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return m ? decodeURIComponent(m.pop()) : null;
  }

  function writeCookie(name, value) {
    var maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
    // `domain` : partagé avec les sous-domaines. `SameSite=Lax` : le cookie
    // survit à une navigation depuis un lien externe (réseaux sociaux, email).
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; path=/; max-age=" +
      maxAge +
      "; domain=" +
      COOKIE_DOMAIN +
      "; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }

  /** Code de l'URL (prioritaire : c'est le clic en cours), sinon du cookie. */
  function resolveRef() {
    var fromUrl = null;
    try {
      fromUrl = sanitize(new URLSearchParams(location.search).get(PARAM));
    } catch (e) {
      /* URL exotique : on retombe sur le cookie */
    }
    if (fromUrl) {
      writeCookie(COOKIE, fromUrl);
      return fromUrl;
    }
    return sanitize(readCookie(COOKIE));
  }

  /** Ajoute ?ref= aux liens vers les apps, sans écraser un ref déjà présent. */
  function decorateLinks(ref) {
    var links = document.querySelectorAll('a[href*="wiz-expert.com"]');
    Array.prototype.forEach.call(links, function (a) {
      var url;
      try {
        url = new URL(a.getAttribute("href"), location.href);
      } catch (e) {
        return; // href relatif ou invalide : rien à faire
      }
      if (APP_HOSTS.indexOf(url.hostname) === -1) return;
      if (url.searchParams.get(PARAM)) return;
      url.searchParams.set(PARAM, ref);
      a.setAttribute("href", url.toString());
    });
  }

  /** Produit de la page courante, ou null (page générique). */
  function currentProduct() {
    for (var i = 0; i < PRODUCT_BY_PATH.length; i++) {
      if (location.pathname.indexOf(PRODUCT_BY_PATH[i][0]) === 0) return PRODUCT_BY_PATH[i][1];
    }
    return null;
  }

  /**
   * Compte le clic, une fois par session et par code. `keepalive` : l'appel
   * survit à un clic immédiat vers une app. Aucune erreur n'est remontée — le
   * comptage ne doit jamais gêner la navigation.
   */
  function countClick(ref) {
    try {
      if (sessionStorage.getItem(COUNTED_KEY) === ref) return;
      sessionStorage.setItem(COUNTED_KEY, ref);
    } catch (e) {
      /* sessionStorage indisponible : on compte quand même, le serveur
         dédoublonne par (IP, ref, produit) de son côté */
    }
    try {
      fetch(DASHBOARD_URL + "/api/affiliates/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: ref, product: currentProduct() }),
        keepalive: true,
        mode: "cors",
      }).catch(function () {});
    } catch (e) {
      /* fetch indisponible : sans gravité */
    }
  }

  var ref = resolveRef();
  if (!ref) return;

  countClick(ref);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      decorateLinks(ref);
    });
  } else {
    decorateLinks(ref);
  }
})();
