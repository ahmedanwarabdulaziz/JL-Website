# Migrate to new Firebase project (jl-website-29804)

## 1. App config (done)

- `.env.example` and `firebase.json` / `.firebaserc` point to **jl-website-29804**.
- Copy the new client config from `.env.example` into your **`.env.local`** (or `.env`).

## 2. Service account (new project)

- Open the service account JSON file (e.g. `jl-website-29804-firebase-adminsdk-....json`).
- Copy its **entire contents** (one line is fine).
- In `.env.local` set:
  ```
  FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"jl-website-29804",...}
  ```
- Or use the path only if your app supports it: some setups use `GOOGLE_APPLICATION_CREDENTIALS=path/to/file.json`; this app expects the JSON content in `FIREBASE_SERVICE_ACCOUNT_KEY`.

## 3. Migrate tags from old project

If you still have the **old** project (jl-website-5d00e) with tag data:

**A. Export from old project**

- In `.env.local` temporarily set the **old** Firebase client config:
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID=jl-website-5d00e`
  - and the other `NEXT_PUBLIC_FIREBASE_*` for the old project.
- Run:
  ```bash
  npm run firestore:export-tags
  ```
- This creates `scripts/export-tags.json` (tagCategories + tags).

**B. Import into new project**

- In `.env.local` set the **new** Firebase client config and **new** `FIREBASE_SERVICE_ACCOUNT_KEY` (new project’s service account JSON).
- Run:
  ```bash
  npm run firestore:import-tags
  ```
- This reads `scripts/export-tags.json` and writes into the new project’s Firestore.

## 4. Deploy Firestore rules

- Log in: `firebase login --reauth`
- Deploy:
  ```bash
  npm run firestore:deploy
  ```

## 5. Admin emails

- In `src/lib/constants.ts`, `ADMIN_EMAILS` controls who can access `/admin`. Add the email(s) for the new account if needed.
- In **Firebase Console** (new project) → Authentication, add the same admin user(s) if you use Email/Password sign-in.

You’re done. The app and deploy now use **jl-website-29804**; images stay on R2 (no change).
