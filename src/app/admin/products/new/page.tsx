import ProductForm from "../../_components/ProductForm";

export default async function CreateProductPage() {
    return (
        <main className="h-full w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8 my-12 py-6">
            <h2 className="text-2xl font-bold">Create Product</h2>
            <ProductForm />
        </main>
    );
}
