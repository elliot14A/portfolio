import { PortfolioApi, type ReferenceItem, type StreamChatEvent } from "@portfolio/chat";
import { Effect, Result, Stream } from "effect";
import { FetchHttpClient } from "effect/unstable/http";
import { HttpApiClient } from "effect/unstable/httpapi";
import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  assistantOutput,
  backdrop,
  backdropDismiss,
  boldText,
  bulletMarker,
  closeButton,
  codeBlock,
  contentArea,
  headerActions,
  headerTitle,
  highlightPill,
  inlineCode,
  inputArea,
  modal,
  modalHeader,
  outputBullet,
  outputHeading,
  outputParagraph,
  promptIndicator,
  promptInput,
  promptPrompt,
  referenceArrow,
  referenceExternalIcon,
  referenceLink,
  referencesContainer,
  referencesLabel,
  referencesList,
  referenceTitle,
  slashPrefix,
  streamingCursor,
  suggestionItem,
  suggestionsBlock,
  suggestionsLabel,
  triggerButton,
  triggerDot,
  userPromptLine,
  waitingIndicator,
  writeupLink,
} from "./aiAssistant.css";
import { type ChatMessage, useChatHistory } from "./useChatHistory";

const SUGGESTIONS: readonly string[] = [
  "Give me a quick summary of your background and experience",
  "What are your most impactful engineering projects?",
  "What is your core tech stack and what roles fit you best?",
  "How can I get in touch or schedule an interview?",
];

