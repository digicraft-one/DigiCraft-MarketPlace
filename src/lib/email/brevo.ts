import * as SibApiV3Sdk from "@getbrevo/brevo";

// Check if API key is available
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
    console.error("❌ BREVO_API_KEY environment variable is not set!");
    console.error(
        "Please add BREVO_API_KEY=your_api_key to your .env.local file"
    );
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Only set API key if it exists
if (apiKey) {
    apiInstance.setApiKey(
        SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
        apiKey
    );
}

export interface SendEmailPayload {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
}

export interface EnquiryEmailData {
    name: string;
    email: string;
    phone: string;
    message: string;
    productTitle: string;
    productDescription: string;
    adjustmentType: string;
    productId: string;
}

export async function sendEmail(options: SendEmailPayload) {
    try {
        // Check if API key is available
        if (!process.env.BREVO_API_KEY) {
            console.error("❌ Cannot send email: BREVO_API_KEY not configured");
            return { success: false, error: "API key not configured" };
        }

        // Check if sender email is configured
        if (!process.env.EMAIL_FROM_ADDRESS || !process.env.EMAIL_FROM_NAME) {
            console.error(
                "❌ Cannot send email: EMAIL_FROM_ADDRESS or EMAIL_FROM_NAME not configured"
            );
            return { success: false, error: "Sender email not configured" };
        }

        console.log("📧 Attempting to send email...");
        console.log(
            "📤 From:",
            process.env.EMAIL_FROM_NAME,
            process.env.EMAIL_FROM_ADDRESS
        );
        console.log("📥 To:", options.to);
        console.log("📋 Subject:", options.subject);

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.to = options.to;
        sendSmtpEmail.subject = options.subject;
        sendSmtpEmail.htmlContent = options.htmlContent;

        sendSmtpEmail.sender = {
            name: process.env.EMAIL_FROM_NAME,
            email: process.env.EMAIL_FROM_ADDRESS,
        };

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent successfully:", data);
        return { success: true, data };
    } catch (error: any) {
        console.error("❌ Error sending email:");
        console.error("Status:", error.response?.status);
        console.error(
            "Message:",
            error.response?.data?.message || error.message
        );
        console.error("Error Details:", error.response?.data);
        console.error("Full error:", error);

        // Provide more specific error messages
        if (error.response?.status === 401) {
            console.error("🔑 401 Unauthorized - Possible issues:");
            console.error(
                "1. Wrong API key type (need SMTP API key, not REST API key)"
            );
            console.error("2. API key is invalid or expired");
            console.error("3. Sender email not verified in Brevo");
            console.error("4. Account suspended or billing issues");
        } else if (error.response?.status === 400) {
            console.error("📝 400 Bad Request - Check:");
            console.error("1. Email format and sender configuration");
            console.error("2. Sender email is verified");
            console.error("3. Recipient email format");
        } else if (error.response?.status === 403) {
            console.error(
                "🚫 403 Forbidden - API key may not have email sending permissions"
            );
        }

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

// Test function to verify Brevo configuration
export async function testBrevoConfiguration() {
    console.log("🧪 Testing Brevo Configuration...");
    console.log("=".repeat(50));

    // Check environment variables
    console.log("📋 Environment Variables Check:");
    console.log(
        "BREVO_API_KEY:",
        process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing"
    );
    console.log(
        "EMAIL_FROM_NAME:",
        process.env.EMAIL_FROM_NAME ? "✅ Set" : "❌ Missing"
    );
    console.log(
        "EMAIL_FROM_ADDRESS:",
        process.env.EMAIL_FROM_ADDRESS ? "✅ Set" : "❌ Missing"
    );

    if (!process.env.BREVO_API_KEY) {
        console.log("❌ BREVO_API_KEY is missing!");
        return { success: false, error: "API key not configured" };
    }

    // Test with a simple email
    try {
        const testResult = await sendEmail({
            to: [{ email: "test@example.com", name: "Test User" }],
            subject: "Brevo Configuration Test",
            htmlContent:
                "<h1>Test Email</h1><p>This is a test email to verify Brevo configuration.</p>",
        });

        if (testResult.success) {
            console.log("✅ Brevo configuration is working!");
        } else {
            console.log("❌ Brevo configuration failed:", testResult.error);
        }

        return testResult;
    } catch (error) {
        console.log("❌ Test failed:", error);
        return { success: false, error };
    }
}

export async function sendEnquiryConfirmationEmail(data: EnquiryEmailData) {
    try {
        // Email-friendly HTML template with inline styles
        let htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting DigiCraft</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); padding: 25px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <img src="https://marketplace.digicraft.one/logo.png" alt="DigiCraft Logo" style="width: 60px; height: 60px; margin-bottom: 15px;">
                                        <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">Thank You for Reaching Out!</h1>
                                        <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.9;">We're excited to work with you on your digital project</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 25px 20px;">
                            
                            <!-- Welcome Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <h2 style="color: #14b8a6; font-size: 20px; margin: 0 0 10px 0;">Welcome to DigiCraft!</h2>
                                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Thank you for choosing us for your digital needs. We've received your inquiry and our team is already reviewing your requirements. We're committed to bringing your vision to life with our expertise and creativity.</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Customer Message -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <h4 style="color: #14b8a6; margin: 0 0 8px 0; font-size: 14px;">Customer Message:</h4>
                                        <p style="color: #333333; font-style: italic; line-height: 1.5; margin: 0;">{{message}}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Application Details -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 12px;">
                                                    <h3 style="color: #333333; font-size: 16px; margin: 0;">🛒 <a href="https://marketplace.digicraft.one/products/{{productId}}" style="color: #14b8a6; text-decoration: none; font-weight: 600;">{{productTitle}}</a></h3>
                                                    <p style="color: #666666; font-size: 13px; margin: 4px 0 0 0;">{{productDescription}}</p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Details Grid -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 0;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                                <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Selected Plan</h4>
                                                                <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{adjustmentType}} Plan</p>
                                                            </td>
                                                            <td style="width: 12px;"></td>
                                                            <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6;">
                                                                <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Customer Name</h4>
                                                                <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{name}}</p>
                                                            </td>
                                                        </tr>
                                                        <tr><td colspan="3" style="height: 8px;"></td></tr>
                                                        <tr>
                                                            <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6;">
                                                                <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Email</h4>
                                                                <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{email}}</p>
                                                            </td>
                                                            <td style="width: 12px;"></td>
                                                            <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6;">
                                                                <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Phone</h4>
                                                                <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{phone}}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Next Steps -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #e3f2fd; border-radius: 8px; border: 1px solid #bbdefb;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 12px 0;">What Happens Next?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">1</span>
                                                    <span style="color: #333333; font-size: 13px;">Our team will review your requirements within 24 hours</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">2</span>
                                                    <span style="color: #333333; font-size: 13px;">We'll schedule a consultation call to discuss details</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">3</span>
                                                    <span style="color: #333333; font-size: 13px;">You'll receive a detailed project proposal and timeline</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">4</span>
                                                    <span style="color: #333333; font-size: 13px;">Once approved, we'll begin development immediately</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">5</span>
                                                    <span style="color: #333333; font-size: 13px;">Regular updates and milestone reviews throughout the process</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Contact Information -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px; text-align: center;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 12px 0;">Need to Reach Us?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center">
                                                    <a href="mailto:support@digicraft.one" style="display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📧 Email Us</a>
                                                    <a href="https://digicraft.one" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">🌐 Visit Website</a>
                                                    <a href="tel:+918299797516" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📞 Call Us</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 13px; margin: 0 0 8px 0;"><strong>DigiCraft</strong> - Transforming Ideas into Digital Reality</p>
                            <p style="color: #666666; font-size: 13px; margin: 0 0 15px 0;">Launch Before You Blink</p>
                            <p style="color: #999999; font-size: 11px; margin: 0;">This email was sent from the DigiCraft contact form and is an automated response. If you have any questions, please don't hesitate to reach out.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        // Replace template variables
        const replacements = {
            "{{name}}": data.name,
            "{{email}}": data.email,
            "{{phone}}": data.phone,
            "{{message}}": data.message,
            "{{productTitle}}": data.productTitle,
            "{{productDescription}}": data.productDescription,
            "{{adjustmentType}}": data.adjustmentType,
            "{{productId}}": data.productId,
        };

        // Apply all replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            htmlTemplate = htmlTemplate.replace(
                new RegExp(placeholder, "g"),
                value
            );
        });

        return sendEmail({
            to: [{ email: data.email, name: data.name }],
            subject: "Thank You for Your Enquiry - DigiCraft",
            htmlContent: htmlTemplate,
        });
    } catch (error) {
        console.error("Error sending enquiry confirmation email:", error);
        return { success: false, error };
    }
}

