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
        console.log(formData);
        
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
