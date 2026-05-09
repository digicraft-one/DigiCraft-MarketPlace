import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export async function GET() {
    try {
        await connectToDB();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(successResponse(categories));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch categories", err as Error),
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized access"), {
            status: 401,
        });

    try {
        await connectToDB();
        const body = await req.json();
        const name = String(body?.name || "").trim();
        if (!name) {
            return NextResponse.json(errorResponse("Category name is required"), {
                status: 400,
            });
        }

        const slug = slugify(body?.slug || name);
        if (!slug) {
            return NextResponse.json(errorResponse("Category slug is invalid"), {
                status: 400,
            });
        }

        const duplicate = await Category.findOne({
            $or: [{ name: new RegExp(`^${name}$`, "i") }, { slug }],
        });
        if (duplicate) {
            return NextResponse.json(
                errorResponse("Category with same name or slug already exists"),
                { status: 409 }
            );
        }

        const created = await Category.create({ name, slug });
        return NextResponse.json(successResponse(created, "Category created"), {
            status: 201,
        });
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to create category", err as Error),
            { status: 500 }
        );
    }
}
