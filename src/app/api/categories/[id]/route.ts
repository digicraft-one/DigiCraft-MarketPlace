import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { Product } from "@/schemas/Product";
import { slugify } from "@/lib/categorySlug";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized access"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(errorResponse("Invalid category id"), {
                status: 400,
            });
        }

        const body = await req.json();
        const nameRaw = body?.name != null ? String(body.name).trim() : "";
        const slugRaw =
            body?.slug != null ? String(body.slug).trim() : undefined;

        const existing = await Category.findById(id);
        if (!existing) {
            return NextResponse.json(errorResponse("Category not found"), {
                status: 404,
            });
        }

        const nextName = nameRaw || existing.name;
        const nextSlug = slugify(slugRaw !== undefined ? slugRaw : nextName);

        if (!nextSlug) {
            return NextResponse.json(errorResponse("Category slug is invalid"), {
                status: 400,
            });
        }

        const dup = await Category.findOne({
            _id: { $ne: new Types.ObjectId(id) },
            $or: [
                { name: new RegExp(`^${nextName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
                { slug: nextSlug },
            ],
        });
        if (dup) {
            return NextResponse.json(
                errorResponse("Another category already uses this name or slug"),
                { status: 409 }
            );
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            { $set: { name: nextName, slug: nextSlug } },
            { new: true, runValidators: true }
        );

        await Product.updateMany(
            { "categories.0": new Types.ObjectId(id) },
            { $set: { category: nextName } }
        );

        return NextResponse.json(successResponse(updated, "Category updated"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to update category", err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized access"), {
            status: 401,
        });

    try {
        await connectToDB();
        const { id } = await params;
        if (!Types.ObjectId.isValid(id)) {
            return NextResponse.json(errorResponse("Invalid category id"), {
                status: 400,
            });
        }

        const associatedProducts = await Product.countDocuments({
            categories: new Types.ObjectId(id),
        });
        if (associatedProducts > 0) {
            return NextResponse.json(
                errorResponse(
                    "Cannot delete category because products are associated with it"
                ),
                { status: 409 }
            );
        }

        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json(errorResponse("Category not found"), {
                status: 404,
            });
        }

        return NextResponse.json(successResponse(null, "Category deleted"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to delete category", err as Error),
            { status: 500 }
        );
    }
}
