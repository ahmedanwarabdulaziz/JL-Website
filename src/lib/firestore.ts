import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES = "tagCategories";
const TAGS = "tags";
const PIECES = "upholsteryPieces";
const QUOTATION_REQUESTS = "quotationRequests";

export type TagCategoryType = "mandatory" | "optional";
export type TagCategorySelection = "single" | "multiple";

export interface TagCategory {
  id: string;
  name: string;
  type: TagCategoryType;
  selection: TagCategorySelection;
  order: number;
}

export interface Tag {
  id: string;
  categoryId: string;
  label: string;
}

export interface UpholsteryPiece {
  id: string;
  title: string;
  slug: string;
  metaDescription?: string;
  storageKey: string;
  publicUrl: string;
  tagIds: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy?: string;
}

export type QuotationRequestStatus = "new" | "replied" | "closed";

export interface QuotationRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  fileName?: string;
  /** Single image/file URL (R2) for display. */
  fileUrl?: string;
  /** Multiple image URLs when form supports more than one file. */
  fileUrls?: string[];
  status: QuotationRequestStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

function fromDoc<T extends { id: string }>(docSnap: { id: string; data: () => DocumentData }): T {
  return { id: docSnap.id, ...docSnap.data() } as T;
}

export async function getTagCategories(): Promise<TagCategory[]> {
  const q = query(
    collection(db, CATEGORIES),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<TagCategory>(d));
}

export async function getTags(): Promise<Tag[]> {
  const snap = await getDocs(collection(db, TAGS));
  return snap.docs.map((d) => fromDoc<Tag>(d));
}

export async function getTagsByCategoryId(categoryId: string): Promise<Tag[]> {
  const q = query(
    collection(db, TAGS),
    where("categoryId", "==", categoryId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<Tag>(d));
}

export async function createTagCategory(data: Omit<TagCategory, "id">): Promise<string> {
  const ref = await addDoc(collection(db, CATEGORIES), data);
  return ref.id;
}

export async function updateTagCategory(id: string, data: Partial<Omit<TagCategory, "id">>): Promise<void> {
  await setDoc(doc(db, CATEGORIES, id), data, { merge: true });
}

export async function createTag(data: Omit<Tag, "id">): Promise<string> {
  const ref = await addDoc(collection(db, TAGS), data);
  return ref.id;
}

export async function updateTag(id: string, data: Partial<Omit<Tag, "id">>): Promise<void> {
  await setDoc(doc(db, TAGS, id), data, { merge: true });
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(
    collection(db, PIECES),
    where("slug", "==", slug)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    if (d.id !== excludeId) return true;
  }
  return false;
}

export async function createUpholsteryPiece(
  data: Omit<UpholsteryPiece, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, PIECES), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUpholsteryPieces(): Promise<UpholsteryPiece[]> {
  const q = query(
    collection(db, PIECES),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<UpholsteryPiece>(d));
}

export async function getUpholsteryPieceBySlug(slug: string): Promise<UpholsteryPiece | null> {
  const q = query(
    collection(db, PIECES),
    where("slug", "==", slug)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return fromDoc<UpholsteryPiece>(first);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function getQuotationRequests(): Promise<QuotationRequest[]> {
  const q = query(
    collection(db, QUOTATION_REQUESTS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<QuotationRequest>(d));
}

export async function updateQuotationRequest(
  id: string,
  data: Partial<Pick<QuotationRequest, "status">>
): Promise<void> {
  await setDoc(
    doc(db, QUOTATION_REQUESTS, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