export async function sendEnquiryConfirmationEmailNoProduct(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
}) {
    try {
        // Email-friendly HTML template with inline styles
        let htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting DigiCraft</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
        style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600"
                    style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td
                            style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); padding: 25px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <img src="https://marketplace.digicraft.one/logo.png" alt="DigiCraft Logo" style="width: 60px; height: 60px; margin-bottom: 15px;">
                                        <h1
                                            style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                                            Thank You for Reaching Out!</h1>
                                        <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.9;">We're
                                            excited to work with you on your digital project</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 25px 20px;">

                            <!-- Welcome Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <h2 style="color: #14b8a6; font-size: 20px; margin: 0 0 10px 0;">Welcome to
                                            DigiCraft!</h2>
                                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Thank
                                            you for choosing us for your digital needs. We've received your inquiry and
                                            our team is already reviewing your requirements. We're committed to bringing
                                            your vision to life with our expertise and creativity.</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Customer Message -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <h4 style="color: #14b8a6; margin: 0 0 8px 0; font-size: 14px;">Customer
                                            Message:</h4>
                                        <p style="color: #333333; font-style: italic; line-height: 1.5; margin: 0;">
                                            {{message}}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Application Details -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px;">


                                        <!-- Details Grid -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%">
                                            <tr>
                                                <td style="height: 8px;"></td>
                                            </tr>

                                            <!-- Customer Name -->
                                            <tr>
                                                <td
                                                    style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 2px;">
                                                    <h4
                                                        style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Customer Name
                                                    </h4>
                                                    <p
                                                        style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">
                                                        {{name}}
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Spacer row -->
                                            <tr>
                                                <td style="height: 2px;"></td>
                                            </tr>

                                            <!-- Email -->
                                            <tr>
                                                <td
                                                    style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 2px;">
                                                    <h4
                                                        style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Email
                                                    </h4>
                                                    <p
                                                        style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">
                                                        {{email}}
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Spacer row -->
                                            <tr>
                                                <td style="height: 2px;"></td>
                                            </tr>

                                            <!-- Phone -->
                                            <tr>
                                                <td
                                                    style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6;">
                                                    <h4
                                                        style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Phone
                                                    </h4>
                                                    <p
                                                        style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">
                                                        {{phone}}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>


                                    </td>
                                </tr>
                            </table>

                            <!-- Next Steps -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="margin-bottom: 20px; background-color: #e3f2fd; border-radius: 8px; border: 1px solid #bbdefb;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 12px 0;">What Happens
                                            Next?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%">
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">1</span>
                                                    <span style="color: #333333; font-size: 13px;">Our team will review your requirements within 24 hours</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">2</span>
                                                    <span style="color: #333333; font-size: 13px;">We'll schedule a consultation call to discuss details</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">3</span>
                                                    <span style="color: #333333; font-size: 13px;">You'll receive a detailed project proposal and timeline</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">4</span>
                                                    <span style="color: #333333; font-size: 13px;">Once approved, we'll begin development immediately</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">5</span>
                                                    <span style="color: #333333; font-size: 13px;">Regular updates and milestone reviews throughout the process</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Contact Information -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                                style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px; text-align: center;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 12px 0;">Need to Reach
                                            Us?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                            width="100%">
                                            <tr>
                                                <td align="center">
                                                    <a href="mailto:hello@digicraft.one"
                                                        style="display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📧
                                                        Email Us</a>
                                                    <a href="https://digicraft.one"
                                                        style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">🌐
                                                        Visit Website</a>
                                                    <a href="tel:+918299797516"
                                                        style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📞
                                                        Call Us</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 13px; margin: 0 0 8px 0;"><strong>DigiCraft</strong> -
                                Transforming
                                Ideas into Digital Reality</p>
                            <p style="color: #666666; font-size: 13px; margin: 0 0 15px 0;">Launch Before You Blink</p>
                            <p style="color: #999999; font-size: 11px; margin: 0;">This email was sent from the
                                DigiCraft contact
                                form and is an automated response. If you have any questions, please don't hesitate to
                                reach out.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;

        // Replace template variables
        const replacements = {
            "{{name}}": data.name,
            "{{email}}": data.email,
            "{{phone}}": data.phone,
            "{{message}}": data.message,
        };

        // Apply all replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            htmlTemplate = htmlTemplate.replace(
                new RegExp(placeholder, "g"),
                value
            );
        });

        return sendEmail({
            to: [{ email: data.email, name: data.name }],
            subject: "Thank You for Your Enquiry - DigiCraft",
            htmlContent: htmlTemplate,
        });
    } catch (error) {
        console.error("Error sending enquiry confirmation email:", error);
        return { success: false, error };
    }
}

