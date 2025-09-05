import { Types } from "mongoose";

export type CategoryType =
    | "ecommerce"
    | "portfolio"
    | "blog"
    | "landing"
    | "custom";

export type Plans = "base" | "plus" | "pro" | "ultimate";

export interface PricingTier {
    label: Plans;
    price: number;
    discountPercentage?: number;
}

export interface ProductFeature {
    imageUrl: string;
    imagePublicId: string;
    title: string;
    description: string;
}

export interface Seo {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
}

export interface OfferProductLink {
    productId: Types.ObjectId;
    offerDiscountPercentage?: number;
}
