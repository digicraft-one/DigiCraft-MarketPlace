import { connectToDB } from "@/lib/db/mongoose";
import { Product } from "@/schemas/Product";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const { id } = await params;
        const product = await Product.findOne({ "seo.slug": id });
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