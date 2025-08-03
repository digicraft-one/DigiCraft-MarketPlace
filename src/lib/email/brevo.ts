import * as SibApiV3Sdk from "@getbrevo/brevo";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY!
);

export interface SendEmailPayload {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
}

export async function sendEmail(options: SendEmailPayload) {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.to = options.to;

        sendSmtpEmail.subject = options.subject;
        sendSmtpEmail.htmlContent = options.htmlContent;

        sendSmtpEmail.sender = {
            name: process.env.EMAIL_FROM_NAME!,
            email: process.env.EMAIL_FROM_ADDRESS!,
        };

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { success: true, data };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

export async function sendAcknowledgmentEmail(to: string, name?: string) {
    const htmlContent = ``;

    return sendEmail({
        to: [{ email: to, name }],
        subject: "Verify Your Email - DBDash",
        htmlContent,
    });
}
