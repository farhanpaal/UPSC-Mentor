import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/**
 * Writes a real PKCS#8 PEM (with newlines). Convex Auth + jose require the string
 * to start with "-----BEGIN PRIVATE KEY-----" with no leading space or BOM.
 * Do NOT paste a version where newlines were replaced by spaces.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const secretsDir = join(root, "secrets");

const keys = await generateKeyPair("RS256", {
  extractable: true,
});

const privateKeyPem = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

await mkdir(secretsDir, { recursive: true });
await writeFile(join(secretsDir, "convex-jwt-private.pem"), privateKeyPem, "utf8");
await writeFile(join(secretsDir, "convex-jwks.json"), jwks, "utf8");

process.stdout.write("\nWrote:\n");
process.stdout.write(`  ${join("secrets", "convex-jwt-private.pem")}\n`);
process.stdout.write(`  ${join("secrets", "convex-jwks.json")}\n\n`);
process.stdout.write(
  "Set Convex env vars from the project root. Use --from-file (required for PEM: lines start with \"-----\" and would otherwise be parsed as CLI flags):\n\n",
);
process.stdout.write("  npx convex env set JWT_PRIVATE_KEY --from-file secrets/convex-jwt-private.pem\n");
process.stdout.write("  npx convex env set JWKS --from-file secrets/convex-jwks.json\n\n");
process.stdout.write(
  "Re-run the same commands to overwrite. Or paste the PEM in the Convex dashboard.\n\n",
);
