/**
 * One-time setup script: Configures CORS on your R2 bucket
 * to allow direct browser uploads via presigned URLs.
 *
 * Usage: node scripts/setup-r2-cors.js
 *
 * This only needs to run ONCE per bucket.
 */

require("dotenv").config();
const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_QUOTATIONS_BUCKET || process.env.R2_BUCKET_NAME || "jlwebsite";
const siteUrl = process.env.SITE_URL || "https://www.jlupholstery.com";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env.local");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function main() {
  console.log(`\n🪣 Configuring CORS on R2 bucket: "${bucketName}"\n`);

  const corsRules = [
    {
      AllowedOrigins: [
        siteUrl,
        siteUrl.replace("https://www.", "https://"), // non-www variant
        "http://localhost:3000", // local development
      ],
      AllowedMethods: ["PUT"],
      AllowedHeaders: ["Content-Type"],
      MaxAgeSeconds: 3600,
    },
  ];

  console.log("CORS rules:", JSON.stringify(corsRules, null, 2));

  try {
    await client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: { CORSRules: corsRules },
      })
    );
    console.log("\n✅ CORS configured successfully!");
    console.log("   Allowed origins:", corsRules[0].AllowedOrigins.join(", "));
    console.log("   Allowed methods:", corsRules[0].AllowedMethods.join(", "));
    console.log("\n   Browser can now upload directly to R2 via presigned URLs.\n");
  } catch (err) {
    console.error("\n❌ Failed to set CORS:", err.message);
    process.exit(1);
  }
}

main();
