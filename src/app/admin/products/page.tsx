"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    Package,
    Calendar,
    Tag,
} from "lucide-react";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const prod = await fetchAPI<Product[]>("/products");
                setProducts(prod);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const product = await fetchAPI<Product>(`/products/${id}`);

            const imagesToDelete = [
                product.coverImage.publicId,
                ...product.features?.map((feature) => feature.imagePublicId),
            ].filter(Boolean);

            for (const imageId of imagesToDelete) console.log(imageId);

            for (const public_id of imagesToDelete)
                await fetchAPI(`/upload`, {
                    method: "DELETE",
                    body: JSON.stringify({ public_id }),
                });

            await fetchAPI(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted successfully");
            setProducts((prev) => prev && prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Could not delete product");
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-48" />
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-40" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card
                                key={i}
                                className="rounded-xl border-0 shadow-lg overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-16" />
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <Card className="rounded-xl border-red-200 bg-red-50 p-8 max-w-md">
                    <div className="text-center space-y-4">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 w-fit mx-auto">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-900">
                            Error Loading Products
                        </h3>
                        <p className="text-red-600">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline">
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Products Management
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Manage your marketplace products and listings
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => router.push("/admin")}
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:bg-slate-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        <Link href="/admin/products/new">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Product
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                {products && products.length === 0 ? (
                    <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                            <div className="p-4 rounded-full bg-slate-100 w-fit mx-auto mb-4">
                                <Package className="w-12 h-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No Products Found
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Get started by creating your first product
                                listing
                            </p>
                            <Link href="/admin/products/new">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Product
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <Card
                                key={product._id}
                                className="group overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                                <div className="relative">
                                    <Image
                                        src={product.coverImage.url}
                                        alt={product.title}
                                        height={200}
                                        width={400}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <div className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-slate-700">
                                            {product.category}
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {product.shortDescription}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDistanceToNow(
                                                new Date(product.createdAt),
                                                { addSuffix: true }
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {product.pricingOptions.length}{" "}
                                            plans
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Link
                                            href={`/admin/products/${product._id}`}
                                            className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/products/${product.seo.slug}`}
                                            className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-slate-200 text-slate-600 hover:bg-slate-50">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-xl bg-slate-200">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-slate-900">
                                                        Delete Product
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-slate-600">
                                                        Are you sure you want to
                                                        delete &quot;
                                                        {product.title}&quot;?
                                                        This action cannot be
                                                        undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-slate-800 ">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700">
                                                        Delete Product
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
