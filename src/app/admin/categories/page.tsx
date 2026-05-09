"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAPI } from "@/lib/api";
import {
    ArrowLeft,
    Copy,
    ExternalLink,
    Pencil,
    Shapes,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
    slug: string;
    productCount?: number;
}

function CategoriesPageInner() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("category");

    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");

    const selected = useMemo(
        () => categories.find((c) => c._id === selectedId),
        [categories, selectedId]
    );

    const loadCategories = useCallback(async () => {
        try {
            const response = await fetchAPI<Category[]>(
                "/categories?counts=true"
            );
            setCategories(response);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories");
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    useEffect(() => {
        if (selected) {
            setEditName(selected.name);
            setEditSlug(selected.slug);
        } else {
            setEditName("");
            setEditSlug("");
        }
    }, [selected]);

    const setCategoryQuery = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!id) params.delete("category");
        else params.set("category", id);
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };

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
            toast.error(
                error instanceof Error ? error.message : "Create failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedId) return;
        if (!editName.trim()) {
            toast.error("Name is required");
            return;
        }
        setLoading(true);
        try {
            await fetchAPI(`/categories/${selectedId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: editName.trim(),
                    slug: editSlug.trim() || undefined,
                }),
            });
            toast.success("Category updated");
            await loadCategories();
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error(
                error instanceof Error ? error.message : "Update failed"
            );
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
            if (selectedId === id) setCategoryQuery(null);
            setCategories((prev) => prev.filter((c) => c._id !== id));
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

    const storefrontHref =
        typeof window !== "undefined" && selected
            ? `${window.location.origin}/products?q=${encodeURIComponent(selected.slug)}`
            : "";

    const copyShareUrl = async () => {
        if (!storefrontHref) return;
        try {
            await navigator.clipboard.writeText(storefrontHref);
            toast.success("Share link copied");
        } catch {
            toast.error("Could not copy");
        }
    };

    const baseOrigin =
        typeof window !== "undefined" ? window.location.origin : "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                            Category Management
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Create categories, edit names and slugs, share
                            storefront filters
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-600 hover:bg-slate-50">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/products">
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-600 hover:bg-slate-50">
                                Products
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-xl border-0 shadow-lg bg-white/95 backdrop-blur-sm text-neutral-950">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-neutral-950">
                                    <Shapes className="w-5 h-5 text-indigo-600" />
                                    Add category
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Category name"
                                    className="border-slate-300 bg-white font-medium text-neutral-950 placeholder:text-slate-500"
                                />
                                <Button
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                                    Create
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-slate-900">
                                    All categories
                                </CardTitle>
                                <p className="text-sm text-slate-500 font-normal">
                                    Click a row to edit. Product count includes
                                    every product that uses the category.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categories.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        No categories found.
                                    </p>
                                ) : (
                                    categories.map((category) => {
                                        const isActive =
                                            selectedId === category._id;
                                        return (
                                            <div
                                                key={category._id}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        e.preventDefault();
                                                        setCategoryQuery(
                                                            category._id
                                                        );
                                                    }
                                                }}
                                                onClick={() =>
                                                    setCategoryQuery(
                                                        category._id
                                                    )
                                                }
                                                className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-all cursor-pointer ${
                                                    isActive
                                                        ? "border-indigo-400 bg-indigo-50/80 shadow-sm"
                                                        : "border-slate-200 hover:border-slate-300 bg-white"
                                                }`}>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">
                                                        {category.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {category.slug}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs font-semibold tabular-nums px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                                                        {category.productCount ??
                                                            0}
                                                    </span>
                                                    <Pencil className="w-4 h-4 text-slate-400" />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="rounded-xl border-0 shadow-lg bg-white/95 backdrop-blur-sm min-h-[320px] text-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-neutral-950">
                                    {selected
                                        ? "Edit category"
                                        : "Select a category"}
                                </CardTitle>
                                {!selected && (
                                    <p className="text-sm text-slate-500 font-normal">
                                        Choose a category from the list to
                                        change its name, slug, or copy a
                                        shareable marketplace link.
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6 text-neutral-950">
                                {selected ? (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={copyShareUrl}
                                                className="border-slate-300 bg-white text-neutral-950 hover:bg-slate-100 hover:text-neutral-950 [&_svg]:text-neutral-800">
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy storefront link
                                            </Button>
                                            <Link
                                                href={`/products?q=${encodeURIComponent(selected.slug)}`}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-300 bg-white text-neutral-950 hover:bg-slate-100 hover:text-neutral-950 [&_svg]:text-neutral-800">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open marketplace
                                                </Button>
                                            </Link>
                                        </div>
                                        {baseOrigin && (
                                            <p className="text-xs text-slate-500 break-all">
                                                {baseOrigin}
                                                /products?q=
                                                {encodeURIComponent(
                                                    selected.slug
                                                )}
                                            </p>
                                        )}
                                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-1">
                                            <p className="text-sm text-slate-600">
                                                Products in this category
                                            </p>
                                            <p className="text-3xl font-bold text-slate-900 tabular-nums">
                                                {selected.productCount ?? 0}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="edit-name"
                                                className="text-neutral-950">
                                                Name
                                            </Label>
                                            <Input
                                                id="edit-name"
                                                value={editName}
                                                onChange={(e) =>
                                                    setEditName(e.target.value)
                                                }
                                                className="border-slate-300 bg-white font-medium text-neutral-950 placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="edit-slug"
                                                className="text-neutral-950">
                                                URL slug
                                            </Label>
                                            <Input
                                                id="edit-slug"
                                                value={editSlug}
                                                onChange={(e) =>
                                                    setEditSlug(e.target.value)
                                                }
                                                className="border-slate-300 bg-white font-mono text-sm font-medium text-neutral-950 placeholder:text-slate-500"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Used in share links: /products?q=
                                                your-slug
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <Button
                                                onClick={handleSaveEdit}
                                                disabled={loading}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
                                                Save changes
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCategoryQuery(null)
                                                }
                                                className="border-slate-300 bg-white text-neutral-950 hover:bg-slate-100 hover:text-neutral-950">
                                                Close
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={loading}
                                                onClick={() =>
                                                    handleDelete(selected._id)
                                                }
                                                className="ml-auto border-red-300 bg-white text-red-700 hover:bg-red-50 hover:text-red-800 [&_svg]:text-red-600">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </>
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function CategoriesPageFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <p className="text-slate-600 text-sm">Loading categories…</p>
        </div>
    );
}

export default function AdminCategoriesPage() {
    return (
        <Suspense fallback={<CategoriesPageFallback />}>
            <CategoriesPageInner />
        </Suspense>
    );
}
