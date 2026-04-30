/**
 * Import tagCategories and tags from export-tags.json into Firestore (NEW project).
 * Service account: set FIREBASE_SERVICE_ACCOUNT_KEY in .env, or place JSON file at
 * project root: firebase-service-account.json
 * Run: node scripts/import-tags.js
 * Reads scripts/export-tags.json (or path from first arg).
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { getApps, initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, doc } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

function getServiceAccountKey() {
  const env = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (env) return env;
  const projectRoot = path.resolve(__dirname, "..");
  const paths = [
    path.join(projectRoot, "firebase-service-account.json"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  }
  return null;
}

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const key = getServiceAccountKey();
  if (!key) {
    throw new Error(
      "Service account required. Set FIREBASE_SERVICE_ACCOUNT_KEY in .env or add firebase-service-account.json to project root."
    );
  }
  const credential = JSON.parse(key);
  return initializeApp({ credential: cert(credential) });
}

async function main() {
  const filePath = process.argv[2] || path.join(__dirname, "export-tags.json");
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    console.error("Run export-tags.js first with OLD project env to create export-tags.json");
    process.exit(1);
  }

  const app = getAdminApp();
  const db = getFirestore(app);
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);

  const tagCategories = data.tagCategories || [];
  const tags = data.tags || [];

  const BATCH_SIZE = 500;
  let batch = db.batch();
  let ops = 0;

  for (const item of tagCategories) {
    const { id, ...rest } = item;
    if (!id) continue;
    batch.set(doc(db, "tagCategories", id), rest);
    ops++;
    if (ops >= BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  for (const item of tags) {
    const { id, ...rest } = item;
    if (!id) continue;
    batch.set(doc(db, "tags", id), rest);
    ops++;
    if (ops >= BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();

  console.log("Imported", tagCategories.length, "tagCategories and", tags.length, "tags to project", app.options.projectId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
