"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchAPI } from "@/lib/api";
import {
    PlanType,
    PricingOption as PricingTier,
    Product,
    Feature as ProductFeature,
} from "@/lib/types";
import { CategoryType } from "@/types/schemas";
import {
    ArrowLeft,
    DeleteIcon,
    DollarSign,
    Image as ImageIcon,
    Package,
    Plus,
    Save,
    Settings,
    Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUploader } from "./ImageUploader";

const PRICING_TIERS: PlanType[] = ["base", "plus", "pro", "ultimate"];
const CATEGORIES: CategoryType[] = [
    "ecommerce",
    "portfolio",
    "blog",
    "landing",
    "custom",
];

export interface ProductFormState {
    title: string;
    shortDescription: string;
    longDescription: string;
    coverImage: { url: string; publicId: string };
    deliverables: string[];
    tags: string[];
    category: CategoryType;
    features: ProductFeature[];
    pricingOptions: PricingTier[];
}

const DEFAULT_VALUES: ProductFormState = {
    title: "",
    shortDescription: "",
    longDescription: "",
    category: "custom",
    coverImage: {
        url: "",
        publicId: "",
    },
    deliverables: [],
    features: [
        {
            imageUrl: "",
            imagePublicId: "",
            title: "",
            description: "",
        },
    ],
    pricingOptions: [
        {
            label: "base",
            price: 5000,
            discountPercentage: 0,
        },
    ],
    tags: [],
};

