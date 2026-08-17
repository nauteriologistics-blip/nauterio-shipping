import { createClient } from "redis";

let client: ReturnType<typeof createClient> | undefined;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      console.error("Redis client error", err);
    });

    await client.connect();
  }
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.disconnect();
    client = undefined;
  }
}
