import { Shell } from "../layouts/shell.tsx";
import { Dashboard } from "../partials/dashboard.tsx";
import { Statusline } from "../partials/statusline.tsx";

export type StartPageProps = Readonly<{
  buffers: number;
  lines: number;
  branch: string;
}>;

export function StartPage(props: StartPageProps) {
  return (
    <Shell
      title="Akshith Katkuri — backend developer"
      description="Backend developer. TypeScript, Go, Postgres. This portfolio is my Neovim config, running on a Cloudflare Worker."
    >
      <div class="editor editor-alpha">
        <main class="windows">
          <div class="win win-focused">
            <Dashboard buffers={props.buffers} lines={props.lines} />
          </div>
        </main>
        <Statusline
          mode="NORMAL"
          path="alpha"
          lang="alpha"
          line={1}
          column={1}
          total={1}
          branch={props.branch}
          readOnly={false}
        />
        <div id="cmdline" class="cmdline" aria-live="polite" />
      </div>
    </Shell>
  );
}
