import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Enquiry } from "@/schemas/Enquiry";
import { Product } from "@/schemas/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const enquiries = await Enquiry.find({})
            .populate("product", "title category")
            .sort({ createdAt: -1 });

        return NextResponse.json(successResponse(enquiries));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch enquiries", err as Error),
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json(errorResponse("Unauthorized access"), {
                status: 401,
            });

        await connectToDB();
        const body = await req.json();

        const requiredFields = [
            "name",
            "email",
            "phone",
            "message",
            "product",
            "adjustmentType",
        ];
        for (const field of requiredFields)
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );

        const product = await Product.findById(body.product);
        if (!product)
            return NextResponse.json(errorResponse("Invalid product ID"), {
                status: 400,
            });

        const created = await Enquiry.create(body);

        return NextResponse.json(
            successResponse(created, "Enquiry submitted"),
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to submit enquiry", err as Error),
            { status: 500 }
        );
    }
}
