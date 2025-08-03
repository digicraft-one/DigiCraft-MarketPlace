import { ApiResponse } from "./apiResponse";

const DEFAULT_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api`;

export async function fetchAPI<T>(
    path: string,
    options: RequestInit = {},
    baseUrl: string = DEFAULT_BASE_URL
): Promise<T> {
    try {
        const url = `${baseUrl}${path}`;

        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            },
            cache: "no-store",
        });

        const json = (await res.json()) as ApiResponse<T>;

        if (!res.ok || !json.success) {
            console.error(
                "API Error:",
                json.message || json.error || res.statusText
            );
            throw new Error(
                json.message || json.error?.message || "API request failed"
            );
        }

        return json.data as T;
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err;
    }
}
