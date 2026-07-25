import { ICON } from "@/core/content/icons";

// "elliot14A" in ANSI Regular, solid blocks (the shadow variant renders as a
// wireframe mesh at this size).
const BANNER: ReadonlyArray<string> = [
  "███████ ██      ██      ██  ██████  ████████  ██ ██   ██  █████  ",
  "██      ██      ██      ██ ██    ██    ██    ███ ██   ██ ██   ██ ",
  "█████   ██      ██      ██ ██    ██    ██     ██ ███████ ███████ ",
  "██      ██      ██      ██ ██    ██    ██     ██      ██ ██   ██ ",
  "███████ ███████ ███████ ██  ██████     ██     ██      ██ ██   ██ ",
];

type MenuEntry = Readonly<{
  icon: string;
  label: string;
  key: string;
  href: string;
  external?: boolean;
}>;

// Only bindings that already work are listed; an entry that does nothing is
// worse than no entry.
const MENU: ReadonlyArray<MenuEntry> = [
  { icon: ICON.user, label: "Profile", key: "r", href: "/b/README.md" },
  {
    icon: ICON.folderOpen,
    label: "Projects",
    key: "p",
    href: "/b/projects/gaur.md",
  },
  {
    icon: ICON.cog,
    label: "Configuration",
    key: "c",
    href: "/b/.config/nvim/init.lua",
  },
  { icon: ICON.question, label: "Help", key: "h", href: "/b/doc/help.txt" },
  {
    icon: ICON.github,
    label: "GitHub",
    key: "g",
    href: "https://github.com/elliot14A",
    external: true,
  },
  {
    icon: ICON.mail,
    label: "Email",
    key: "e",
    href: "mailto:akshithkatkuri14@gmail.com",
    external: true,
  },
];

export function Dashboard() {
  return (
    <div id="buffer" class="alpha" data-path="alpha" tabindex={0}>
      <div class="alpha-inner">
        <pre class="alpha-banner" role="img" aria-label="elliot14A">
          {BANNER.join("\n")}
        </pre>

        <h1 class="alpha-name">Akshith Katkuri</h1>
        <p class="alpha-role">backend engineer &amp; cofounder</p>

        <nav class="alpha-menu">
          {MENU.map((entry) => (
            <a
              class="alpha-item"
              href={entry.href}
              data-key={entry.key}
              {...(entry.external
                ? { rel: "me noopener", target: "_blank" }
                : {})}
            >
              <span class="alpha-icon">{entry.icon}</span>
              <span class="alpha-label">{entry.label}</span>
              <span class="alpha-key">{entry.key}</span>
            </a>
          ))}
        </nav>

        <footer class="alpha-footer">
          <a class="alpha-link" href="mailto:akshithkatkuri14@gmail.com">
            akshithkatkuri14@gmail.com
          </a>
          <a
            class="alpha-link"
            href="https://github.com/elliot14A"
            rel="me noopener"
          >
            github.com/elliot14A
          </a>
        </footer>
      </div>
    </div>
  );
}
