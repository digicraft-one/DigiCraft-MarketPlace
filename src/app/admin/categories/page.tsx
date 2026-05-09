"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchAPI } from "@/lib/api";
import { ArrowLeft, Shapes, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const loadCategories = async () => {
        try {
            const response = await fetchAPI<Category[]>("/categories");
            setCategories(response);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }
        setLoading(true);
        try {
            await fetchAPI("/categories", {
                method: "POST",
                body: JSON.stringify({ name }),
            });
            toast.success("Category created");
            setName("");
            await loadCategories();
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error(error instanceof Error ? error.message : "Create failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await fetchAPI(`/categories/${id}`, {
                method: "DELETE",
            });
            toast.success("Category deleted");
            setCategories((prev) => prev.filter((category) => category._id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete category"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Category Management
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Create and manage marketplace categories
                        </p>
                    </div>
                    <Link href="/admin/products">
                        <Button
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:bg-slate-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>

                <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                            <Shapes className="w-5 h-5" />
                            Add Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                            className="border-slate-200"
                        />
                        <Button
                            onClick={handleCreate}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            Create
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-900">
                            Existing Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {categories.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No categories found.
                            </p>
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {category.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            slug: {category.slug}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={loading}
                                        onClick={() => handleDelete(category._id)}
                                        className="border-red-200 text-red-600 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