export async function sendApplicationConfirmationEmail(data: {
    name: string;
    email: string;
    phone: string;
    role: string;
    primarySkills: string;
    github: string;
    resume: string; // URL
    coverLetter: string; // RAW TEXT (not a link)
}) {
    try {
        let htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Applying – DigiCraft Careers</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); padding: 25px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <img src="https://marketplace.digicraft.one/logo.png" alt="DigiCraft Logo" style="width: 60px; height: 60px; margin-bottom: 15px;">
                                        <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">Thank You for Your Application!</h1>
                                        <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.9;">We're thrilled you're interested in joining DigiCraft</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 25px 20px;">
                            <!-- Welcome Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <h2 style="color: #14b8a6; font-size: 20px; margin: 0 0 10px 0;">Welcome to the DigiCraft Talent Pool!</h2>
                                        <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">Thank you for applying for the <strong>{{role}}</strong> position. We’ve received your application and our team will review it carefully. We appreciate your interest in building something amazing with us!</p>
                                    </td>
                                </tr>
                            </table>
                            <!-- Applicant Details -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 12px 0;">📋 Your Application Summary</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Name</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{name}}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Email</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{email}}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Phone</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{phone}}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Role Applied For</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{role}}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">Primary Skills</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;">{{primarySkills}}</p>
                                                </td>
                                            </tr>
                                            {{#github}}
                                            <tr>
                                                <td style="padding: 10px; background-color: #ffffff; border-radius: 6px; border-left: 4px solid #14b8a6; margin-bottom: 8px;">
                                                    <h4 style="color: #14b8a6; font-size: 11px; font-weight: 600; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px;">GitHub Profile</h4>
                                                    <p style="color: #333333; font-size: 13px; margin: 0; font-weight: 500;"><a href="{{github}}" target="_blank" style="color: #3b82f6; text-decoration: underline;">{{github}}</a></p>
                                                </td>
                                            </tr>
                                            {{/github}}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!-- Documents Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 12px 0;">📄 Submitted Documents</h3>
                                        <ul style="color: #333333; font-size: 13px; margin: 0; padding-left: 20px;">
                                            <li style="margin-bottom: 6px;">Resume: <a href="{{resume}}" target="_blank" style="color: #3b82f6; text-decoration: underline;">View Resume</a></li>
                                            <li style="margin-bottom: 6px;">Cover Letter:</li>
                                        </ul>
                                        <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e9ecef; font-size: 13px; color: #333333; white-space: pre-wrap; font-family: Arial, sans-serif;">
                                            {{coverLetter}}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <!-- Next Steps -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #e3f2fd; border-radius: 8px; border: 1px solid #bbdefb;">
                                <tr>
                                    <td style="padding: 18px;">
                                        <h3 style="color: #1976d2; font-size: 16px; margin: 0 0 12px 0;">What Happens Next?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">1</span>
                                                    <span style="color: #333333; font-size: 13px;">Our team will review your application within 5–7 business days</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">2</span>
                                                    <span style="color: #333333; font-size: 13px;">Shortlisted candidates will be contacted for an interview</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 6px 0;">
                                                    <span style="display: inline-block; width: 18px; height: 18px; background-color: #1976d2; color: white; border-radius: 50%; text-align: center; line-height: 18px; font-size: 11px; font-weight: bold; margin-right: 8px;">3</span>
                                                    <span style="color: #333333; font-size: 13px;">We’ll keep you updated throughout the hiring process</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <!-- Contact Information -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 18px; text-align: center;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 12px 0;">Need to Reach Us?</h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td align="center">
                                                    <a href="mailto:hello@digicraft.one" style="display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📧 Contact Us</a>
                                                    <a href="tel:+918299797516" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500; margin: 4px;">📞 Call Us</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                            <p style="color: #666666; font-size: 13px; margin: 0 0 8px 0;"><strong>DigiCraft</strong> – Building the Future, One Developer at a Time</p>
                            <p style="color: #666666; font-size: 13px; margin: 0 0 15px 0;">Launch Before You Blink</p>
                            <p style="color: #999999; font-size: 11px; margin: 0;">This is an automated confirmation of your job application. If you did not apply, please disregard this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        // Basic replacements
        const replacements: Record<string, string> = {
            "{{name}}": data.name,
            "{{email}}": data.email,
            "{{phone}}": data.phone,
            "{{role}}": data.role,
            "{{primarySkills}}": data.primarySkills,
            "{{github}}": data.github || "",
            "{{resume}}": data.resume,
            "{{coverLetter}}": data.coverLetter, // raw text
        };

        Object.entries(replacements).forEach(([placeholder, value]) => {
            htmlTemplate = htmlTemplate.replace(
                new RegExp(placeholder, "g"),
                value
            );
        });

        // Handle GitHub conditional block
        if (!data.github) {
            const githubBlockRegex = /{{#github}}[\s\S]*?{{\/github}}/g;
            htmlTemplate = htmlTemplate.replace(githubBlockRegex, "");
        } else {
            htmlTemplate = htmlTemplate
                .replace("{{#github}}", "")
                .replace("{{/github}}", "");
        }

        return sendEmail({
            to: [{ email: data.email, name: data.name }],
            subject: `Application Received - ${data.role} at DigiCraft`,
            htmlContent: htmlTemplate,
        });
    } catch (error) {
        console.error("Error sending application confirmation email:", error);
        return { success: false, error };
    }
}
