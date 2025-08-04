import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const productId = (await params).id;
    let product: Product | null = null;

    try {
        product = await fetchAPI<Product>(`/products/${productId}`);
    } catch (err) {
        console.error("Error fetching product:", err);
    }

    if (!product) return notFound();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Edit Product
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Update product details and settings
                        </p>
                    </div>
                    <Link href="/admin/products">
                        <Button 
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                {/* Product Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg p-8">
                    <ProductForm productDetails={product} />
                </div>
            </main>
        </div>
    );
}
