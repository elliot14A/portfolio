import { raw } from "hono/html";
import type { Buffer } from "@/core/content/content.ts";

export type BufferViewProps = Readonly<{ buffer: Buffer }>;

const SIGN_GLYPH: Readonly<Record<string, string>> = {
  add: "+",
  change: "~",
  delete: "_",
};

/** `fillchars=eob:~` — the filler below the last line. Clipped by `.eob { overflow: hidden }`. */
const EOB_ROWS = 60;

/**
 * One row per source line: sign · number · text.
 *
 * The server prints absolute line numbers — with JS off that is exactly `number` without
 * `relativenumber`, a correct degradation. The client rewrites visible rows to the hybrid
 * relative form on cursor move.
 *
 * `line.html` is trusted: it is Shiki output generated at build time from our own content,
 * never user input.
 */
export function BufferView(props: BufferViewProps) {
  const { buffer } = props;
  return (
    <div
      id="buffer"
      class="buffer"
      data-path={buffer.path}
      data-lines={buffer.lines.length}
      data-ro={buffer.readOnly ? "1" : "0"}
      tabindex={0}
    >
      <div class="cursor" aria-hidden="true" />
      {buffer.lines.map((line, index) => (
        <div class="ln" data-n={index + 1} style={`--indent:${line.indent}`}>
          <span class={line.sign ? `sign sign-${line.sign}` : "sign"}>
            {line.sign ? SIGN_GLYPH[line.sign] : ""}
          </span>
          <span class="num">{index + 1}</span>
          <span class="txt">{raw(line.html)}</span>
        </div>
      ))}
      <div class="eob" aria-hidden="true">
        {Array.from({ length: EOB_ROWS }, () => (
          <div class="ln">
            <span class="sign" />
            <span class="num">~</span>
          </div>
        ))}
      </div>
    </div>
  );
}
