import { OfferProductLink } from "@/types/schemas";
import { Document, Model, Schema, model, models } from "mongoose";

export interface OfferDocument extends Document {
    title: string;
    description: string;
    bannerImage: string;
    active: boolean;
    products: OfferProductLink[];
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OfferProductLinkSchema = new Schema<OfferProductLink>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        offerDiscountPercentage: { type: Number },
    },
    { _id: false }
);

const OfferSchema = new Schema<OfferDocument>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        bannerImage: { type: String, required: true },
        active: { type: Boolean, default: true },
        products: { type: [OfferProductLinkSchema], default: [] },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

export const Offer: Model<OfferDocument> =
    models.Offer || model<OfferDocument>("Offer", OfferSchema);
