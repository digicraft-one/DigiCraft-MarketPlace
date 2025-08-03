export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message: string;
    error?: Error;
}

export const successResponse = <T>(
    data: T,
    message = "Success"
): ApiResponse<T> => ({
    success: true,
    message,
    data,
});

export const errorResponse = (
    message: string,
    error: Error | null = null
): ApiResponse => ({
    success: false,
    message,
    error: error || undefined,
});
