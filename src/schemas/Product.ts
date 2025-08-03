import type {
    CategoryType,
    PricingTier,
    ProductFeature,
} from "@/types/schemas";
import { Document, Model, model, models, Schema } from "mongoose";

export interface ProductDocument extends Document {
    title: string;
    shortDescription: string;
    longDescription: string;
    coverImage: string;
    deliverables: string[];
    category: CategoryType;
    features: ProductFeature[];
    pricingOptions: PricingTier[];
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const PricingTierSchema = new Schema<PricingTier>(
    {
        label: {
            type: String,
            enum: ["base", "plus", "pro", "ultimate"],
            required: true,
        },
        price: { type: Number, required: true },
        discountPercentage: { type: Number, default: 0 },
    },
    { _id: false }
);

const FeatureSchema = new Schema<ProductFeature>(
    {
        imageUrl: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false }
);

const ProductSchema = new Schema<ProductDocument>(
    {
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        longDescription: { type: String, required: true },
        coverImage: { type: String, required: true },
        deliverables: { type: [String], required: true },
        category: {
            type: String,
            enum: ["ecommerce", "portfolio", "blog", "landing", "custom"],
            required: true,
        },
        tags: [{ type: String }],
        features: [FeatureSchema],
        pricingOptions: [PricingTierSchema],
    },
    { timestamps: true }
);

export const Product: Model<ProductDocument> =
    models.Product || model<ProductDocument>("Product", ProductSchema);
