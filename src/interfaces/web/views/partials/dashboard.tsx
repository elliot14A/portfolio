/**
 * The alpha-nvim start screen: what you land on before any buffer is open.
 *
 * The tabline and file tree are deliberately absent — nothing is open yet, which is
 * exactly what nvim shows. They appear once a buffer is loaded.
 */

/** "elliot14A" in ANSI Shadow, the font alpha-nvim uses for its own header. */
const BANNER: ReadonlyArray<string> = [
  "███████╗██╗     ██╗     ██╗ ██████╗ ████████╗ ██╗██╗  ██╗ █████╗ ",
  "██╔════╝██║     ██║     ██║██╔═══██╗╚══██╔══╝███║██║  ██║██╔══██╗",
  "█████╗  ██║     ██║     ██║██║   ██║   ██║   ╚██║███████║███████║",
  "██╔══╝  ██║     ██║     ██║██║   ██║   ██║    ██║╚════██║██╔══██║",
  "███████╗███████╗███████╗██║╚██████╔╝   ██║    ██║     ██║██║  ██║",
  "╚══════╝╚══════╝╚══════╝╚═╝ ╚═════╝    ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝",
];

type MenuEntry = Readonly<{
  icon: string;
  label: string;
  key: string;
  href: string;
  external?: boolean;
}>;

/**
 * Only bindings that actually work are listed. Telescope (`f` find files, `t` find text)
 * joins this list when it lands — an entry that does nothing is worse than no entry.
 */
const MENU: ReadonlyArray<MenuEntry> = [
  { icon: "", label: "Profile", key: "r", href: "/b/README.md" },
  { icon: "", label: "Projects", key: "p", href: "/b/projects/portfolio.md" },
  { icon: "", label: "Configuration", key: "c", href: "/b/.config/nvim/init.lua" },
  { icon: "", label: "Help", key: "h", href: "/b/doc/help.txt" },
  { icon: "", label: "GitHub", key: "g", href: "https://github.com/elliot14A", external: true },
  {
    icon: "",
    label: "Email",
    key: "e",
    href: "mailto:akshithkatkuri@gmail.com",
    external: true,
  },
];

export type DashboardProps = Readonly<{
  buffers: number;
  lines: number;
}>;

export function Dashboard(props: DashboardProps) {
  return (
    <div id="buffer" class="alpha" data-path="alpha" tabindex={0}>
      <div class="alpha-inner">
        {/* Text that is really a picture — screen readers get the name, not 390 box glyphs. */}
        <pre class="alpha-banner" role="img" aria-label="elliot14A">
          {BANNER.join("\n")}
        </pre>

        <h1 class="alpha-name">Akshith Katkuri</h1>
        <p class="alpha-role">backend developer</p>

        <nav class="alpha-menu">
          {MENU.map((entry) => (
            // Plain navigation, not htmx: leaving alpha swaps the whole layout in — the
            // tabline and tree do not exist on this screen to be updated out of band.
            <a
              class="alpha-item"
              href={entry.href}
              data-key={entry.key}
              {...(entry.external ? { rel: "me noopener", target: "_blank" } : {})}
            >
              <span class="alpha-icon">{entry.icon}</span>
              <span class="alpha-label">{entry.label}</span>
              <span class="alpha-key">{entry.key}</span>
            </a>
          ))}
        </nav>

        <footer class="alpha-footer">
          <a class="alpha-link" href="mailto:akshithkatkuri@gmail.com">
            akshithkatkuri@gmail.com
          </a>
          <a class="alpha-link" href="https://github.com/elliot14A" rel="me noopener">
            github.com/elliot14A
          </a>
          <p class="alpha-stats">
            {props.buffers} buffers · {props.lines} lines loaded
          </p>
        </footer>
      </div>
    </div>
  );
}
