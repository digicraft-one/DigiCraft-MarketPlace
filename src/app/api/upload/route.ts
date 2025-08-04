import { errorResponse, successResponse } from "@/lib/apiResponse";
import cloudinary from "@/lib/cloudinary";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();

        const file = formData.get("file");

        if (!file || !(file instanceof Blob))
            return NextResponse.json(errorResponse("No file uploaded"), {
                status: 400,
            });

        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise((resolve: (res: NextResponse) => void) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "digicraft-market", resource_type: "auto" },
                (
                    error: UploadApiErrorResponse | undefined,
                    result: UploadApiResponse | undefined
                ) => {
                    if (error || !result) {
                        resolve(
                            NextResponse.json(
                                errorResponse("Upload failed", error ?? null),
                                { status: 500 }
                            )
                        );
                    } else {
                        resolve(
                            NextResponse.json(
                                successResponse(
                                    {
                                        url: result.secure_url,
                                        public_id: result.public_id,
                                        resource_type: result.resource_type,
                                    },
                                    "Image uploaded successfully"
                                )
                            )
                        );
                    }
                }
            );

            bufferToStream(buffer).pipe(stream);
        });
    } catch (err) {
        return NextResponse.json(
            errorResponse("Unexpected error during upload", err as Error),
            { status: 500 }
        );
    }
}
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { public_id } = body;

        if (!public_id || typeof public_id !== "string")
            return NextResponse.json(
                errorResponse("Missing or invalid public_id"),
                { status: 400 }
            );

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: "image",
        });

        if (result.result !== "ok")
            return NextResponse.json(
                errorResponse("Failed to delete image", result),
                { status: 500 }
            );

        return NextResponse.json(
            successResponse(null, "Image deleted successfully")
        );
    } catch (err) {
        return NextResponse.json(
            errorResponse("Unexpected error during deletion", err as Error),
            { status: 500 }
        );
    }
}
