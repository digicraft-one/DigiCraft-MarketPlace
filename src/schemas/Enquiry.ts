import type { Plans } from "@/types/schemas";
import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface EnquiryDocument extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    product: Types.ObjectId;
    adjustmentType: Plans;
    notes: string[];
    status: "pending" | "contacted" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const EnquirySchema = new Schema<EnquiryDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        message: { type: String, required: true },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        adjustmentType: {
            type: String,
            enum: ["base", "plus", "pro", "ultimate"],
            required: true,
        },
        notes: [{ type: String, default: "" }],
        status: {
            type: String,
            enum: ["pending", "contacted", "closed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Enquiry: Model<EnquiryDocument> =
    models.Enquiry || model<EnquiryDocument>("Enquiry", EnquirySchema);
