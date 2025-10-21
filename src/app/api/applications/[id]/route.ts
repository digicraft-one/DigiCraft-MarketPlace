import { errorResponse, successResponse } from "@/lib/apiResponse";
import { authOptions } from "@/lib/auth/options";
import { connectToDB } from "@/lib/db/mongoose";
import { Application } from "@/schemas/Application";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const application = await Application.findById(params.id);
        if (!application)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });

        return NextResponse.json(successResponse(application));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Error fetching application", err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const deleted = await Application.findByIdAndDelete(params.id);
        if (!deleted)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });

        return NextResponse.json(successResponse(null, "Application deleted"));
    } catch (err) {
        return NextResponse.json(
            errorResponse("Error deleting application", err as Error),
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse("Unauthorized"), {
            status: 401,
        });

    try {
        await connectToDB();
        const body = await req.json();

        if (
            !body.status ||
            !["pending", "selected", "declined"].includes(body.status)
        )
            return NextResponse.json(
                errorResponse("Invalid or missing status"),
                { status: 400 }
            );

        if (body.notes && !Array.isArray(body.notes))
            return NextResponse.json(
                errorResponse("Invalid or missing notes"),
                { status: 400 }
            );

        const updated = await Application.findByIdAndUpdate(
            params.id,
            { status: body.status, notes: body.notes },
            { new: true }
        );

        if (!updated)
            return NextResponse.json(errorResponse("Not found"), {
                status: 404,
            });

        return NextResponse.json(
            successResponse(updated, "Application status updated")
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Failed to update application", err as Error),
            { status: 500 }
        );
    }
}
