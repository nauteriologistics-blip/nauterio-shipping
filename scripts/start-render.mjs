import { spawn } from "node:child_process";

const services = [
  ["api", "apps/api/dist/main.js"],
  ["worker", "apps/worker/dist/main.js"],
];

const children = new Map();
let shuttingDown = false;

function stop(signal, exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children.values()) {
    if (!child.killed) child.kill(signal);
  }

  const forceExit = setTimeout(() => {
    for (const child of children.values()) {
      if (!child.killed) child.kill("SIGKILL");
    }
    process.exit(exitCode);
  }, 10_000);
  forceExit.unref();

  Promise.all(
    [...children.values()].map(
      (child) =>
        new Promise((resolve) => {
          if (child.exitCode !== null || child.signalCode !== null) resolve();
          else child.once("exit", resolve);
        })
    )
  ).then(() => process.exit(exitCode));
}

for (const [name, entrypoint] of services) {
  const child = spawn(process.execPath, [entrypoint], {
    env: process.env,
    stdio: "inherit",
  });
  children.set(name, child);

  child.once("error", (error) => {
    console.error(`[render-supervisor] ${name} failed to start`, error);
    stop("SIGTERM", 1);
  });

  child.once("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(
      `[render-supervisor] ${name} exited unexpectedly (${signal ? `signal ${signal}` : `code ${code ?? 1}`})`
    );
    stop("SIGTERM", code && code > 0 ? code : 1);
  });
}

process.on("SIGTERM", () => stop("SIGTERM", 0));
process.on("SIGINT", () => stop("SIGINT", 0));

console.log("[render-supervisor] API and worker processes started");
