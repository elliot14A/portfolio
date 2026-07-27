import { formatPosition, formatProgress } from "@/core/content/content";
import { ICON } from "@/core/content/icons";

export type StatuslineProps = Readonly<{
  mode: string;
  path: string;
  lang: string;
  line: number;
  column: number;
  total: number;
  branch: string;
  readOnly: boolean;
}>;

export function Statusline(props: StatuslineProps) {
  const modeKey = props.mode.toLowerCase().split(" ")[0] ?? "normal";
  return (
    <div id="statusline" class="statusline" hx-swap-oob="true">
      <span class="sl-a" data-mode={modeKey}>
        {props.mode}
      </span>
      <span class="sl-b">
        <span class="sl-branch">
          {ICON.branch} {props.branch}
        </span>
      </span>
      <span class="sl-c">
        {props.path}
        {props.readOnly ? <span class="sl-ro"> [RO]</span> : null}
      </span>
      <span class="sl-fill" />
      <span class="sl-x">{props.lang}</span>
      <span class="sl-y">{formatProgress(props.line, props.total)}</span>
      <span class="sl-z">{formatPosition(props.line, props.column)}</span>
    </div>
  );
}
