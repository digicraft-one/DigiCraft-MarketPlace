import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectToDB } from "@/lib/db/mongoose";
import {
    sendEnquiryConfirmationEmail,
    sendEnquiryConfirmationEmailNoProduct,
} from "@/lib/email/brevo";
import { sendEnquiryNotification } from "@/lib/telegram";
import { Enquiry } from "@/schemas/Enquiry";
import { Product } from "@/schemas/Product";
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
        // if (!product)
        //     return NextResponse.json(errorResponse("Invalid product ID"), {
        //         status: 400,
        //     });

        const created = await Enquiry.create(body);

        // Send Telegram notification
        try {
            const telegramResult = await sendEnquiryNotification({
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message,
                // product?: {
                //     title: product.title,
                //     category: product.category,
                //     link: `marketplace.digicraft.one/marketplace/${product._id}`,
                // },
                product: product
                    ? {
                          title: product.title,
                          category: product.category,
                          link: `marketplace.digicraft.one/marketplace/${product._id}`,
                      }
                    : {
                          title: "N/A",
                          category: "N/A",
                          link: "#",
                      },
                adjustmentType: body.adjustmentType,
            });

            if (!telegramResult.success) {
                console.error(
                    "Failed to send Telegram notification:",
                    telegramResult.error
                );
            }
        } catch (telegramError) {
            console.error(
                "Error sending Telegram notification:",
                telegramError
            );
        }

        // Send confirmation email to customer
        try {
            let emailResult;
            if (body.product && body.product === "") {
                emailResult = await sendEnquiryConfirmationEmailNoProduct({
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    message: body.message,
                });
            } else {
                emailResult = await sendEnquiryConfirmationEmail({
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    message: body.message,
                    productTitle: product?.title || "N/A",
                    productDescription:
                        product?.shortDescription || product?.title || "N/A",
                    adjustmentType: body.adjustmentType,
                    productId: product?._id?.toString() || "N/A",
                });
            }

            if (!emailResult.success) {
                console.error(
                    "Failed to send confirmation email:",
                    emailResult.error
                );
            }
        } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
        }

        // Send notification to external service
        try {
            const notificationResponse = await fetch(
                "https://notification.digicraft.one/api/external/send-notification",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key":
                            process.env.NOTIFICATION_API_KEY ||
                            "414930a3b0d878b8c8b63a3de3368060a59e78a5344d409b1e090e396764dc82",
                    },
                    body: JSON.stringify({
                        title: "MarketPlace Enquiry",
                        body: body.message,
                        data: {
                            customerName: body.name,
                            customerEmail: body.email,
                            customerPhone: body.phone,
                            productTitle: product?.title
                                ? product.title
                                : "N/A",
                            productCategory: product?.category
                                ? product.category
                                : "N/A",
                            adjustmentType: body.adjustmentType
                                ? body.adjustmentType
                                : "N/A",
                            productLink: product?._id
                                ? `https://marketplace.digicraft.one/marketplace/${(
                                      product._id as string
                                  ).toString()}`
                                : "",
                            enquiryMessage: body.message,
                        },
                        sender: "MarketPlace",
                    }),
                }
            );

            if (!notificationResponse.ok) {
                console.error(
                    "Failed to send notification:",
                    await notificationResponse.text()
                );
            }
        } catch (notificationError) {
            console.error("Error sending notification:", notificationError);
        }

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
