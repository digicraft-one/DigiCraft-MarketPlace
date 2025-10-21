#!/usr/bin/env node

/**
 * Script to update sitemap.xml with new products
 * Usage: node scripts/update-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const SITE_URL = 'https://marketplace.digicraft.one';

// Function to generate sitemap entry for a product
function generateProductEntry(slug, lastmod = new Date().toISOString()) {
  return `  <url>
    <loc>${SITE_URL}/products/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
}

// Function to add a new product to sitemap
function addProductToSitemap(productSlug) {
  try {
    // Read current sitemap
    let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    
    // Check if product already exists
    if (sitemapContent.includes(`/products/${productSlug}`)) {
      console.log(`✅ Product "${productSlug}" already exists in sitemap`);
      return;
    }
    
    // Find the position to insert (before the closing </urlset>)
    const insertPosition = sitemapContent.lastIndexOf('</urlset>');
    
    if (insertPosition === -1) {
      throw new Error('Could not find closing </urlset> tag');
    }
    
    // Generate new product entry
    const newProductEntry = generateProductEntry(productSlug);
    
    // Insert the new product entry
    const updatedSitemap = 
      sitemapContent.slice(0, insertPosition) + 
      newProductEntry + '\n\n' + 
      sitemapContent.slice(insertPosition);
    
    // Write updated sitemap
    fs.writeFileSync(SITEMAP_PATH, updatedSitemap, 'utf8');
    
    console.log(`✅ Successfully added product "${productSlug}" to sitemap`);
    
  } catch (error) {
    console.error('❌ Error updating sitemap:', error.message);
    process.exit(1);
  }
}

// Function to remove a product from sitemap
function removeProductFromSitemap(productSlug) {
  try {
    // Read current sitemap
    let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    
    // Create regex to match the entire product entry
    const productRegex = new RegExp(
      `  <url>\\s*<loc>${SITE_URL}/products/${productSlug}</loc>\\s*<lastmod>[^<]*</lastmod>\\s*<changefreq>weekly</changefreq>\\s*<priority>0\\.9</priority>\\s*</url>\\s*`,
      'g'
    );
    
    // Remove the product entry
    const updatedSitemap = sitemapContent.replace(productRegex, '');
    
    // Write updated sitemap
    fs.writeFileSync(SITEMAP_PATH, updatedSitemap, 'utf8');
    
    console.log(`✅ Successfully removed product "${productSlug}" from sitemap`);
    
  } catch (error) {
    console.error('❌ Error updating sitemap:', error.message);
    process.exit(1);
  }
}

// Function to list all products in sitemap
function listProductsInSitemap() {
  try {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const productRegex = /<loc>https:\/\/marketplace\.digicraft\.one\/products\/([^<]+)<\/loc>/g;
    
    const products = [];
    let match;
    
    while ((match = productRegex.exec(sitemapContent)) !== null) {
      products.push(match[1]);
    }
    
    console.log('📋 Products currently in sitemap:');
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product}`);
    });
    
    return products;
    
  } catch (error) {
    console.error('❌ Error reading sitemap:', error.message);
    process.exit(1);
  }
}

// Main execution
const command = process.argv[2];
const productSlug = process.argv[3];

switch (command) {
  case 'add':
    if (!productSlug) {
      console.error('❌ Please provide a product slug: node scripts/update-sitemap.js add <product-slug>');
      process.exit(1);
    }
    addProductToSitemap(productSlug);
    break;
    
  case 'remove':
    if (!productSlug) {
      console.error('❌ Please provide a product slug: node scripts/update-sitemap.js remove <product-slug>');
      process.exit(1);
    }
    removeProductFromSitemap(productSlug);
    break;
    
  case 'list':
    listProductsInSitemap();
    break;
    
  default:
    console.log(`
🔧 Sitemap Management Script

Usage:
  node scripts/update-sitemap.js <command> [product-slug]

Commands:
  add <slug>     Add a new product to sitemap
  remove <slug>  Remove a product from sitemap
  list           List all products in sitemap

Examples:
  node scripts/update-sitemap.js add new-product-slug
  node scripts/update-sitemap.js remove old-product-slug
  node scripts/update-sitemap.js list
    `);
    break;
}
