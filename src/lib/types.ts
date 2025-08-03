export type PlanType = "base" | "plus" | "pro" | "infinite";

export interface Feature {
    imageUrl: string;
    description: string;
}

export interface PricingOption {
    label: PlanType;
    price: number;
    discountPercentage?: number;
}

export interface Product {
    _id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    features: Feature[];
    pricingOptions: PricingOption[];
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
    product: {
        _id: string;
        title: string;
        category: string;
    };
    adjustmentType: PlanType;
    status: "pending" | "contacted" | "closed";
    createdAt: string;
    updatedAt: string;
}
