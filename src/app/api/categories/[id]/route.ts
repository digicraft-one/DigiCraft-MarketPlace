import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Category } from "@/schemas/Category";
import { Product } from "@/schemas/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
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
