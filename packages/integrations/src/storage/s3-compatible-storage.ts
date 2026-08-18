import { createHash, createHmac } from "node:crypto";

export interface S3CompatibleConfig { endpoint: string; region: string; bucket: string; accessKeyId: string; secretAccessKey: string }

export class S3CompatibleStorage {
  constructor(private readonly config: S3CompatibleConfig) {}

  presign(method: "GET" | "PUT" | "HEAD", key: string, expiresSeconds = 300): string {
    const now = new Date();
    const date = amzDate(now);
    const day = date.slice(0, 8);
    const endpoint = new URL(this.config.endpoint);
    const path = `/${encodeURIComponent(this.config.bucket)}/${key.split("/").map(encodeURIComponent).join("/")}`;
    const scope = `${day}/${this.config.region}/s3/aws4_request`;
    const query = new URLSearchParams({ "X-Amz-Algorithm": "AWS4-HMAC-SHA256", "X-Amz-Credential": `${this.config.accessKeyId}/${scope}`, "X-Amz-Date": date, "X-Amz-Expires": String(expiresSeconds), "X-Amz-SignedHeaders": "host" });
    query.sort();
    const canonical = [method, path, query.toString(), `host:${endpoint.host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
    const stringToSign = ["AWS4-HMAC-SHA256", date, scope, sha256(canonical)].join("\n");
    query.set("X-Amz-Signature", signature(this.config.secretAccessKey, day, this.config.region, stringToSign));
    return `${endpoint.origin}${path}?${query.toString()}`;
  }

  async head(key: string): Promise<{ size: number; contentType: string }> {
    const response = await fetch(this.presign("HEAD", key, 60), { method: "HEAD" });
    if (!response.ok) throw new Error(`Object verification failed (${response.status})`);
    const size = Number(response.headers.get("content-length"));
    if (!Number.isSafeInteger(size) || size < 1) throw new Error("Object has invalid content length");
    return { size, contentType: response.headers.get("content-type") ?? "application/octet-stream" };
  }
}

function sha256(value: string): string { return createHash("sha256").update(value).digest("hex"); }
function hmac(key: Buffer | string, value: string): Buffer { return createHmac("sha256", key).update(value).digest(); }
function signature(secret: string, day: string, region: string, value: string): string { const dateKey = hmac(`AWS4${secret}`, day); const regionKey = hmac(dateKey, region); const serviceKey = hmac(regionKey, "s3"); return createHmac("sha256", hmac(serviceKey, "aws4_request")).update(value).digest("hex"); }
function amzDate(date: Date): string { return date.toISOString().replace(/[:-]|\.\d{3}/g, ""); }
