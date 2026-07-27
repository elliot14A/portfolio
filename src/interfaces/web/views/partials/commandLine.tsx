export function CommandLine() {
  return (
    <>
      <div
        id="cmdline"
        class="cmdline"
        x-bind:class="messageError ? 'cmdline error' : 'cmdline'"
        x-text="message"
        aria-live="polite"
      />

      <div class="noice" x-show="mode === 'command'" x-cloak>
        <div class="noice-box">
          <span
            class="noice-title"
            x-text="cmdPrefix === '/' ? 'Search' : 'Cmdline'"
          />
          <span class="noice-prompt" x-text="cmdPrefix === '/' ? '/' : '›'" />
          <input
            id="cmd-input"
            class="noice-input"
            type="text"
            x-model="cmd"
            x-effect="mode === 'command' && $nextTick(() => $el.focus())"
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
          />
        </div>
      </div>

      <div class="telescope" x-show="telescopeOpen" x-cloak>
        <div class="tel-cols">
          <div class="tel-left">
            <div class="tel-panel tel-results">
              <span class="tel-title">Results</span>
              <ul class="tel-list">
                <template
                  x-for="(item, i) in telescopeItems()"
                  x-bind:key="item.path"
                >
                  <li
                    class="tel-item"
                    x-bind:class="i === telescopeSel ? 'tel-item tel-sel' : 'tel-item'"
                    x-on:click="telescopeConfirm(item.path)"
                  >
                    <span class="tel-icon" x-text="item.icon" />
                    <span class="tel-path" x-text="item.path" />
                  </li>
                </template>
              </ul>
            </div>
            <div class="tel-panel tel-promptbox">
              <span class="tel-title" x-text="telescopeTitle" />
              <div class="tel-prompt">
                <span class="tel-caret">›</span>
                <input
                  id="tel-input"
                  class="tel-input"
                  type="text"
                  x-model="telescopeQuery"
                  x-on:input="telescopeSel = 0; loadPreview()"
                  x-effect="telescopeOpen && $nextTick(() => $el.focus())"
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck={false}
                />
                <span
                  class="tel-count"
                  x-text="telescopeItems().length + ' / ' + telescopeAll.length"
                />
              </div>
            </div>
          </div>
          <div class="tel-panel tel-preview">
            <span class="tel-title">Preview</span>
            <div class="tel-preview-body" x-html="previewHtml" />
          </div>
        </div>
      </div>

      <div class="whichkey" x-show="whichkey" x-cloak>
        <div class="wk-grid">
          <template
            x-for="entry in (whichkey ? whichkey.entries : [])"
            x-bind:key="entry.key"
          >
            <div class="wk-item">
              <span class="wk-key" x-text="entry.key" />
              <span class="wk-sep">→</span>
              <span
                class="wk-label"
                x-bind:class="entry.group ? 'wk-label wk-group' : 'wk-label'"
                x-text="entry.group ? '+' + entry.label : entry.label"
              />
            </div>
          </template>
        </div>
        <div class="wk-hint">
          <span class="wk-esc">esc</span> close
        </div>
      </div>
    </>
  );
}
