import { Shell } from "../layouts/shell";
import { Dashboard } from "../partials/dashboard";
import { Statusline } from "../partials/statusline";

export type StartPageProps = Readonly<{
  branch: string;
}>;

export function StartPage(props: StartPageProps) {
  return (
    <Shell
      title="Akshith Katkuri - backend engineer"
      description="Backend engineer and technical cofounder. TypeScript, Node.js, Rust, Go. This portfolio is a working Neovim clone on a Cloudflare Worker."
    >
      <div class="editor editor-alpha" x-data="startMenu">
        <main class="windows">
          <div class="win win-focused">
            <Dashboard />
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
