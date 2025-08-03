import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Product } from "@/schemas/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const products = await Product.find({});

        return NextResponse.json(successResponse(products));
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

        const requiredFields = [
            "title",
            "shortDescription",
            "longDescription",
            "category",
            "features",
            "pricingOptions",
        ];

        for (const field of requiredFields)
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );

        const created = await Product.create(body);
        return NextResponse.json(successResponse(created, "Product created"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to create product", err as Error),
            { status: 500 }
        );
    }
}
