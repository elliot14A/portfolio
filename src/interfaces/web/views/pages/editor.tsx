import type { Buffer, TreeNode } from "@/core/content/content.ts";
import { Shell } from "../layouts/shell.tsx";
import { BufferView } from "../partials/buffer.tsx";
import { NeoTree } from "../partials/neotree.tsx";
import { Statusline } from "../partials/statusline.tsx";
import { Tabline } from "../partials/tabline.tsx";

export type EditorPageProps = Readonly<{
  buffer: Buffer;
  buffers: ReadonlyArray<Buffer>;
  tree: ReadonlyArray<TreeNode>;
  branch: string;
}>;

export function EditorPage(props: EditorPageProps) {
  const { buffer } = props;
  return (
    <Shell
      title={`${buffer.name} — Akshith Katkuri`}
      description="Backend developer. Neovim, as a website."
    >
      <div class="editor">
        <Tabline buffers={props.buffers} active={buffer.path} />
        <main class="windows">
          <div class="win win-focused">
            <BufferView buffer={buffer} />
          </div>
          <NeoTree nodes={props.tree} active={buffer.path} />
        </main>
        <Statusline
          mode="NORMAL"
          path={buffer.path}
          lang={buffer.lang}
          line={1}
          column={1}
          total={buffer.lines.length}
          branch={props.branch}
          readOnly={buffer.readOnly}
        />
        <div id="cmdline" class="cmdline" aria-live="polite" />
      </div>
    </Shell>
  );
}
