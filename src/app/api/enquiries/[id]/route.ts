import { errorResponse, successResponse } from '@/lib/apiResponse';
import { authOptions } from '@/lib/auth/options';
import { connectToDB } from '@/lib/db/mongoose';
import { Enquiry } from '@/schemas/Enquiry';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
    params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized'), {
            status: 401,
        });

    try {
        await connectToDB();
        const enquiry = await Enquiry.findById(params.id).populate('product');
        if (!enquiry)
            return NextResponse.json(errorResponse('Not found'), {
                status: 404,
            });

        return NextResponse.json(successResponse(enquiry));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Error fetching enquiry', err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized'), {
            status: 401,
        });

    try {
        await connectToDB();
        const deleted = await Enquiry.findByIdAndDelete(params.id);
        if (!deleted)
            return NextResponse.json(errorResponse('Not found'), {
                status: 404,
            });

        return NextResponse.json(successResponse(null, 'Enquiry deleted'));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Error deleting enquiry', err as Error),
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized'), {
            status: 401,
        });

    try {
        await connectToDB();
        const body = await req.json();

        if (
            !body.status ||
            !['pending', 'contacted', 'closed'].includes(body.status)
        )
            return NextResponse.json(
                errorResponse('Invalid or missing status'),
                { status: 400 }
            );

        const updated = await Enquiry.findByIdAndUpdate(
            params.id,
            { status: body.status },
            { new: true }
        );

        if (!updated)
            return NextResponse.json(errorResponse('Not found'), {
                status: 404,
            });

        return NextResponse.json(
            successResponse(updated, 'Enquiry status updated')
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to update enquiry', err as Error),
            { status: 500 }
        );
    }
}
