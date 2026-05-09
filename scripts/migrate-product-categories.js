#!/usr/bin/env node

/**
 * One-time migration:
 * - Backfills Product.categories[] from legacy Product.category (string).
 * - Creates missing Category documents as needed.
 *
 * Usage:
 *   node scripts/migrate-product-categories.js          (dry run)
 *   node scripts/migrate-product-categories.js --apply  (write changes)
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const loadLocalEnv = () => {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
};

loadLocalEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

const shouldApply = process.argv.includes("--apply");

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

async function run() {
  await mongoose.connect(MONGODB_URI, { maxPoolSize: 10 });
  const db = mongoose.connection.db;

  const productsCol = db.collection("products");
  const categoriesCol = db.collection("categories");

  const products = await productsCol
    .find(
      {},
      { projection: { _id: 1, title: 1, category: 1, categories: 1, updatedAt: 1 } }
    )
    .toArray();

  let skipped = 0;
  let migrated = 0;
  let missingLegacyCategory = 0;
  let createdCategories = 0;

  for (const product of products) {
    if (Array.isArray(product.categories) && product.categories.length > 0) {
      skipped += 1;
      continue;
    }

    const legacyCategory = String(product.category || "").trim();
    if (!legacyCategory) {
      missingLegacyCategory += 1;
      continue;
    }

    const slug = slugify(legacyCategory);
    if (!slug) {
      missingLegacyCategory += 1;
      continue;
    }

    let categoryDoc = await categoriesCol.findOne({
      $or: [{ slug }, { name: legacyCategory }],
    });

    if (!categoryDoc) {
      const now = new Date();
      const newCategory = {
        name: legacyCategory,
        slug,
        createdAt: now,
        updatedAt: now,
      };

      if (shouldApply) {
        const inserted = await categoriesCol.insertOne(newCategory);
        categoryDoc = { _id: inserted.insertedId, ...newCategory };
      } else {
        categoryDoc = { _id: new mongoose.Types.ObjectId(), ...newCategory };
      }
      createdCategories += 1;
    }

    if (shouldApply) {
      await productsCol.updateOne(
        { _id: product._id },
        {
          $set: {
            categories: [categoryDoc._id],
            category: categoryDoc.name,
            updatedAt: new Date(),
          },
        }
      );
    }
    migrated += 1;
  }

  console.log("");
  console.log(`Mode: ${shouldApply ? "APPLY" : "DRY RUN"}`);
  console.log(`Total products scanned: ${products.length}`);
  console.log(`Skipped (already migrated): ${skipped}`);
  console.log(`Migrated candidates: ${migrated}`);
  console.log(`Missing/invalid legacy category: ${missingLegacyCategory}`);
  console.log(`Categories created: ${createdCategories}`);
  console.log("");

  if (!shouldApply) {
    console.log("No DB writes were made. Re-run with --apply to execute.");
  } else {
    console.log("Migration applied successfully.");
  }
}

run()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
