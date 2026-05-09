import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { Product } from "@/schemas/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const { id } = await params;
        const product = await Product.findById(id).populate(
            "categories",
            "name slug"
        );
        if (!product)
            return NextResponse.json(errorResponse("Product not found"), {
                status: 404,
            });

        const plainProduct = product.toObject();
        const primaryCategory =
            (plainProduct.categories?.[0] as { name?: string } | undefined)
                ?.name ||
            plainProduct.category ||
            "";

        return NextResponse.json(
            successResponse({ ...plainProduct, category: primaryCategory })
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch product", err as Error),
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const updateData = await req.json();
        const { id } = await params;
        if (Array.isArray(updateData.categories)) {
            const categoryIds = [
                ...new Set(updateData.categories.map((categoryId: string) => String(categoryId))),
            ].filter((categoryId) => Types.ObjectId.isValid(categoryId));

            if (categoryIds.length === 0) {
                return NextResponse.json(
                    errorResponse("At least one category is required"),
                    { status: 400 }
                );
            }

            const categories = await Category.find({
                _id: { $in: categoryIds.map((categoryId) => new Types.ObjectId(categoryId)) },
            })
                .select({ name: 1 })
                .lean();

            if (categories.length !== categoryIds.length) {
                return NextResponse.json(
                    errorResponse("One or more categories are invalid"),
                    { status: 400 }
                );
            }

            updateData.categories = categoryIds;
            updateData.category = categories[0]?.name || "";
        }

        const updated = await Product.findByIdAndUpdate(
            new Types.ObjectId(id),
            updateData,
            { new: true, runValidators: true }
        );

        if (!updated)
            return NextResponse.json(errorResponse("Product not found"), {
                status: 404,
            });

        return NextResponse.json(successResponse(updated, "Product updated"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Error updating product", err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(errorResponse("Unauthorized access"), {
            status: 401,
        });
    }

    try {
        const { id } = await params;
        await connectToDB();
        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted)
            return NextResponse.json(
                errorResponse("Product not found or already deleted"),
                { status: 404 }
            );

        return NextResponse.json(successResponse(null, "Product deleted"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to delete product", err as Error),
            { status: 500 }
        );
    }
}
