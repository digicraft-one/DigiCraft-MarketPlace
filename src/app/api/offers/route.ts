import { successResponse, errorResponse } from '@/lib/apiResponse';
import { authOptions } from '@/lib/auth/options';
import { connectToDB } from '@/lib/db/mongoose';
import { Offer } from '@/schemas/Offer';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();

        const offers = await Offer.find({
            active: true,
            expiresAt: { $gte: new Date() },
        }).populate(
            'products.productId',
            'title shortDescription pricingOptions'
        );

        return NextResponse.json(successResponse(offers));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to fetch offers', err as Error),
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json(errorResponse('Unauthorized access'), {
            status: 401,
        });

    try {
        await connectToDB();
        const body = await req.json();

        const requiredFields = [
            'title',
            'description',
            'bannerImage',
            'expiresAt',
        ];

        for (const field of requiredFields)
            if (!body[field])
                return NextResponse.json(
                    errorResponse(`Missing field: ${field}`),
                    { status: 400 }
                );

        const created = await Offer.create({
            title: body.title,
            description: body.description,
            bannerImage: body.bannerImage,
            active: body.active ?? true,
            expiresAt: body.expiresAt,
            products: body.products ?? [],
        });

        return NextResponse.json(successResponse(created, 'Offer created'));
    } catch (err) {
        return NextResponse.json(
            errorResponse('Failed to create offer', err as Error),
            { status: 500 }
        );
    }
}
