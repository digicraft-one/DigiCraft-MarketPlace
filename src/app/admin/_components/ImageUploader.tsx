"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export function ImageUploader({
    onUpload,
}: {
    onUpload: (url: string, publicId: string) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            setError(null);

            if (!file.type.startsWith("image/"))
                throw new Error("Invalid file type. Please upload an image.");

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                console.error(
                    "API Error:",
                    json.message || json.error || res.statusText
                );
                throw new Error(
                    json.message || json.error?.message || "API request failed"
                );
            }

            const { data } = json;
            onUpload(data.url, data.public_id);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Input type="file" accept="image/*" onChange={handleChange} />
            {loading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
