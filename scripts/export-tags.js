/**
 * Export tagCategories and tags from Firestore to export-tags.json.
 * Always uses project jl-website-29804. Run: node scripts/export-tags.js
 * Output: scripts/export-tags.json
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyDSVkecMzvML4paV6-MpdmVVr7KKIsg_HI",
  authDomain: "jl-website-29804.firebaseapp.com",
  projectId: "jl-website-29804",
  storageBucket: "jl-website-29804.firebasestorage.app",
  messagingSenderId: "855985928515",
  appId: "1:855985928515:web:a570888fb8ded7e0f997f6",
};

async function main() {
  console.log("Exporting from project:", firebaseConfig.projectId);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [catSnap, tagSnap] = await Promise.all([
    getDocs(collection(db, "tagCategories")),
    getDocs(collection(db, "tags")),
  ]);

  const tagCategories = catSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const tags = tagSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const out = { tagCategories, tags };
  const outPath = path.join(__dirname, "export-tags.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log("Wrote", outPath, "| tagCategories:", tagCategories.length, "| tags:", tags.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
