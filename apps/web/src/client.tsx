import { h, hydrate } from "preact";
import { AiAssistant } from "./components/aiAssistant";

function init() {
  const mountEl = document.getElementById("ai-assistant-root");
  if (mountEl) {
    hydrate(h(AiAssistant, null), mountEl);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
