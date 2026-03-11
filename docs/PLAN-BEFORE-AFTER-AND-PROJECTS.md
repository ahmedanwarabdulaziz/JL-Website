# Plan: Before/After Images & Projects

## Goal
- **Pieces:** Add optional “before” and “after” images to each piece (multiple per side) to showcase transformations.
- **Projects:** New “Projects” that group multiple pieces, with a primary image and optional before/after, to showcase full jobs.

Use both on the website to present the business in a professional way.

---

## 1. Data model

### 1.1 Shared image reference
Reuse the same shape for main, before, and after images (R2 keys + URLs):

```ts
interface StoredImage {
  storageKey: string;
  publicUrl: string;
  thumbnailUrl?: string;
}
```

### 1.2 Extend UpholsteryPiece (pieces)
Add optional arrays; keep existing fields as the “main” image.

| Field           | Type            | Description |
|----------------|-----------------|-------------|
| `beforeImages` | `StoredImage[]` | Before photos (order = display order). |
| `afterImages`  | `StoredImage[]` | After photos (order = display order). |

- No “tag” needed for “before/after”: the presence of `beforeImages.length > 0 || afterImages.length > 0` defines it. Optionally add a tag category “Feature” with tag “Before & After” and auto-add it when they add before/after, so the public gallery can filter “Before & After” pieces.

### 1.3 New collection: `projects`
One document per project (showcase job).

| Field            | Type            | Description |
|------------------|-----------------|-------------|
| `id`             | string          | Firestore id. |
| `title`          | string          | Project name. |
| `slug`           | string          | URL slug, e.g. `/projects/office-reupholstery`. |
| `metaDescription`| string (opt)    | SEO. |
| `primaryImage`   | `StoredImage`   | Main image (card/detail hero). |
| `pieceIds`       | `string[]`      | Ordered list of upholstery piece ids in this project. |
| `beforeImages`   | `StoredImage[]` | Optional before photos for the project. |
| `afterImages`    | `StoredImage[]` | Optional after photos. |
| `tagIds`         | `string[]`      | **Tags apply to the whole project** (see below). |
| `createdAt`      | Timestamp       | |
| `updatedAt`     | Timestamp       | |

**Tags apply to the whole project (all images as one):**  
Tags on a project are set **once at project level**. They apply to the entire project — i.e. to the primary image and all before/after images together, as a single entity. There is no per-image tagging for projects: the primary image, all before images, and all after images are treated as one unit for filtering and display. When a user filters by tag (e.g. "Office"), the project appears if its `tagIds` match; the same tags describe the whole set of images.

- **Primary image:** Either upload a dedicated image or pick the main image of one of the linked pieces (stored as `StoredImage` so it’s self-contained).
- **Before/After:** Project-level before/after is independent of piece-level; you can show “whole room before” and “whole room after” plus individual piece before/after on piece pages.

---

## 2. Admin UX

### 2.1 Piece: Before/After (create + edit)
- In **Add piece** and **Edit piece**:
  - After the main image (and title/slug/meta/tags), add a section **“Before & After”**.
  - Toggle or checkbox: **“Add before/after images”**.
  - When enabled:
    - **Before:** “Before images” with multi-file upload (or “Add image” repeatedly). Each upload goes to R2 (same pipeline as main image, optional thumb), appended to `beforeImages`. Show thumbnails with remove/reorder.
    - **After:** Same for “After images”.
  - Validation: if enabled, at least one before or one after (or both). Optional: require both.
  - Save: persist `beforeImages` and `afterImages` on the piece. Optionally ensure a “Before & After” tag exists and add it to `tagIds` when either array has length > 0.

### 2.2 Projects: New section in admin
- **Menu:** Add “Projects” next to “Gallery” and “Tags” in admin.
- **List page** `/admin/projects`:
  - List projects (card with primary image, title, slug, piece count). Actions: Edit, Delete.
  - Button: “Add project”.
