import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { Product } from "@/schemas/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const toObjectIdList = (value: unknown): Types.ObjectId[] => {
    if (!Array.isArray(value)) return [];
    const uniqueIds = [...new Set(value.map((v) => String(v)))];
    return uniqueIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
};

export async function GET() {
    try {
        await connectToDB();
        const products = await Product.find({})
            .populate("categories", "name slug")
            .sort({ createdAt: -1 });

        const normalizedProducts = products.map((product) => {
            const plain = product.toObject();
            const primaryCategory =
                (plain.categories?.[0] as { name?: string } | undefined)?.name ||
                plain.category ||
                "";
            return { ...plain, category: primaryCategory };
        });

        return NextResponse.json(successResponse(normalizedProducts));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch products", err as Error),
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
        const categoryIds = toObjectIdList(body.categories);

        const requiredFields = [
            "title",
            "shortDescription",
            "longDescription",
            "tags",
            "coverImage",
            "deliverables",
            "categories",
            "features",
            "pricingOptions",
            "catelogLink",
            "demoLink",
            "seo",
        ];

        for (const field of requiredFields)
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );

        if (categoryIds.length === 0) {
            return NextResponse.json(
                errorResponse("At least one category is required"),
                { status: 400 }
            );
        }

        const matchedCategories = await Category.find({
            _id: { $in: categoryIds },
        })
            .select({ name: 1 })
            .lean();

        if (matchedCategories.length !== categoryIds.length) {
            return NextResponse.json(
                errorResponse("One or more categories are invalid"),
                { status: 400 }
            );
        }

        const createdPayload = {
            ...body,
            categories: categoryIds,
            category: matchedCategories[0]?.name || "",
        };

        const created = await Product.create(createdPayload);
        return NextResponse.json(successResponse(created, "Product created"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to create product", err as Error),
            { status: 500 }
        );
    }
}
