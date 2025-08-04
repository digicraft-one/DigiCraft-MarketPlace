import ProductForm from "../../_components/ProductForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateProductPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Create New Product
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Add a new product to your marketplace
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
                    <ProductForm />
                </div>
            </main>
        </div>
    );
}
