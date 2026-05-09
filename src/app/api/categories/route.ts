import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { Product } from "@/schemas/Product";
import { slugify } from "@/lib/categorySlug";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const withCounts = searchParams.get("counts") === "true";

        const categories = await Category.find({}).sort({ name: 1 }).lean();

        if (!withCounts) {
            return NextResponse.json(successResponse(categories));
        }

        const countRows = await Product.aggregate<{ _id: Types.ObjectId; productCount: number }>([
            { $match: { categories: { $exists: true, $ne: [] } } },
            { $unwind: "$categories" },
            { $group: { _id: "$categories", productCount: { $sum: 1 } } },
        ]);

        const countMap = new Map(
            countRows.map((row) => [String(row._id), row.productCount])
        );

        const withCountsList = categories.map((cat) => ({
            ...cat,
            productCount: countMap.get(String(cat._id)) ?? 0,
        }));

        return NextResponse.json(successResponse(withCountsList));
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
