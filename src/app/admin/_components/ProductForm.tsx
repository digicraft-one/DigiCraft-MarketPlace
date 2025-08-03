"use client";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import {
    PlanType,
    PricingOption as PricingTier,
    Product,
    Feature as ProductFeature,
} from "@/lib/types";
import { CategoryType } from "@/types/schemas";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import { Delete, DeleteIcon } from "lucide-react";
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
    coverImage: string;
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
    coverImage: "",
    deliverables: [],
    features: [
        {
            imageUrl: "",
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

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = <K extends keyof ProductFormState>(
        field: K,
        value: ProductFormState[K]
    ) => setFormData((prev) => ({ ...prev, [field]: value }));

    const updateFeature = (
        index: number,
        field: keyof ProductFeature,
        value: string
    ) => {
        const updated = [...formData.features];
        updated[index] = { ...updated[index], [field]: value };
        handleChange("features", updated);
    };

    const updatePricing = (
        index: number,
        field: keyof PricingTier,
        value: string | number
    ) => {
        const updated = [...formData.pricingOptions];
        updated[index] = { ...updated[index], [field]: value };
        handleChange("pricingOptions", updated);
    };

    const addFeature = () => {
        handleChange("features", [
            ...formData.features,
            { imageUrl: "", title: "", description: "" },
        ]);
    };

    const addPricing = () => {
        handleChange("pricingOptions", [
            ...formData.pricingOptions,
            { label: "base", price: 0, discountPercentage: 0 },
        ]);
    };

    const addDeliverable = () => {
        handleChange("deliverables", [...formData.deliverables, ""]);
    };
    const updateDeliverable = (index: number, value: string) => {
        const updated = [...formData.deliverables];
        updated[index] = value;
        handleChange("deliverables", updated);
    };
    const removeDeliverable = (index: number) => {
        const updated = formData.deliverables.filter((_, i) => i !== index);
        handleChange("deliverables", updated);
    };
    const removeFeature = (index: number) => {
        const updated = formData.features.filter((_, i) => i !== index);
        handleChange("features", updated);
    };
    const removePricing = (index: number) => {
        const updated = formData.pricingOptions.filter((_, i) => i !== index);
        handleChange("pricingOptions", updated);
    };
    const handleCreate = async (data: ProductFormState) => {
        await fetchAPI("/products", {
            method: "POST",
            body: JSON.stringify(data),
        });
    };

    const handleUpdate = async (id: string, data: ProductFormState) => {
        await fetchAPI<Product>(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    };

    const handleFormSubmit = async () => {
        const requiredFields: (keyof ProductFormState)[] = [
            "title",
            "shortDescription",
            "longDescription",
            "coverImage",
            "tags",
            "deliverables",
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
        <div className="grid grid-cols-2 gap-5 *:space-y-2">
            <div>
                <Label>Title</Label>
                <Input
                    required
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                />
            </div>
            <div>
                <Label>Short Description</Label>
                <Input
                    required
                    value={formData.shortDescription}
                    onChange={(e) =>
                        handleChange("shortDescription", e.target.value)
                    }
                />
            </div>
            <div className="col-start-1 col-end-3">
                <Label>Long Description</Label>
                <Textarea
                    value={formData.longDescription}
                    onChange={(e) =>
                        handleChange("longDescription", e.target.value)
                    }
                />
            </div>

            <div>
                <Label>Category</Label>
                <Select
                    value={formData.category}
                    onValueChange={(val) =>
                        handleChange("category", val as CategoryType)
                    }>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 ">
                <div className="flex justify-between items-center">
                    <Label>Tags</Label>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            handleChange("tags", [...formData.tags, ""])
                        }
                        className="w-35">
                        Add Tag
                    </Button>
                </div>
                {formData.tags.map((tag, i) => (
                    <div key={i} className="flex gap-2">
                        <Input
                            required
                            placeholder={`Tag ${i + 1}`}
                            value={tag}
                            onChange={(e) => {
                                const updated = [...formData.tags];
                                updated[i] = e.target.value;
                                handleChange("tags", updated);
                            }}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const updated = formData.tags.filter(
                                    (_, index) => index !== i
                                );
                                handleChange("tags", updated);
                            }}
                            className="text-red-500 hover:text-red-700">
                            <DeleteIcon />
                        </Button>
                    </div>
                ))}
            </div>

            <div>
                <Label>Cover Image</Label>
                <div className="flex gap-2">
                    <ImageUploader
                        onUpload={(url: string) =>
                            handleChange("coverImage", url)
                        }
                    />
                    <Input
                        required
                        disabled
                        hidden={formData.coverImage === ""}
                        placeholder="Enter image URL"
                        value={formData.coverImage}
                        onChange={(e) =>
                            handleChange("coverImage", e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="col-span-2">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Deliverables</Label>
                        <Button
                            variant="secondary"
                            onClick={addDeliverable}
                            className="w-35">
                            Add Deliverable
                        </Button>
                    </div>

                    {formData.deliverables?.map((item, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                required
                                placeholder={`Deliverable ${i + 1}`}
                                value={item}
                                onChange={(e) =>
                                    updateDeliverable(i, e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDeliverable(i)}
                                className="text-red-500 hover:text-red-700">
                                <DeleteIcon />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2 col-span-2">
                <div className="flex justify-between items-center">
                    <Label>Pricing Options</Label>
                    <Button
                        variant="secondary"
                        onClick={addPricing}
                        className="w-35">
                        Add Tier
                    </Button>
                </div>
                {formData.pricingOptions?.map((tier, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-3 gap-2 items-center">
                        <Select
                            value={tier.label}
                            onValueChange={(val) =>
                                updatePricing(
                                    i,
                                    "label",
                                    val as PricingTier["label"]
                                )
                            }>
                            <SelectTrigger>
                                <SelectValue placeholder="Tier" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRICING_TIERS.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            required
                            type="number"
                            placeholder="Price"
                            value={tier.price}
                            onChange={(e) =>
                                updatePricing(
                                    i,
                                    "price",
                                    Number(e.target.value)
                                )
                            }
                        />
                        <div className="flex gap-2">
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
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePricing(i)}
                                className="text-red-500 hover:text-red-700">
                                <DeleteIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-2 col-start-1 col-end-3">
                <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button
                        variant="secondary"
                        onClick={addFeature}
                        className="w-35">
                        Add Feature
                    </Button>
                </div>
                {formData.features.map((feat, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-5 gap-2 items-center">
                        <Input
                            required
                            placeholder="Title"
                            value={feat.title}
                            onChange={(e) =>
                                updateFeature(i, "title", e.target.value)
                            }
                        />
                        <ImageUploader
                            onUpload={(url: string) =>
                                updateFeature(i, "imageUrl", url)
                            }
                        />
                        <Input
                            required
                            placeholder="Description"
                            value={feat.description}
                            onChange={(e) =>
                                updateFeature(i, "description", e.target.value)
                            }
                            className="col-span-2"
                        />
                        <div className="flex gap-1">
                            <Input
                                hidden={feat.imageUrl === ""}
                                disabled
                                required
                                placeholder="Image URL"
                                value={feat.imageUrl}
                                onChange={(e) =>
                                    updateFeature(i, "imageUrl", e.target.value)
                                }
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(i)}
                                className="text-red-500 hover:text-red-700">
                                <DeleteIcon />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 col-span-2">{error}</p>}

            <div className="flex col-span-2 items-center gap-4 justify-center">
                <Button
                    onClick={() => router.back()}
                    variant="default"
                    disabled={loading}
                    className="w-30 m-0">
                    Go Back
                </Button>

                <Button
                    onClick={handleFormSubmit}
                    disabled={loading}
                    className="w-30">
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    );
}
