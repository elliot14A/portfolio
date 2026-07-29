const envString = (env: unknown, key: string, fallback = ""): string => {
  if (typeof env === "object" && env !== null && key in env) {
    const value = (env as Record<string, unknown>)[key];
    if (typeof value === "string" && value !== "") return value;
  }
  return fallback;
};

const envJson = (env: unknown, key: string): Record<string, unknown> => {
  const raw = envString(env, key);
  if (raw === "") return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};

export type LlmConfig = Readonly<{
  baseUrl: string;
  apiKey: string;
  model: string;
  extraBody: Readonly<Record<string, unknown>>;
}>;

export const readLlmConfig = (env: unknown): LlmConfig => ({
  baseUrl: envString(
    env,
    "PORTFOLIO_OPENAI_BASE_URL",
    "https://openrouter.ai/api/v1",
  ),
  apiKey: envString(env, "PORTFOLIO_OPENAI_API_KEY"),
  model: envString(
    env,
    "PORTFOLIO_OPENAI_MODEL",
    "deepseek/deepseek-v4-flash-0731",
  ),
  extraBody: envJson(env, "PORTFOLIO_OPENAI_EXTRA_BODY"),
});
