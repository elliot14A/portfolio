import type { ReferenceItem } from "@portfolio/chat";
import { Result } from "effect";
import { useEffect, useRef, useState } from "preact/hooks";

export type ChatMessage = {
  readonly id: string;
  readonly role: "user" | "assistant";
  readonly text: string;
  readonly references?: readonly ReferenceItem[];
  readonly timestamp: number;
};

const STORAGE_KEY = "elliot14a_chat_history_v1";
const MAX_STORED_MESSAGES = 40;

const isValidReference = (val: unknown): val is ReferenceItem => {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.title === "string" &&
    typeof obj.url === "string" &&
    (obj.type === "project" || obj.type === "experience")
  );
};

const isValidMessage = (val: unknown): val is ChatMessage => {
  if (typeof val !== "object" || val === null) return false;
  const obj = val as Record<string, unknown>;
  const validReferences =
    obj.references === undefined ||
    (Array.isArray(obj.references) && obj.references.every(isValidReference));

  return (
    typeof obj.id === "string" &&
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.text === "string" &&
    validReferences &&
    (typeof obj.timestamp === "number" || obj.timestamp === undefined)
  );
};

const loadStoredMessages = (): readonly ChatMessage[] => {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  const raw = Result.try(() => window.localStorage.getItem(STORAGE_KEY)).pipe(
    Result.getOrUndefined,
  );
  if (!raw) return [];
  const parsed = Result.try(() => JSON.parse(raw)).pipe(Result.getOrUndefined);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(isValidMessage)
    .map((m) => ({
      id: m.id,
      role: m.role,
      text: m.text,
      references: m.references,
      timestamp: m.timestamp ?? Date.now(),
    }))
    .slice(-MAX_STORED_MESSAGES);
};

const persistMessages = (messages: readonly ChatMessage[]): void => {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  const completeMessages = messages
    .filter((m) => m.text.trim().length > 0)
    .slice(-MAX_STORED_MESSAGES);

  if (completeMessages.length === 0) {
    Result.try(() => window.localStorage.removeItem(STORAGE_KEY));
    return;
  }
  const serialized = Result.try(() => JSON.stringify(completeMessages)).pipe(Result.getOrUndefined);
  if (serialized) {
    Result.try(() => window.localStorage.setItem(STORAGE_KEY, serialized));
  }
};

export const useChatHistory = () => {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(loadStoredMessages);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDebounced = (newMessages: readonly ChatMessage[], immediate = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (immediate) {
      persistMessages(newMessages);
    } else {
      debounceTimerRef.current = setTimeout(() => {
        persistMessages(newMessages);
      }, 400);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = Result.try(() => JSON.parse(e.newValue as string)).pipe(
          Result.getOrUndefined,
        );
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isValidMessage);
          setMessages(valid);
        }
      } else if (e.key === STORAGE_KEY && !e.newValue) {
        setMessages([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearHistory = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setMessages([]);
    Result.try(() => window.localStorage.removeItem(STORAGE_KEY));
  };

  return {
    messages,
    setMessages,
    saveDebounced,
    clearHistory,
  };
};
