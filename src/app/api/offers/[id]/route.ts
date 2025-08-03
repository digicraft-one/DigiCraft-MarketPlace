import { successResponse, errorResponse } from '@/lib/apiResponse';
import { authOptions } from '@/lib/auth/options';
import { connectToDB } from '@/lib/db/mongoose';
import { Offer } from '@/schemas/Offer';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

interface Params {
    params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);
        if (!session)
            return NextResponse.json(errorResponse('Unauthorized'), {
                status: 401,
            });

        await connectToDB();

        if (!Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(errorResponse('Invalid offer ID'), {
                status: 400,
            });
        }

        const offer = await Offer.findById(params.id).populate(
            'products.productId',
            'title shortDescription pricingOptions'
        );

        if (!offer)
            return NextResponse.json(errorResponse('Offer not found'), {
                status: 404,
            });

        return NextResponse.json(successResponse(offer));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to fetch offer', err as Error),
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized access'), {
            status: 401,
        });

    try {
        await connectToDB();
        if (!Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(errorResponse('Invalid offer ID'), {
                status: 400,
            });
        }

        const updates = await req.json();
        const offer = await Offer.findByIdAndUpdate(params.id, updates, {
            new: true,
        });

        if (!offer)
            return NextResponse.json(errorResponse('Offer not found'), {
                status: 404,
            });

        return NextResponse.json(successResponse(offer, 'Offer updated'));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to update offer', err as Error),
            { status: 500 }
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized access'), {
            status: 401,
        });

    try {
        await connectToDB();
        if (!Types.ObjectId.isValid(params.id)) {
            return NextResponse.json(errorResponse('Invalid offer ID'), {
                status: 400,
            });
        }

        const deleted = await Offer.findByIdAndDelete(params.id);

        if (!deleted)
            return NextResponse.json(errorResponse('Offer not found'), {
                status: 404,
            });

        return NextResponse.json(successResponse(null, 'Offer deleted'));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to delete offer', err as Error),
            { status: 500 }
        );
    }
}
