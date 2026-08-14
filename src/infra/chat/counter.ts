import type { CountHit } from "@/core/chat/ports";
import type { KvStore } from "@/infra/chat/rateLimit";

const today = (): string => new Date().toISOString().slice(0, 10);

const bump = async (kv: KvStore, key: string): Promise<void> => {
  const current = Number.parseInt((await kv.get(key)) ?? "0", 10);
  await kv.put(key, String((Number.isNaN(current) ? 0 : current) + 1));
};

export const noopCount: CountHit = async () => undefined;

export const makeCounter =
  (kv: KvStore): CountHit =>
  async () => {
    try {
      await Promise.all([
        bump(kv, "stats:chat:total"),
        bump(kv, `stats:chat:${today()}`),
      ]);
    } catch {}
  };
