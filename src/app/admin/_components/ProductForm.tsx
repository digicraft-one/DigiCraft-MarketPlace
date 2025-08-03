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

const PRICING_TIERS: PlanType[] = ["base", "plus", "pro", "infinite"];
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
    category: CategoryType;
    features: ProductFeature[];
    pricingOptions: PricingTier[];
}

const DEFAULT_VALUES: ProductFormState = {
    title: "",
    shortDescription: "",
    longDescription: "",
    category: "custom",
    features: [
        {
            imageUrl: "",
            description: "",
        },
    ],
    pricingOptions: [],
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
            category: productDetails.category as CategoryType,
            features: productDetails.features,
            pricingOptions: productDetails.pricingOptions,
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
            { imageUrl: "", description: "" },
        ]);
    };

    const addPricing = () => {
        handleChange("pricingOptions", [
            ...formData.pricingOptions,
            { label: "base", price: 0, discountPercentage: 0 },
        ]);
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
        <div className="grid gap-5 *:space-y-2">
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

            <div>
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

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button variant="secondary" onClick={addFeature}>
                        Add Feature
                    </Button>
                </div>
                {formData.features.map((feat, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
                        <ImageUploader
                            onUpload={(url: string) =>
                                updateFeature(i, "imageUrl", url)
                            }
                        />
                        <Input
                            required
                            placeholder="Image URL"
                            value={feat.imageUrl}
                            onChange={(e) =>
                                updateFeature(i, "imageUrl", e.target.value)
                            }
                        />
                        <Input
                            required
                            placeholder="Description"
                            value={feat.description}
                            onChange={(e) =>
                                updateFeature(i, "description", e.target.value)
                            }
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Pricing Options</Label>
                    <Button variant="secondary" onClick={addPricing}>
                        Add Tier
                    </Button>
                </div>
                {formData.pricingOptions.map((tier, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2">
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
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button onClick={handleFormSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </div>
    );
}
