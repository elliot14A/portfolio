type DocumentProps = {
  readonly title: string;
  readonly description: string;
  readonly contentHtml: string;
};

export const renderDocument = ({
  title,
  description,
  contentHtml,
}: DocumentProps): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#08080a" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/JetBrainsMono-Bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <div id="crt" aria-hidden="true"></div>
  ${contentHtml}
  <script>
    (function () {
      var sect = document.getElementById("sbar-sect");
      var meter = document.getElementById("sbar-meter");
      var pct = document.getElementById("sbar-pct");
      var clock = document.getElementById("sbar-clock");

      function tick() {
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, "0");
        var mm = String(now.getMinutes()).padStart(2, "0");
        if (clock) clock.textContent = hh + ":" + mm;
      }
      tick();
      setInterval(tick, 10000);

      var anchors = [
        { id: "intro", name: "intro" },
        { id: "toolbox", name: "toolbox" },
        { id: "experience", name: "experience" },
        { id: "projects", name: "projects" },
        { id: "contact", name: "contact" }
      ];

      function upd() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        var filled = Math.round(p * 8);
        if (meter) meter.textContent = "▓".repeat(filled) + "░".repeat(8 - filled);
        if (pct) pct.textContent = Math.round(p * 100) + "%";

        var mark = window.innerHeight * 0.45;
        var current = "intro";
        for (var i = 0; i < anchors.length; i++) {
          var item = anchors[i];
          var el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top < mark) {
            current = item.name;
          }
        }
        if (p > 0.98) current = "contact";
        if (sect) sect.textContent = " ▸ " + current;
      }

      var ticking = false;
      window.addEventListener("scroll", function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(function () {
            upd();
            ticking = false;
          });
        }
      }, { passive: true });
      window.addEventListener("resize", upd);
      upd();
    })();
  </script>
  <script type="module" src="/js/client.js"></script>
</body>
</html>`;
