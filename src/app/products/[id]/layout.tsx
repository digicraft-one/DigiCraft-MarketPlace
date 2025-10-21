import { Metadata } from "next";
import { connectToDB } from "@/lib/db/mongoose";
import { Product } from "@/schemas/Product";

interface Props {
    params: { id: string };
    children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        await connectToDB();
        const resolvedParams = await params;
        const product = await Product.findOne({ "seo.slug": resolvedParams.id });
        
        if (!product) {
            return {
                title: "Product Not Found",
            };
        }

        const seo = product.seo;
        
        return {
            title: seo.title || "",
            description: seo.description || "",
            keywords: seo.keywords?.join(", ") || "",
        };
    } catch (error) {
        return {
            title: "Product",
        };
    }
}

export default function ProductLayout({ children }: Props) {
    return <>{children}</>;
}
