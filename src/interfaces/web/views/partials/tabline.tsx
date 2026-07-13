import type { Buffer } from "@/core/content/content.ts";

export type TablineProps = Readonly<{
  buffers: ReadonlyArray<Buffer>;
  active: string;
}>;

/** bufferline-style tabs. Real anchors, so right-click-open and no-JS both work. */
export function Tabline(props: TablineProps) {
  return (
    <nav id="tabline" class="tabline" hx-swap-oob="true">
      {props.buffers.map((buffer) => (
        <a
          class={buffer.path === props.active ? "tab tab-active" : "tab"}
          href={`/b/${buffer.path}`}
          hx-get={`/b/${buffer.path}`}
          hx-target="#buffer"
          hx-swap="outerHTML"
          hx-push-url="true"
          data-path={buffer.path}
        >
          <span class="tab-icon">{buffer.icon}</span>
          <span class="tab-name">{buffer.name}</span>
        </a>
      ))}
      <span class="tab-fill" />
    </nav>
  );
}