- **Add/Edit project** `/admin/projects/new` and `/admin/projects/[id]`:
  - **Title**, **slug**, **meta description** (same pattern as piece).
  - **Primary image:** Upload one image OR “Choose from piece” (dropdown/modal of existing pieces, then use that piece’s main image as `primaryImage`).
  - **Pieces in this project:** Multi-select from existing pieces (ordered list). Optional: drag to reorder. Shows piece thumbnail + title.
  - **Before images** / **After images:** Same multi-upload UX as on the piece (optional).
  - **Tags:** Set at project level; they apply to the whole project (primary + all before + all after images as one). Reuse existing tag chips; no per-image tags.
  - Save creates/updates the project doc; slug unique per project.

### 2.3 Upload pipeline
- Reuse existing `/api/upload` (returns `storageKey`, `publicUrl`, `thumbnailUrl`).
- For “before” and “after” images you can use the same endpoint; store results in the appropriate array. Optionally use a prefix like `uploads/before/{id}.webp` and `uploads/after/{id}.webp` if you want to separate in R2.

---

## 3. Public website

### 3.1 Gallery (pieces)
- Keep current “filter by tags” and “show all” behaviour.
- Optional: add a filter or section “Before & After” that shows only pieces with `beforeImages.length > 0 || afterImages.length > 0`.
- Card: main image + title; small badge “Before & After” if applicable.

### 3.2 Piece detail page (e.g. `/gallery/[slug]` or `/upholstery/[slug]`)
- Hero: main image.
- If the piece has before/after:
  - Section “Before & After” with a professional UI:
    - Option A: Slider (before ↔ after) for one pair; if multiple, tabs or “1 of 3” with prev/next.
    - Option B: Two columns “Before” / “After” with small galleries (thumbnails, click to enlarge).
    - Option C: Single row of before images and single row of after images with lightbox.  
  Recommend starting with **Option B** (two columns, multiple images per side) for “more than one image in after or before”.
- Rest: title, description, tags, CTA (e.g. “Get a quote”).

### 3.3 Projects section
- **Route:** e.g. `/projects` (list) and `/projects/[slug]` (detail).
- **List:** Grid of project cards (primary image, title, short line of meta). Filter by tags: a project appears when its project-level `tagIds` match (one tag set for the whole project).
- **Detail:**
  - Hero with primary image.
  - Optional before/after block (same pattern as piece: two columns or slider).
  - “Pieces in this project”: grid of piece thumbnails (from `pieceIds`), each linking to the piece detail page.
  - Show project tags (they describe the whole set of images — primary, before, and after — as one).
  - CTA.

This gives you a clear “we did this full project” story and deep “we transformed this piece” story.

---

## 4. Implementation order

1. **Data & API**
   - Extend `UpholsteryPiece` with `beforeImages`, `afterImages` in Firestore types and `createUpholsteryPiece` / `updateUpholsteryPiece` (and any validation in Firestore rules).
   - Add `projects` collection, types, and CRUD: `createProject`, `updateProject`, `deleteProject`, `getProjects`, `getProjectBySlug`, `getProjectById`.

2. **Piece before/after (admin)**
   - On new/edit piece: “Before & After” section, multi-upload for before and after, save/load arrays. Optional “Before & After” tag.

3. **Projects (admin)**
   - Projects list page; add/edit project page with primary image, pieceIds picker, before/after uploads, tags.

4. **Public: piece detail**
   - Piece detail page by slug; show main image and before/after section when data exists.

5. **Public: gallery**
   - Wire gallery to real pieces; optional “Before & After” filter; link cards to piece detail.

6. **Public: projects**
   - `/projects` and `/projects/[slug]` with primary image, before/after, and list of pieces.

---

## 5. Optional enhancements
- **Ordering:** Store `order` or array order for pieces inside a project; for before/after, array order = display order.
- **Captions:** Add optional `caption` to each item in `beforeImages` / `afterImages` for accessibility and storytelling.
- **R2 cleanup:** On piece/project delete, remove R2 objects for `beforeImages`/`afterImages` (and primary image if uploaded only for project) to avoid orphaned files.

This plan keeps the same R2 and tag system you have, extends pieces in a minimal way, and introduces projects as a first-class showcase for “many pictures with primary and before/after” while staying consistent and professional for the site.