const INLINE_TOKEN_REGEX = /\[([^\]]+)\]\(([^)]*)\)|\[([^\]]+)\](?!\()|`([^`]+)`|\*\*([^*]+)\*\*/g;

const renderInline = (text: string, keyPrefix: string): (string | JSX.Element)[] => {
  const elements: (string | JSX.Element)[] = [];
  let lastIdx = 0;
  INLINE_TOKEN_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null = INLINE_TOKEN_REGEX.exec(text);

  while (match !== null) {
    if (match.index > lastIdx) {
      elements.push(text.slice(lastIdx, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith("/") || url.startsWith("#");
      elements.push(
        <a
          key={`${keyPrefix}-lnk-${match.index}`}
          href={url}
          className={writeupLink}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noreferrer"}
        >
          {label}
        </a>,
      );
    } else if (match[3] !== undefined) {
      elements.push(
        <span key={`${keyPrefix}-hl-${match.index}`} className={highlightPill}>
          {match[3]}
        </span>,
      );
    } else if (match[4] !== undefined) {
      elements.push(
        <code key={`${keyPrefix}-cd-${match.index}`} className={inlineCode}>
          {match[4]}
        </code>,
      );
    } else if (match[5] !== undefined) {
      elements.push(
        <strong key={`${keyPrefix}-b-${match.index}`} className={boldText}>
          {match[5]}
        </strong>,
      );
    }

    lastIdx = match.index + match[0].length;
    match = INLINE_TOKEN_REGEX.exec(text);
  }

  if (lastIdx < text.length) {
    elements.push(text.slice(lastIdx));
  }

  return elements;
};

const renderMarkdown = (rawText: string, isStreamingActive: boolean): JSX.Element[] => {
  if (!rawText.trim()) {
    return [];
  }

  const codeSplit = rawText.split(/(```[\s\S]*?```)/g);
  const elements: JSX.Element[] = [];

  for (let b = 0; b < codeSplit.length; b++) {
    const block = codeSplit[b];
    if (!block) continue;

    if (block.startsWith("```") && block.endsWith("```")) {
      const firstNl = block.indexOf("\n");
      const code = firstNl !== -1 ? block.slice(firstNl + 1, -3) : block.slice(3, -3);
      elements.push(
        <pre key={`cb-${b}`} className={codeBlock}>
          <code>{code}</code>
        </pre>,
      );
      continue;
    }

    const lines = block.split("\n");
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l];
      if (!line && l > 0 && lines[l - 1] === "") {
        continue;
      }
      if (!line?.trim()) {
        continue;
      }

      const key = `b-${b}-l-${l}`;
      const isLastLine = b === codeSplit.length - 1 && l === lines.length - 1;

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key} className={outputHeading}>
            {renderInline(line.slice(4), key)}
            {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
          </h3>,
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key} className={outputHeading}>
            {renderInline(line.slice(3), key)}
            {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
          </h2>,
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key} className={outputHeading}>
            {renderInline(line.slice(2), key)}
            {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
          </h1>,
        );
      } else if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.slice(2);
        elements.push(
          <div key={key} className={outputBullet}>
            <span className={bulletMarker}>•</span>
            <span>
              {renderInline(content, key)}
              {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
            </span>
          </div>,
        );
      } else {
        const numMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch?.[1] && numMatch[2]) {
          elements.push(
            <div key={key} className={outputBullet}>
              <span className={bulletMarker}>{numMatch[1]}</span>
              <span>
                {renderInline(numMatch[2], key)}
                {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
              </span>
            </div>,
          );
        } else {
          elements.push(
            <p key={key} className={outputParagraph}>
              {renderInline(line, key)}
              {isStreamingActive && isLastLine && <span className={streamingCursor}>▋</span>}
            </p>,
          );
        }
      }
    }
  }

  return elements;
};

export const AiAssistant = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const { messages, setMessages, saveDebounced, clearHistory } = useChatHistory();

  const contentAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [messages, isBusy]);

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveDebounced(nextMessages, true);
    setInput("");
    setIsBusy(true);

    const assistantId = `a-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      text: "",
      references: [],
      timestamp: Date.now(),
    };

    const activeList = [...nextMessages, initialAssistantMsg];
    setMessages(activeList);

    let lineBuffer = "";
    let assistantText = "";
    let assistantRefs: readonly ReferenceItem[] = [];

    const historyPayload = messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          !m.text.startsWith("// error:") &&
          !m.text.startsWith("[Error:"),
      )
      .filter((m) => m.text.trim().length > 0)
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.text.trim(),
      }));

    const chatProgram = Effect.gen(function* () {
      const client = yield* HttpApiClient.make(PortfolioApi);
      const byteStream = yield* client.chat.ask({
        payload: {
          message: trimmed,
          history: historyPayload.length > 0 ? historyPayload : undefined,
        },
      });

      yield* byteStream.pipe(
        Stream.decodeText(),
        Stream.runForEach((chunk) =>
          Effect.sync(() => {
            lineBuffer += chunk;
            const parts = lineBuffer.split("\n\n");
            lineBuffer = parts.pop() ?? "";

            for (const part of parts) {
              const trimmedPart = part.trim();
              if (trimmedPart.startsWith("data: ")) {
                const jsonStr = trimmedPart.slice(6);
                const event = Result.try(() => JSON.parse(jsonStr) as StreamChatEvent).pipe(
                  Result.getOrUndefined,
                );

                if (event) {
                  if (event.type === "delta") {
                    assistantText += event.text;
                  } else if (event.type === "references") {
                    assistantRefs = event.items;
                  } else if (event.type === "error") {
                    assistantText = `// error: ${event.message}`;
                  }
                }
              }
            }

            const updatedList = activeList.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    text: assistantText,
                    references: assistantRefs.length > 0 ? assistantRefs : undefined,
                  }
                : m,
            );

            setMessages(updatedList);
            saveDebounced(updatedList, false);
          }),
        ),
      );

      const finalCleanText =
        assistantText.trim().length > 0
          ? assistantText
          : "// error: No response received from assistant. Please try again.";

      const finalList = activeList.map((m) =>
        m.id === assistantId
          ? {
              ...m,
              text: finalCleanText,
              references: assistantRefs.length > 0 ? assistantRefs : undefined,
            }
          : m,
      );
      setMessages(finalList);
      saveDebounced(finalList, true);
    }).pipe(
      Effect.catch((err: unknown) =>
        Effect.sync(() => {
          let errorMessage = "Unable to connect to assistant right now.";

          if (typeof err === "object" && err !== null) {
            const errObj = err as Record<string, unknown>;
            if (
              errObj._tag === "RateLimited" ||
              errObj.error === "DeviceDailyLimitExceeded" ||
              errObj.error === "GlobalDailyQuotaExceeded"
            ) {
              errorMessage =
                typeof errObj.message === "string" && errObj.message.trim().length > 0
                  ? errObj.message
                  : "Daily message limit reached. Please try again tomorrow.";
            } else if (errObj._tag === "ServiceUnavailable") {
              errorMessage =
                typeof errObj.message === "string" && errObj.message.trim().length > 0
                  ? errObj.message
                  : "AI service is currently not configured.";
            } else if (
              errObj.response &&
              typeof errObj.response === "object" &&
              (errObj.response as Record<string, unknown>).status === 429
            ) {
              errorMessage = "Daily message limit reached. Please try again tomorrow.";
            } else if (typeof errObj.message === "string" && errObj.message.trim().length > 0) {
              errorMessage = errObj.message;
            }
          }

          const errorList = activeList.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  text: `// error: ${errorMessage}`,
                  references: undefined,
                }
              : m,
          );
          setMessages(errorList);
          saveDebounced(errorList, true);
        }),
      ),
      Effect.ensuring(Effect.sync(() => setIsBusy(false))),
      Effect.provide(FetchHttpClient.layer),
    );

    Effect.runPromise(chatProgram);
  };

  const lastMessage = messages[messages.length - 1];
  const isAwaitingFirstChunk =
    isBusy && (!lastMessage || lastMessage.role === "user" || lastMessage.text === "");

  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (!isAwaitingFirstChunk) {
      setDotCount(1);
      return;
    }
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 350);
    return () => clearInterval(interval);
  }, [isAwaitingFirstChunk]);

  return (
    <>
      <button
        type="button"
        className={triggerButton}
        onClick={() => setIsOpen(true)}
        aria-label="Open Ask AI"
      >
        <span className={triggerDot} />
        <span>Ask AI</span>
      </button>

      {isOpen && (
        <div className={backdrop}>
          <button
            type="button"
            className={backdropDismiss}
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            tabIndex={-1}
          />
          <div className={modal} role="dialog" aria-modal="true">
            <header className={modalHeader}>
              <div className={headerTitle}>
                <span className={slashPrefix}>{"//"}</span>
                <span>ask elliot</span>
              </div>
              <div className={headerActions}>
                {messages.length > 0 && (
                  <button
                    type="button"
                    className={closeButton}
                    onClick={clearHistory}
                    aria-label="Clear chat history"
                    title="Clear conversation"
                  >
                    [clear]
                  </button>
                )}
                <button
                  type="button"
                  className={closeButton}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  [esc]
                </button>
              </div>
            </header>

            <div className={contentArea} ref={contentAreaRef}>
              {messages.length === 0 ? (
                <div className={suggestionsBlock}>
                  <p className={suggestionsLabel}>select a question or type below:</p>
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className={suggestionItem}
                      onClick={() => handleSubmit(suggestion)}
                    >
                      <span className={promptIndicator}>&gt;</span>
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isCurrentStreaming =
                    isBusy && msg.role === "assistant" && idx === messages.length - 1;

                  return msg.role === "user" ? (
                    <div key={msg.id} className={userPromptLine}>
                      <span className={slashPrefix}>&gt;</span>
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <div key={msg.id} className={assistantOutput}>
                      {renderMarkdown(msg.text, isCurrentStreaming)}
                      {msg.references && msg.references.length > 0 && (
                        <div className={referencesContainer}>
                          <span className={referencesLabel}>{"// references"}</span>
                          <div className={referencesList}>
                            {msg.references.map((ref, refIdx) => {
                              const isInternal = ref.url.startsWith("/") || ref.url.startsWith("#");
                              return (
                                <a
                                  key={`ref-${msg.id}-${refIdx}`}
                                  href={ref.url}
                                  className={referenceLink}
                                  target={isInternal ? undefined : "_blank"}
                                  rel={isInternal ? undefined : "noreferrer"}
                                >
                                  <span className={referenceArrow}>&gt;</span>
                                  <span className={referenceTitle}>{ref.title}</span>
                                  <span className={referenceExternalIcon}>↗</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isAwaitingFirstChunk && (
                <div className={assistantOutput}>
                  <div className={waitingIndicator}>
                    <span className={slashPrefix}>{"//"}</span>
                    <span>thinking{".".repeat(dotCount)}</span>
                  </div>
                </div>
              )}
            </div>

            <form
              className={inputArea}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(input);
              }}
            >
              <span className={promptPrompt}>&gt;</span>
              <input
                ref={inputRef}
                type="text"
                className={promptInput}
                placeholder="Ask about architecture, projects, or experience..."
                value={input}
                disabled={isBusy}
                onInput={(e) => setInput((e.target as HTMLInputElement).value)}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};
