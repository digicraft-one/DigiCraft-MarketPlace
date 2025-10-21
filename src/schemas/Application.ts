import { ApplicationRoles, ExperienceLevel } from "@/types/schemas";
import { Document, Model, Schema, model, models } from "mongoose";

export interface ApplicationDocument extends Document {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: ApplicationRoles;
    experience: ExperienceLevel;
    primarySkills: string;
    secondarySkills: string;
    github: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    canJoin: string;
    coverLetter: string;

    notes: string[];
    status: "pending" | "selected" | "declined";
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<ApplicationDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        role: {
            type: String,
            enum: [
                "fullstack",
                "frontend",
                "backend",
                "app",
                "ai-ml",
                "devops",
            ],
            required: true,
        },
        experience: {
            type: String,
            enum: ["junior", "mid", "senior", "lead"],
            required: true,
        },
        primarySkills: { type: String, required: true },
        secondarySkills: { type: String },
        github: { type: String },
        linkedin: { type: String },
        portfolio: { type: String },
        resume: { type: String, required: true },
        canJoin: { type: String, required: true },
        coverLetter: { type: String, required: true },

        notes: [{ type: String, default: "" }],
        status: {
            type: String,
            enum: ["pending", "selected", "declined"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const Application: Model<ApplicationDocument> =
    models.Application ||
    model<ApplicationDocument>("Application", ApplicationSchema);
