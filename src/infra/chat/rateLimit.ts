import { err, ok } from "neverthrow";
import type { RateLimit } from "@/core/chat/ports";
import { appError, ChatErrorCode } from "@/core/error";

export type KvStore = Readonly<{
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}>;

export type RateLimitDeps = Readonly<{
  kv: KvStore;
  perIpPerDay: number;
  globalPerDay: number;
}>;

const TTL_SECONDS = 60 * 60 * 26;

const today = (): string => new Date().toISOString().slice(0, 10);

const count = async (kv: KvStore, key: string): Promise<number> => {
  const raw = await kv.get(key);
  const parsed = Number.parseInt(raw ?? "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const noopRateLimit: RateLimit = async () => ok(undefined);

export const makeRateLimit =
  (deps: RateLimitDeps): RateLimit =>
  async (ip) => {
    const day = today();
    const globalKey = `g:${day}`;
    const ipKey = `ip:${ip}:${day}`;

    const [globalUsed, ipUsed] = await Promise.all([
      count(deps.kv, globalKey),
      count(deps.kv, ipKey),
    ]);

    if (globalUsed >= deps.globalPerDay) {
      return err(
        appError(
          ChatErrorCode.RATE_LIMITED,
          "the assistant is resting for today, try again tomorrow",
        ),
      );
    }
    if (ipUsed >= deps.perIpPerDay) {
      return err(
        appError(
          ChatErrorCode.RATE_LIMITED,
          "you've hit today's message limit, try again tomorrow",
        ),
      );
    }

    await Promise.all([
      deps.kv.put(globalKey, String(globalUsed + 1), {
        expirationTtl: TTL_SECONDS,
      }),
      deps.kv.put(ipKey, String(ipUsed + 1), { expirationTtl: TTL_SECONDS }),
    ]);
    return ok(undefined);
  };
