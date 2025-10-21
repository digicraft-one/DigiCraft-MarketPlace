export interface SendTelegramMessagePayload {
    text: string;
    chatIds?: string[];
}

export async function sendTelegramMessage(options: SendTelegramMessagePayload) {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            console.error(
                "TELEGRAM_BOT_TOKEN not found in environment variables"
            );
            return { success: false, error: "Bot token not configured" };
        }

        // Get chat IDs from environment variable, split by comma
        const chatIdsEnv = process.env.TELEGRAM_CHAT_IDS;
        if (!chatIdsEnv) {
            console.error(
                "TELEGRAM_CHAT_IDS not found in environment variables"
            );
            return { success: false, error: "Chat IDs not configured" };
        }

        // Use provided chat IDs or fall back to environment variable
        const chatIds =
            options.chatIds || chatIdsEnv.split(",").map((id) => id.trim());

        const results = [];

        for (const chatId of chatIds) {
            try {
                const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
                const params = new URLSearchParams({
                    chat_id: chatId,
                    text: options.text,
                    parse_mode: "HTML", // Enable HTML formatting
                });

                const response = await fetch(`${url}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (data.ok) {
                    results.push({ chatId, success: true, data });
                } else {
                    results.push({
                        chatId,
                        success: false,
                        error: data.description,
                    });
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                results.push({ chatId, success: false, error: errorMessage });
            }
        }

        const allSuccessful = results.every((result) => result.success);
        return {
            success: allSuccessful,
            results,
            error: allSuccessful ? null : "Some messages failed to send",
        };
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

export async function sendEnquiryNotification(enquiryData: {
    name: string;
    email: string;
    phone: string;
    message: string;
    product?: { title: string; category: string; link: string };
    adjustmentType?: string;
}) {
    const text = `🚀 New Form Submission!

Name: ${enquiryData.name}
Email: ${enquiryData.email}
Phone: ${enquiryData.phone}
Message: ${enquiryData.message}
Product: ${enquiryData.product?.title || "N/A"}
Category: ${enquiryData.product?.category || "N/A"}
Link: ${enquiryData.product?.link || "N/A"}
Adjustment Type: ${enquiryData.adjustmentType}

Time: ${new Date().toLocaleString()}`;
    return sendTelegramMessage({ text });
}

export async function sendApplicationNotification(applicationData: {
    name: string;
    email: string;
    phone: string;
    role: string;
    primarySkills: string;
    github: string;
    resume: string;
    coverLetter: string;
}) {
    const text = `New Application!

Role: ${applicationData.role}
Name: ${applicationData.name}
Email: ${applicationData.email}
Phone: ${applicationData.phone}
Skills: ${applicationData.primarySkills}
Github: ${applicationData.github || "N/A"}
Resume: ${applicationData.resume}
Cover Letter: ${applicationData.coverLetter}
Time: ${new Date().toLocaleString()}`;
    return sendTelegramMessage({ text });
}
