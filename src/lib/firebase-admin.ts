import { getApps, getApp, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, type Firestore } from "firebase-admin/firestore";

const QUOTATION_REQUESTS = "quotationRequests";

export interface QuotationRequestData {
  name: string;
  phone: string;
  email: string;
  description: string;
  fileName?: string;
  fileUrl?: string;
  fileUrls?: string[];
  status: "new" | "replied" | "closed";
}

let adminApp: ReturnType<typeof getApp> | null = null;

function getServiceAccountKey(): string | null {
  const env = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (env) return env;
  if (typeof require !== "undefined") {
    try {
      const path = require("path");
      const fs = require("fs");
      const root = path.resolve(process.cwd());
      const p = path.join(root, "firebase-service-account.json");
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
    } catch {
      // ignore
    }
  }
  return null;
}

function getAdminApp(): ReturnType<typeof getApp> {
  if (getApps().length > 0) {
    return getApp();
  }
  const key = getServiceAccountKey();
  if (!key) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is required for server-side Firestore (e.g. saving quotation requests).");
  }
  let credential: { projectId?: string; clientEmail?: string; privateKey?: string };
  try {
    credential = JSON.parse(key) as { projectId?: string; clientEmail?: string; privateKey?: string };
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON (paste the contents of your service account JSON file).");
  }
  adminApp = initializeApp({ credential: cert(credential) });
  return adminApp;
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}

/** Returns Admin Firestore when FIREBASE_SERVICE_ACCOUNT_KEY is set; otherwise null. Use when admin is optional (e.g. quotation upload can fall back to client data). */
export function getAdminFirestoreIfAvailable(): Firestore | null {
  if (getServiceAccountKey()) {
    try {
      return getAdminFirestore();
    } catch {
      return null;
    }
  }
  return null;
}

export async function createQuotationRequest(data: QuotationRequestData): Promise<string> {
  const db = getAdminFirestore();
  const ref = await db.collection(QUOTATION_REQUESTS).add({
    ...data,
    status: data.status ?? "new",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getAdminQuotationRequestById(id: string): Promise<QuotationRequestData | null> {
  const db = getAdminFirestore();
  const snap = await db.collection(QUOTATION_REQUESTS).doc(id).get();
  if (!snap.exists) return null;
  return snap.data() as QuotationRequestData;
}

export async function deleteAdminQuotationRequest(id: string): Promise<void> {
  const db = getAdminFirestore();
  await db.collection(QUOTATION_REQUESTS).doc(id).delete();
}
