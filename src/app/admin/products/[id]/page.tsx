import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";

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
        <main className="h-full w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8 my-12 py-6">
            <div>
                <h2 className="text-2xl font-bold">Edit Product</h2>
            </div>
            <ProductForm productDetails={product} />
        </main>
    );
}
