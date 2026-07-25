import { Shell } from "../layouts/shell";
import { Statusline } from "../partials/statusline";

export type ErrorPageProps = Readonly<{
  status: number;
  line: string;
  branch: string;
}>;

export function ErrorPage(props: ErrorPageProps) {
  return (
    <Shell
      title={`${props.status} - Akshith Katkuri`}
      description="Nothing here."
      noIndex={true}
    >
      <div class="editor editor-alpha">
        <main class="windows">
          <div class="win win-focused">
            <div class="alpha">
              <div class="alpha-inner">
                <p class="err-status">{props.status}</p>
                <p class="err-code">{props.line}</p>
                <a class="alpha-link" href="/">
                  :e / to go back to the start screen
                </a>
              </div>
            </div>
          </div>
        </main>
        <Statusline
          mode="NORMAL"
          path="[No Name]"
          lang=""
          line={1}
          column={1}
          total={1}
          branch={props.branch}
          readOnly={false}
        />
        <div id="cmdline" class="cmdline error">
          {props.line}
        </div>
      </div>
    </Shell>
  );
}
