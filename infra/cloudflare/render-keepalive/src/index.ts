export interface Env {
  BACKEND_HEALTHZ_URL: string;
}

async function ping(env: Env): Promise<Response> {
  const url = env.BACKEND_HEALTHZ_URL;
  const response = await fetch(url, {
    method: "GET",
    headers: { "User-Agent": "nauterio-render-keepalive/1.0" },
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status !== 204 && response.status !== 200) {
    return new Response(`Unexpected health status ${response.status}`, { status: 502 });
  }
  return new Response("ok", { status: 204 });
}

export default {
  async fetch(_request: Request, env: Env) {
    return ping(env);
  },
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(ping(env).catch((error) => console.error("[render-keepalive] ping failed", error)));
  },
};
