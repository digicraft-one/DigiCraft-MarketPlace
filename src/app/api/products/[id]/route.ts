import { connectToDB } from "@/lib/db/mongoose";
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
        const product = await Product.findById(id);
        if (!product)
            return NextResponse.json(errorResponse("Product not found"), {
                status: 404,
            });

        return NextResponse.json(successResponse(product));
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
