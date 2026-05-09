import type { MetadataRoute } from "next";
import { connectToDB } from "@/lib/db/mongoose";
import { Product } from "@/schemas/Product";

const siteUrl = "https://marketplace.digicraft.one";

// Rebuild sitemap periodically without requiring redeploys.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${siteUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/offers`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        }
    ];

    try {
        await connectToDB();

        const products = (await Product.find({
            "seo.slug": { $exists: true, $ne: "" },
        })
            .select({ "seo.slug": 1, updatedAt: 1, _id: 0 })
            .lean()) as Array<{ seo?: { slug?: string }; updatedAt?: Date }>;

        const productPages: MetadataRoute.Sitemap = products
            .filter((product) => product.seo?.slug)
            .map((product) => ({
                url: `${siteUrl}/products/${product.seo!.slug}`,
                lastModified: product.updatedAt ?? new Date(),
                changeFrequency: "weekly",
                priority: 0.9,
            }));

        return [...staticPages, ...productPages];
    } catch (error) {
        console.error("Failed to build dynamic sitemap:", error);
        return staticPages;
    }
}
