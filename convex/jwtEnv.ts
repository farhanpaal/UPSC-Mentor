/**
 * Convex env vars are often pasted from dashboards / JSON / shells. jose requires
 * JWT_PRIVATE_KEY to be a PKCS#8 PEM whose first character is part of
 * "-----BEGIN PRIVATE KEY-----". This normalizes common corruption.
 */
export function normalizeJwtPrivateKeyEnv(): void {
  const v = process.env.JWT_PRIVATE_KEY;
  if (v === undefined || typeof v !== "string") {
    return;
  }

  let pem = v;

  // UTF-8 BOM
  if (pem.charCodeAt(0) === 0xfeff) {
    pem = pem.slice(1);
  }

  pem = pem.trim();

  // Wrapped in quotes from a bad copy-paste
  if (
    (pem.startsWith('"') && pem.endsWith('"')) ||
    (pem.startsWith("'") && pem.endsWith("'"))
  ) {
    pem = pem.slice(1, -1).trim();
  }

  // Stored as JSON string with escaped newlines (literal backslash-n)
  if (pem.includes("\\n") && !pem.includes("\n")) {
    pem = pem.replace(/\\n/g, "\n");
  }

  // Junk before the PEM header (extra text, newlines, or variable name)
  const begin = pem.indexOf("-----BEGIN PRIVATE KEY-----");
  if (begin === -1) {
    return;
  }
  if (begin > 0) {
    pem = pem.slice(begin);
  }

  const end = pem.indexOf("-----END PRIVATE KEY-----");
  if (end !== -1) {
    pem = pem.slice(0, end + "-----END PRIVATE KEY-----".length);
  }

  pem = pem.replace(/\r\n/g, "\n").trim();

  // Single-line PEM (spaces between base64 chunks) — re-wrap to 64-char lines
  if (!pem.includes("\n") && pem.includes("-----BEGIN PRIVATE KEY-----")) {
    pem = reflowPkcs8Pem(pem);
  }

  process.env.JWT_PRIVATE_KEY = pem;
}

function reflowPkcs8Pem(singleLine: string): string {
  const start = "-----BEGIN PRIVATE KEY-----";
  const end = "-----END PRIVATE KEY-----";
  const i0 = singleLine.indexOf(start);
  const i1 = singleLine.indexOf(end);
  if (i0 === -1 || i1 === -1 || i1 <= i0) {
    return singleLine;
  }
  const inner = singleLine.slice(i0 + start.length, i1).trim();
  const b64 = inner.replace(/\s+/g, "");
  if (!b64) {
    return singleLine;
  }
  const lines = b64.match(/.{1,64}/g) ?? [b64];
  return `${start}\n${lines.join("\n")}\n${end}`;
}

export function normalizeJwksEnv(): void {
  const v = process.env.JWKS;
  if (v === undefined || typeof v !== "string") {
    return;
  }

  let j = v.trim();
  if (j.charCodeAt(0) === 0xfeff) {
    j = j.slice(1);
  }
  if (
    (j.startsWith('"') && j.endsWith('"')) ||
    (j.startsWith("'") && j.endsWith("'"))
  ) {
    j = j.slice(1, -1).trim();
  }
  if (j.includes("\\n") && !j.includes("\n")) {
    j = j.replace(/\\n/g, "\n");
  }

  process.env.JWKS = j;
}
