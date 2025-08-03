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
            await fetchAPI(`/products/${id}`, { method: "DELETE" });
            toast.success("Product deleted");
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
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );

    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <main className="h-screen w-screen space-y-6 px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Products</h2>
                <div className="flex gap-2">
                    <Button onClick={() => router.push("/admin")}>
                        Go Back
                    </Button>
                    <Link href="/admin/products/new">
                        <Button>Create New Product</Button>
                    </Link>
                </div>
            </div>

            {products && products.length === 0 ? (
                <div className="text-muted-foreground">No products found.</div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {products?.map((product) => (
                        <Card key={product._id} className="p-2">
                            <CardContent className="px-4 py-2 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex justify-center items-center gap-6 ">
                                        <Image
                                            src={product.coverImage}
                                            alt="sample product image"
                                            height={150}
                                            width={150}
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {product.category} •{" "}
                                                {product.pricingOptions
                                                    ?.map((p) => `₹${p.price}`)
                                                    .join(" / ")}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Created{" "}
                                                {product.createdAt &&
                                                    formatDistanceToNow(
                                                        new Date(
                                                            product.createdAt
                                                        ),
                                                        { addSuffix: true }
                                                    )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/products/${product._id}`}>
                                            <Button size="sm" variant="outline">
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently
                                                        delete the product and
                                                        all related data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        disabled={loading}>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700 text-primary"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
                                                            )
                                                        }
                                                        disabled={loading}>
                                                        {loading
                                                            ? "Deleting..."
                                                            : "Yes, delete"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}
