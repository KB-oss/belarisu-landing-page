import crypto from "crypto";

type CybersourceEnv = "apitest" | "api";

function getCybersourceHost(): string {
  const env = (process.env.CYBERSOURCE_ENV || "apitest") as CybersourceEnv;
  return env === "api" ? "api.cybersource.com" : "apitest.cybersource.com";
}

function getMerchantId(): string {
  const value = process.env.CYBERSOURCE_MERCHANT_ID;
  if (!value) throw new Error("Missing CYBERSOURCE_MERCHANT_ID");
  return value;
}

function getKeyId(): string {
  const value = process.env.CYBERSOURCE_KEY_ID;
  if (!value) throw new Error("Missing CYBERSOURCE_KEY_ID");
  return value;
}

function getSharedSecretKey(): Buffer {
  const value = process.env.CYBERSOURCE_SHARED_SECRET;
  if (!value) throw new Error("Missing CYBERSOURCE_SHARED_SECRET");

  const secret = value.trim();

  const looksBase64 = /^[A-Za-z0-9+/=]+$/.test(secret) && secret.length % 4 === 0;
  return looksBase64 ? Buffer.from(secret, "base64") : Buffer.from(secret, "utf8");
}

function buildDigest(body: string): string {
  const sha256 = crypto.createHash("sha256").update(body, "utf8").digest("base64");
  return `SHA-256=${sha256}`;
}

function buildSignatureBase(
  method: string,
  path: string,
  date: string,
  host: string,
  merchantId: string,
  digest?: string
): string {
  const parts = [
    `host: ${host}`,
    `date: ${date}`,
    `(request-target): ${method.toLowerCase()} ${path}`,
  ];

  if (digest) {
    parts.push(`digest: ${digest}`);
  }

  parts.push(`v-c-merchant-id: ${merchantId}`);

  return parts.join("\n");
}

export async function cybersourceRequest<TResponse>(
  path: string,
  method: "POST" | "GET",
  body?: unknown
): Promise<TResponse> {
  const host = getCybersourceHost();
  const merchantId = getMerchantId();
  const keyId = getKeyId();
  const date = new Date().toUTCString();
  const jsonBody = body === undefined ? "" : JSON.stringify(body);
  const digest = body === undefined ? undefined : buildDigest(jsonBody);

  const signatureBase = buildSignatureBase(method, path, date, host, merchantId, digest);
  const signature = crypto
    .createHmac("sha256", getSharedSecretKey())
    .update(signatureBase, "utf8")
    .digest("base64");

  const headers: Record<string, string> = {
    Accept: "application/json",
    Host: host,
    Date: date,
    "v-c-date": date,
    "v-c-merchant-id": merchantId,
    Signature: `keyid="${keyId}",algorithm="HmacSHA256",headers="${digest ? "host date (request-target) digest v-c-merchant-id" : "host date (request-target) v-c-merchant-id"}",signature="${signature}"`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    headers["Digest"] = digest!;
  }

  const response = await fetch(`https://${host}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : jsonBody,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Cybersource request failed (${response.status}): ${text || response.statusText}`
    );
  }

  if (!text) {
    return {} as TResponse;
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return text as TResponse;
  }
}

export function extractCaptureContextToken(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    const candidates = [
      record.captureContext,
      record.jwt,
      record.token,
      record.value,
      record.session,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.length > 20) {
        return candidate;
      }
    }
  }

  throw new Error("Could not extract capture context token from Cybersource response");
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return { firstName: "Donor", lastName: "Donation" };
  }

  const parts = trimmed.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || "Donation";

  return { firstName, lastName };
}