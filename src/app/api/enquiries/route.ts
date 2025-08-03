import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { sendEnquiryNotification } from "@/lib/telegram";
import { sendEnquiryConfirmationEmail } from "@/lib/email/brevo";
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

        // Send Telegram notification
        try {
            const telegramResult = await sendEnquiryNotification({
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message,
                product: { title: product.title, category: product.category, link: `marketplace.digicraft.one/marketplace/${product._id}` },
                adjustmentType: body.adjustmentType
            });

            if (!telegramResult.success) {
                console.error("Failed to send Telegram notification:", telegramResult.error);
            }
        } catch (telegramError) {
            console.error("Error sending Telegram notification:", telegramError);
        }

        // Send confirmation email to customer
        try {
            const emailResult = await sendEnquiryConfirmationEmail({
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message,
                productTitle: product.title,
                productDescription: product.shortDescription || product.title,
                adjustmentType: body.adjustmentType
            });

            if (!emailResult.success) {
                console.error("Failed to send confirmation email:", emailResult.error);
            }
        } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
        }

        // Send admin notification email
        // try {
        //     const adminEmailResult = await sendAdminNotificationEmail({
        //         name: body.name,
        //         email: body.email,
        //         phone: body.phone,
        //         message: body.message,
        //         productTitle: product.title,
        //         productDescription: product.shortDescription || product.title,
        //         adjustmentType: body.adjustmentType
        //     });

        //     if (!adminEmailResult.success) {
        //         console.error("Failed to send admin notification email:", adminEmailResult.error);
        //     }
        // } catch (adminEmailError) {
        //     console.error("Error sending admin notification email:", adminEmailError);
        // }

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