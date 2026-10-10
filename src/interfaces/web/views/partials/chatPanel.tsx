import { ICON } from "@/core/content/icons";

export function ChatPanel() {
  return (
    <>
      <aside class="chat" x-show="chatOpen" x-cloak>
        <div class="chat-head">
          <span class="chat-title">ask elliot14A</span>
          <span class="chat-close" x-on:click="closeChat()">
            esc
          </span>
        </div>

        <div class="chat-log" id="chat-log">
          <div class="chat-empty" x-show="chatTurns.length === 0">
            Ask about Akshith's work, skills, or how to reach him. He'll open
            the right buffers as he answers.
          </div>

          <template x-for="(turn, i) in chatTurns" x-bind:key="i">
            <div class="chat-turn">
              <div class="chat-q">
                <span class="chat-caret">›</span> <span x-text="turn.q" />
              </div>
              <div class="chat-a" x-text="turn.a" />
              <template x-for="(act, j) in turn.acts" x-bind:key="j">
                <button type="button" class="chat-act" x-on:click="runAct(act)">
                  <span class="chat-act-mark">↳</span>{" "}
                  <span x-text="act.label" />
                </button>
              </template>
            </div>
          </template>

          <div
            class="chat-thinking"
            x-show="chatBusy && chatTurns.length > 0 && chatTurns[chatTurns.length - 1].a === ''"
          >
            thinking…
          </div>
        </div>

        <div class="chat-input-box">
          <span class="chat-prompt">›</span>
          <input
            id="chat-input"
            class="chat-input"
            type="text"
            x-model="chatInput"
            x-on:keydown="chatKey($event)"
            placeholder="ask about Akshith…"
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
          />
        </div>
      </aside>

      <button
        type="button"
        class="chat-fab"
        x-show="!chatOpen"
        x-cloak
        x-on:click="openChat('')"
      >
        <span class="chat-fab-icon">{ICON.chat}</span> ask
      </button>
    </>
  );
}
