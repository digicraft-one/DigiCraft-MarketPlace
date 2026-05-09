import { Document, Model, model, models, Schema } from "mongoose";

export interface CategoryDocument extends Document {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const Category: Model<CategoryDocument> =
    models.Category || model<CategoryDocument>("Category", CategorySchema);