export default function ProductForm({
    productDetails,
}: {
    productDetails?: Product;
}) {
    const router = useRouter();

    let initialValues: ProductFormState | undefined;
    if (
        productDetails &&
        productDetails.features.length > 0 &&
        productDetails.pricingOptions.length > 0
    )
        initialValues = {
            title: productDetails.title,
            shortDescription: productDetails.shortDescription,
            longDescription: productDetails.longDescription,
            coverImage: productDetails.coverImage,
            deliverables: productDetails.deliverables,
            category: productDetails.category as CategoryType,
            features: productDetails.features,
            pricingOptions: productDetails.pricingOptions,
            tags: productDetails.tags,
        };

    const [formData, setFormData] = useState<ProductFormState>(
        initialValues ?? DEFAULT_VALUES
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = <K extends keyof ProductFormState>(
        field: K,
        value: ProductFormState[K]
    ) => setFormData((prev) => ({ ...prev, [field]: value }));

    const updateFeature = (
        index: number,
        field: keyof ProductFeature,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((f, i) =>
                i === index ? { ...f, [field]: value } : f
            ),
        }));
    };

    const updatePricing = (
        index: number,
        field: keyof PricingTier,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            pricingOptions: prev.pricingOptions.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            ),
        }));
    };

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                { imageUrl: "", imagePublicId: "", title: "", description: "" },
            ],
        }));
    };

    const addPricing = () => {
        setFormData((prev) => ({
            ...prev,
            pricingOptions: [
                ...prev.pricingOptions,
                { label: "base", price: 0, discountPercentage: 0 },
            ],
        }));
    };

    const addDeliverable = () => {
        setFormData((prev) => ({
            ...prev,
            deliverables: [...prev.deliverables, ""],
        }));
    };

    const updateDeliverable = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            deliverables: prev.deliverables.map((d, i) =>
                i === index ? value : d
            ),
        }));
    };

    const removeDeliverable = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            deliverables: prev.deliverables.filter((_, i) => i !== index),
        }));
    };

    const removeFeature = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }));
    };

    const removePricing = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            pricingOptions: prev.pricingOptions.filter((_, i) => i !== index),
        }));
    };

    const handleCreate = async (data: ProductFormState) => {
        const response = await fetchAPI("/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
        toast.success("Product created successfully");
        return response;
    };

    const handleUpdate = async (id: string, data: ProductFormState) => {
        const response = await fetchAPI(`/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        toast.success("Product updated successfully");
        return response;
    };

    const handleDeleteCoverImage = async (public_id: string) => {
        await fetchAPI(`/upload`, {
            method: "DELETE",
            body: JSON.stringify({ public_id }),
        });
        toast.success(
            "Cover image removed. Please don't go back without saving the changes."
        );
        setFormData((prev) => ({
            ...prev,
            coverImage: {
                url: "",
                publicId: "",
            },
        }));
    };

    const handleDeleteFeatureImages = async (public_id: string) => {
        await fetchAPI(`/upload`, {
            method: "DELETE",
            body: JSON.stringify({ public_id }),
        });
        toast.success(
            "Feature image deleted successfully. Please don't go back without saving the changes."
        );
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((f) =>
                f.imagePublicId !== public_id
                    ? f
                    : { ...f, imageUrl: "", imagePublicId: "" }
            ),
        }));
    };

    const handleFormSubmit = async () => {
        setError(null);

        const requiredFields: (keyof ProductFormState)[] = [
            "title",
            "shortDescription",
            "longDescription",
            "coverImage",
            "category",
            "features",
            "pricingOptions",
        ];

        for (const field of requiredFields) {
            const value = formData[field];
            if (
                (typeof value === "string" && value.trim() === "") ||
                (Array.isArray(value) && value.length === 0)
            ) {
                setError(`Missing field: ${field}`);
                return;
            }
        }

        try {
            setLoading(true);

            if (!productDetails) await handleCreate(formData);
            else await handleUpdate(productDetails._id, formData);

            router.push("/admin/products");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Submission failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 text-black">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Package className="w-5 h-5" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Product Title
                            </Label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                placeholder="Enter product title"
                                className="border-slate-200 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                                Category
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) =>
                                    handleChange(
                                        "category",
                                        val as CategoryType
                                    )
                                }>
                                <SelectTrigger className="border-slate-200 focus:border-blue-500">
                                    <SelectValue placeholder="Choose category" />
                                </SelectTrigger>
                                <SelectContent className="text-black bg-white/90">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() +
                                                cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                            Short Description
                        </Label>
                        <Input
                            required
                            value={formData.shortDescription}
                            onChange={(e) =>
                                handleChange("shortDescription", e.target.value)
                            }
                            placeholder="Brief description of the product"
                            className="border-slate-200 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                            Long Description
                        </Label>
                        <Textarea
                            value={formData.longDescription}
                            onChange={(e) =>
                                handleChange("longDescription", e.target.value)
                            }
                            placeholder="Detailed description of the product"
                            className="border-slate-200 focus:border-blue-500 min-h-[120px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <ImageIcon className="w-5 h-5" />
                        Cover Image
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Label className="text-sm font-medium text-slate-700">
                            Product Cover Image
                        </Label>
                        <ImageUploader
                            onUpload={(url: string, publicId: string) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    coverImage: {
                                        url: url,
                                        publicId: publicId,
                                    },
                                }));
                            }}
                        />
                        {formData.coverImage.url && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-700 mb-2">
                                    Preview:
                                </p>
                                <div className="relative w-full max-w-xs mx-auto">
                                    <Image
                                        src={formData.coverImage.url}
                                        alt="Cover preview"
                                        width={50}
                                        height={50}
                                        className="w-full h-auto border border-slate-300 rounded-lg shadow-sm"
                                        style={{
                                            maxHeight: "300px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            handleChange("coverImage", {
                                                url: "",
                                                publicId: "",
                                            });
                                            handleDeleteCoverImage(
                                                formData.coverImage.publicId
                                            );
                                        }}>
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-slate-500 mt-2 text-center">
                                    Click the trash icon to remove.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Tag className="w-5 h-5" />
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">
                                Product Tags
                            </Label>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleChange("tags", [...formData.tags, ""])
                                }
                                className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Tag
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.tags.map((tag, i) => (
                                <div key={i} className="flex gap-3">
                                    <Input
                                        required
                                        placeholder={`Tag ${i + 1}`}
                                        value={tag}
                                        onChange={(e) => {
                                            const newTags = [...formData.tags];
                                            newTags[i] = e.target.value;
                                            handleChange("tags", newTags);
                                        }}
                                        className="flex-1 border-slate-200 focus:border-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newTags =
                                                formData.tags.filter(
                                                    (_, index) => index !== i
                                                );
                                            handleChange("tags", newTags);
                                        }}
                                        className="border-red-200 text-red-600 hover:bg-red-50">
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Settings className="w-5 h-5" />
                        Deliverables
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">
                                What&apos;s Included
                            </Label>
                            <Button
                                variant="outline"
                                onClick={addDeliverable}
                                className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Deliverable
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.deliverables.map((deliverable, i) => (
                                <div key={i} className="flex gap-3">
                                    <Input
                                        required
                                        placeholder={`Deliverable ${i + 1}`}
                                        value={deliverable}
                                        onChange={(e) =>
                                            updateDeliverable(i, e.target.value)
                                        }
                                        className="flex-1 border-slate-200 focus:border-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeDeliverable(i)}
                                        className="border-red-200 text-red-600 hover:bg-red-50">
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Options */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <DollarSign className="w-5 h-5" />
                        Pricing Options
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">
                                Pricing Tiers
                            </Label>
                            <Button
                                variant="outline"
                                onClick={addPricing}
                                className="border-green-200 text-green-600 hover:bg-green-50">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Pricing Tier
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {formData.pricingOptions.map((tier, i) => (
                                <div
                                    key={i}
                                    className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <Select
                                            value={tier.label}
                                            onValueChange={(val) =>
                                                updatePricing(i, "label", val)
                                            }>
                                            <SelectTrigger className="border-slate-200">
                                                <SelectValue placeholder="Tier" />
                                            </SelectTrigger>
                                            <SelectContent className="text-black bg-white/90">
                                                {PRICING_TIERS.map((t) => (
                                                    <SelectItem
                                                        key={t}
                                                        value={t}>
                                                        {t
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            t.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            required
                                            type="number"
                                            placeholder="Price (₹)"
                                            value={tier.price}
                                            onChange={(e) =>
                                                updatePricing(
                                                    i,
                                                    "price",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                        <Input
                                            required
                                            type="number"
                                            placeholder="Discount %"
                                            value={tier.discountPercentage}
                                            onChange={(e) =>
                                                updatePricing(
                                                    i,
                                                    "discountPercentage",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removePricing(i)}
                                            className="border-red-200 text-red-600 hover:bg-red-50">
                                            <DeleteIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-0 shadow-lg pt-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg px-5 py-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                        <Settings className="w-5 h-5" />
                        Features
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">
                                Product Features
                            </Label>
                            <Button
                                variant="outline"
                                onClick={addFeature}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Feature
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {formData.features.map((feat, i) => (
                                <div
                                    key={i}
                                    className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                                        <Input
                                            required
                                            placeholder="Feature Title"
                                            value={feat.title}
                                            onChange={(e) =>
                                                updateFeature(
                                                    i,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                        <div className="lg:col-span-2">
                                            <ImageUploader
                                                onUpload={(
                                                    url: string,
                                                    publicId: string
                                                ) => {
                                                    updateFeature(
                                                        i,
                                                        "imageUrl",
                                                        url
                                                    );
                                                    updateFeature(
                                                        i,
                                                        "imagePublicId",
                                                        publicId
                                                    );
                                                }}
                                            />
                                        </div>
                                        <Input
                                            required
                                            placeholder="Feature Description"
                                            value={feat.description}
                                            onChange={(e) =>
                                                updateFeature(
                                                    i,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="border-slate-200 focus:border-blue-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFeature(i)}
                                            className="border-red-200 text-red-600 hover:bg-red-50">
                                            <DeleteIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {feat.imageUrl && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-slate-700 mb-2">
                                                Image Preview:
                                            </p>
                                            <div className="relative w-full max-w-xs mx-auto">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={feat.imageUrl}
                                                    alt="Feature preview"
                                                    className="w-full h-auto border border-slate-300 rounded-lg shadow-sm"
                                                    style={{
                                                        maxHeight: "200px",
                                                        objectFit: "contain",
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        updateFeature(
                                                            i,
                                                            "imageUrl",
                                                            ""
                                                        );
                                                        updateFeature(
                                                            i,
                                                            "imagePublicId",
                                                            ""
                                                        );
                                                        handleDeleteFeatureImages(
                                                            feat.imagePublicId
                                                        );
                                                    }}>
                                                    <DeleteIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    disabled={loading}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 px-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>

                <Button
                    onClick={handleFormSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-8">
                    <Save className="w-4 h-4 mr-2" />
                    {loading
                        ? "Submitting..."
                        : productDetails
                        ? "Update Product"
                        : "Create Product"}
                </Button>
            </div>
        </div>
    );
}
