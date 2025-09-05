export type PlanType = "base" | "plus" | "pro" | "ultimate";

export interface Feature {
    imageUrl: string;
    imagePublicId: string;
    title: string;
    description: string;
}

export interface PricingOption {
    label: PlanType;
    price: number;
    discountPercentage?: number;
}

export interface Seo {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
}

export interface Product {
    _id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    coverImage: { url: string; publicId: string };
    deliverables: string[];
    category: string;
    tags: string[];
    features: Feature[];
    pricingOptions: PricingOption[];
    catelogLink: string;
    demoLink: string;
    seo: Seo;
    createdAt: string;
    updatedAt: string;
}

export interface Offer {
    _id: string;
    title: string;
    description: string;
    bannerImage: string;
    active: boolean;
    expiresAt: string;
    products: {
        productId: string;
        offerDiscountPercentage: number;
    }[];
}

export interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    product: { _id: string; title: string; category: string };
    notes: string[];
    adjustmentType: PlanType;
    status: "pending" | "contacted" | "closed";
    createdAt: string;
    updatedAt: string;
}
