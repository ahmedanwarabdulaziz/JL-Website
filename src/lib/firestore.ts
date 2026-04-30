import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
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
const PROJECTS = "projects";
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
  /** Up to 5 images showcasing this tag (e.g. for Styles). */
  featuredImages?: StoredImage[];
}

export interface UpholsteryPiece {
  id: string;
  title: string;
  slug: string;
  metaDescription?: string;
  storageKey: string;
  publicUrl: string;
  /** Optional thumbnail URL for gallery listing (smaller, faster load). */
  thumbnailUrl?: string;
  tagIds: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy?: string;
}

export interface StoredImage {
  storageKey: string;
  publicUrl: string;
  thumbnailUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  metaDescription?: string;
  primaryImage: StoredImage;
  /** When primary was chosen from a piece, its id (so we don't delete that key from R2). */
  primaryImageFromPieceId?: string;
  /** Ordered list of piece ids included in the project. */
  pieceIds: string[];
  beforeImages?: StoredImage[];
  afterImages?: StoredImage[];
  /** Tags apply to the whole project (primary + all before/after images as one). */
  tagIds: string[];
  /** R2 storage keys uploaded for this project (primary when uploaded, before/after). Deleted on project delete. */
  uploadedStorageKeys?: string[];
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

export async function toggleTagFeaturedImage(
  tagId: string,
  image: StoredImage,
  isFeatured: boolean
): Promise<void> {
  const tagRef = doc(db, TAGS, tagId);
  const tagSnap = await getDoc(tagRef);
  
  if (!tagSnap.exists()) {
    throw new Error("Tag not found");
  }
  
  const tagData = tagSnap.data() as Omit<Tag, "id">;
  let currentImages = tagData.featuredImages || [];
  
  if (isFeatured) {
    if (currentImages.length >= 5) {
      throw new Error("Maximum 5 featured images allowed per tag.");
    }
    // Prevent duplicates
    if (!currentImages.some(img => img.storageKey === image.storageKey)) {
      currentImages.push(image);
    }
  } else {
    currentImages = currentImages.filter(img => img.storageKey !== image.storageKey);
  }
  
  await updateTag(tagId, { featuredImages: currentImages });
}

export async function deleteTag(id: string): Promise<void> {
  await deleteDoc(doc(db, TAGS, id));
}

export async function deleteTagCategory(id: string): Promise<void> {
  const catTags = await getTagsByCategoryId(id);
  for (const t of catTags) await deleteDoc(doc(db, TAGS, t.id));
  await deleteDoc(doc(db, CATEGORIES, id));
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

export async function projectSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const q = query(
    collection(db, PROJECTS),
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
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Omit<UpholsteryPiece, "id" | "createdAt" | "updatedAt">;
  const ref = await addDoc(collection(db, PIECES), {
    ...clean,
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

export async function getUpholsteryPieceById(id: string): Promise<UpholsteryPiece | null> {
  const snap = await getDoc(doc(db, PIECES, id));
  if (!snap.exists()) return null;
  return fromDoc<UpholsteryPiece>({ id: snap.id, data: () => snap.data() });
}

export async function updateUpholsteryPiece(
  id: string,
  data: Partial<Omit<UpholsteryPiece, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Partial<Omit<UpholsteryPiece, "id" | "createdAt" | "updatedAt">>;
  await setDoc(doc(db, PIECES, id), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteUpholsteryPiece(id: string): Promise<void> {
  await deleteDoc(doc(db, PIECES, id));
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

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Omit<Project, "id" | "createdAt" | "updatedAt">;
  const ref = await addDoc(collection(db, PROJECTS), {
    ...clean,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProjects(): Promise<Project[]> {
  const q = query(
    collection(db, PROJECTS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<Project>(d));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, PROJECTS, id));
  if (!snap.exists()) return null;
  return fromDoc<Project>({ id: snap.id, data: () => snap.data() });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const q = query(
    collection(db, PROJECTS),
    where("slug", "==", slug)
  );
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return fromDoc<Project>(first);
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>;
  await setDoc(doc(db, PROJECTS, id), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, PROJECTS, id));
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

export async function getQuotationRequestById(id: string): Promise<QuotationRequest | null> {
  const snap = await getDoc(doc(db, QUOTATION_REQUESTS, id));
  if (!snap.exists()) return null;
  return fromDoc<QuotationRequest>({ id: snap.id, data: () => snap.data() });
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

export async function deleteQuotationRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, QUOTATION_REQUESTS, id));
}
