import type { Buffer, TreeNode } from "@/core/content/content";
import { Shell } from "../layouts/shell";
import { BufferView } from "../partials/buffer";
import { ChatPanel } from "../partials/chatPanel";
import { CommandLine } from "../partials/commandLine";
import { NeoTree } from "../partials/neotree";
import { Statusline } from "../partials/statusline";
import { Tabline } from "../partials/tabline";

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
      title={`${buffer.name} - Akshith Katkuri`}
      description="Backend developer. Neovim, as a website."
    >
      <div class="editor" x-data="editor">
        <Tabline buffers={props.buffers} active={buffer.path} />
        <main class="windows">
          <div class="win win-focused">
            <BufferView buffer={buffer} />
          </div>
          <NeoTree nodes={props.tree} active={buffer.path} />
          <ChatPanel />
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
        <CommandLine />
      </div>
    </Shell>
  );
}
