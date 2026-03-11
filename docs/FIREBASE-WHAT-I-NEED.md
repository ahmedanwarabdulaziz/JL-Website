# What I need to run everything for the new Firebase (jl-website-29804)

The app and scripts are already pointed at **jl-website-29804**. To run the rest (import tags, deploy rules) from here, I need the following from you.

---

## 1. Service account JSON file (required for import + server APIs)

**What:** The contents of your **new** project’s service account key.

**You have:**  
`d:\Downloads\FA\Menu\Desert\EID\Downloads\jl-website-29804-firebase-adminsdk-fbsvc-a43d3b9de2.json`

**What to do:**  
Copy that file into your **project root** and name it:

- **`firebase-service-account.json`**

So the path is: **`d:\Res\JL-Website\firebase-service-account.json`**

(It’s in `.gitignore`, so it won’t be committed.)

**Why:**  
Then I can run the tag import script and the app can use the Admin SDK (quotations, etc.) without you pasting anything into `.env`.

---

## 2. Tag data to import (only if you’re migrating from the old project)

**If you still have tags in the OLD project (jl-website-5d00e):**

- Put the **old** Firebase client config in `.env.local` (or a separate `.env.old`), then run:
  ```bash
  npm run firestore:export-tags
  ```
- That creates **`scripts/export-tags.json`**. Leave that file there so I can run the import.

**If you don’t have old data (or you’re fine with empty tags):**  
Nothing. I’ll run the import anyway; it will just write 0 categories and 0 tags if the file is missing or empty.

---

## 3. Firebase CLI login (only for deploying rules)

**What:** One-time login so `firebase deploy` can run.

**What to do:** In a terminal, run:

```bash
firebase login --reauth
```

Complete the browser login. After that, I (or you) can run:

```bash
npm run firestore:deploy
```

to deploy Firestore rules. I can’t do the browser step for you.

---

## Summary

| What                         | You do                                                                 | I can do after that                          |
|-----------------------------|------------------------------------------------------------------------|----------------------------------------------|
| Service account             | Copy the JSON file → `d:\Res\JL-Website\firebase-service-account.json` | Run tag import; app uses Admin SDK          |
| Tag data from old project   | Run `npm run firestore:export-tags` with old .env (once)              | Run `npm run firestore:import-tags`         |
| Firestore rules deploy      | Run `firebase login --reauth` once                                    | Run `npm run firestore:deploy`               |

**Minimum for “full control” from my side:**  
1) Put **`firebase-service-account.json`** in the project root.  
2) (Optional) Run **`npm run firestore:export-tags`** with old config if you want tags migrated.  
3) Run **`firebase login --reauth`** once so deploy works.

I don’t need your Google password or a second Firebase project; the service account file and one-time CLI login are enough.
