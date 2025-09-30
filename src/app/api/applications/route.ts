import { errorResponse, successResponse } from "@/lib/apiResponse";
import { connectToDB } from "@/lib/db/mongoose";
import { sendApplicationConfirmationEmail } from "@/lib/email/brevo";
import { sendApplicationNotification } from "@/lib/telegram/telegram";
import { Application } from "@/schemas/Application";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDB();
        const applications = await Application.find({}).sort({ createdAt: -1 });
        return NextResponse.json(successResponse(applications));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to fetch applications", err as Error),
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
            "location",
            "role",
            "experience",
            "primarySkills",
            "resume",
            "canJoin",
            "coverLetter",
        ];
        for (const field of requiredFields)
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );

        const newEntry: {
            name: string;
            email: string;
            phone: string;
            location: string;
            role: string;
            experience: string;
            primarySkills: string;
            secondarySkills: string;
            github: string;
            linkedin: string;
            portfolio: string;
            resume: string;
            canJoin: string;
            coverLetter: string;
        } = {
            name: body.name as string,
            email: body.email as string,
            phone: body.phone as string,
            location: body.location as string,
            role: body.role as string,
            experience: body.experience as string,
            primarySkills: body.primarySkills as string,
            secondarySkills: body.secondarySkills ?? "",
            github: body.github ?? "",
            linkedin: body.linkedin ?? "",
            portfolio: body.portfolio ?? "",
            resume: body.resume as string,
            canJoin: body.canJoin as string,
            coverLetter: body.coverLetter as string,
        };

        const created = await Application.create(newEntry);

        // Send Telegram notification
        try {
            const telegramResult = await sendApplicationNotification({
                name: body.name,
                email: body.email,
                phone: body.phone,
                role: body.role,
                primarySkills: body.primarySkills,
                github: body.github ?? "",
                resume: body.resume,
                coverLetter: body.coverLetter,
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
            const emailResult = await sendApplicationConfirmationEmail({
                name: body.name,
                email: body.email,
                phone: body.phone,
                role: body.role,
                primarySkills: body.primarySkills,
                github: body.github ?? "",
                resume: body.resume,
                coverLetter: body.coverLetter,
            });

            if (!emailResult.success)
                console.error(
                    "Failed to send confirmation email:",
                    emailResult.error
                );
        } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
        }

        return NextResponse.json(
            successResponse(created, "Application submitted"),
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to submit application", err as Error),
            { status: 500 }
        );
    }
}
