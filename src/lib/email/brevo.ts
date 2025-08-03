import * as SibApiV3Sdk from "@getbrevo/brevo";

// Check if API key is available
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
    console.error("❌ BREVO_API_KEY environment variable is not set!");
    console.error("Please add BREVO_API_KEY=your_api_key to your .env.local file");
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
            console.error("❌ Cannot send email: EMAIL_FROM_ADDRESS or EMAIL_FROM_NAME not configured");
            return { success: false, error: "Sender email not configured" };
        }

        console.log("📧 Attempting to send email...");
        console.log("📤 From:", process.env.EMAIL_FROM_NAME, process.env.EMAIL_FROM_ADDRESS);
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
        console.error("Message:", error.response?.data?.message || error.message);
        console.error("Error Details:", error.response?.data);
        console.error("Full error:", error);
        
        // Provide more specific error messages
        if (error.response?.status === 401) {
            console.error("🔑 401 Unauthorized - Possible issues:");
            console.error("1. Wrong API key type (need SMTP API key, not REST API key)");
            console.error("2. API key is invalid or expired");
            console.error("3. Sender email not verified in Brevo");
            console.error("4. Account suspended or billing issues");
        } else if (error.response?.status === 400) {
            console.error("📝 400 Bad Request - Check:");
            console.error("1. Email format and sender configuration");
            console.error("2. Sender email is verified");
            console.error("3. Recipient email format");
        } else if (error.response?.status === 403) {
            console.error("🚫 403 Forbidden - API key may not have email sending permissions");
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
    console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ Set" : "❌ Missing");
    console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME ? "✅ Set" : "❌ Missing");
    console.log("EMAIL_FROM_ADDRESS:", process.env.EMAIL_FROM_ADDRESS ? "✅ Set" : "❌ Missing");
    
    if (!process.env.BREVO_API_KEY) {
        console.log("❌ BREVO_API_KEY is missing!");
        return { success: false, error: "API key not configured" };
    }
    
    // Test with a simple email
    try {
        const testResult = await sendEmail({
            to: [{ email: "test@example.com", name: "Test User" }],
            subject: "Brevo Configuration Test",
            htmlContent: "<h1>Test Email</h1><p>This is a test email to verify Brevo configuration.</p>"
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
        // Hardcoded HTML template
        let htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting DigiCraft</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #e2e8f0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(20, 184, 166, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }

        .logo {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.933);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo img {
            width: 100px;
            height: 100px;
            object-fit: contain;
        }

        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 40px 30px;
        }

        .welcome-section {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome-section h2 {
            color: #14b8a6;
            font-size: 24px;
            margin-bottom: 15px;
        }

        .welcome-section p {
            color: #94a3b8;
            font-size: 16px;
            line-height: 1.6;
        }

        .application-card {
            background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
            border: 2px solid rgba(20, 184, 166, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            backdrop-filter: blur(10px);
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .app-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            margin-right: 12px;
        }

        .app-details h3 {
            color: #f1f5f9;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .app-details p {
            color: #94a3b8;
            font-size: 13px;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .detail-item {
            background: linear-gradient(135deg, #475569 0%, #334155 100%);
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #14b8a6;
            border: 1px solid rgba(20, 184, 166, 0.1);
        }

        .detail-item h4 {
            color: #14b8a6;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .detail-item p {
            color: #e2e8f0;
            font-size: 13px;
            font-weight: 500;
        }

        .customization-section {
            background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }

        .customization-section h3 {
            color: #fbbf24;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .customization-section h3::before {
            content: "🎨";
            margin-right: 10px;
            font-size: 20px;
        }

        .customization-list {
            list-style: none;
        }

        .customization-list li {
            color: #fef3c7;
            font-size: 14px;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }

        .customization-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #059669;
            font-weight: bold;
        }

        .next-steps {
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            border: 2px solid #64748b;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }

        .next-steps h3 {
            color: #cbd5e1;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }

        .steps-list {
            list-style: none;
            counter-reset: step-counter;
        }

        .steps-list li {
            color: #dbeafe;
            font-size: 14px;
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }

        .steps-list li::before {
            content: counter(step-counter);
            counter-increment: step-counter;
            position: absolute;
            left: 0;
            top: 0;
            background: #3b82f6;
            color: white;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }

        .contact-info {
            background: linear-gradient(135deg, #334155 0%, #475569 100%);
            border: 1px solid rgba(20, 184, 166, 0.1);
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            backdrop-filter: blur(10px);
        }

        .contact-info h3 {
            color: #f1f5f9;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .contact-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .contact-link {
            display: inline-flex;
            align-items: center;
            padding: 10px 20px;
            background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            transition: transform 0.2s ease;
        }

        .contact-link:hover {
            transform: translateY(-2px);
        }

        .footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #94a3b8;
            text-align: center;
            padding: 30px;
            font-size: 14px;
            border-top: 1px solid rgba(20, 184, 166, 0.1);
        }

        .footer p {
            margin-bottom: 10px;
        }

        .social-links {
            margin-top: 20px;
        }

        .social-links a {
            color: #94a3b8;
            text-decoration: none;
            margin: 0 10px;
            font-size: 16px;
        }

        .social-links a:hover {
            color: #14b8a6;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 12px;
            }

            .header,
            .content {
                padding: 25px 20px;
            }

            .details-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .contact-links {
                flex-direction: column;
                align-items: center;
            }

            .contact-link {
                width: 100%;
                max-width: 200px;
                justify-content: center;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo"><img src="https://marketplace.digicraft.one/logo.svg" alt="DigiCraft Logo" /></div>
            <h1>Thank You for Reaching Out!</h1>
            <p>We're excited to work with you on your digital project</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Welcome Section -->
            <div class="welcome-section">
                <h2>Welcome to DigiCraft!</h2>
                <p>Thank you for choosing us for your digital needs. We've received your inquiry and our team is already
                    reviewing your requirements. We're committed to bringing your vision to life with our expertise and
                    creativity.</p>

                <div class="message-section"
                    style="margin-top: 20px; padding: 20px; background: rgba(20, 184, 166, 0.1); border-radius: 12px; border: 1px solid rgba(20, 184, 166, 0.2);">
                    <h4 style="color: #14b8a6; margin-bottom: 10px; font-size: 16px;">Customer Message:</h4>
                    <p style="color: #e2e8f0; font-style: italic; line-height: 1.6;">{{message}}</p>
                </div>
            </div>

            <!-- Application Card -->
            <div class="application-card">
                <div class="card-header">
                    <div class="app-icon">🛒</div>
                    <div class="app-details">
                        <h3>{{productTitle}}</h3>
                        <p>{{productDescription}}</p>
                    </div>
                </div>

                <div class="details-grid">
                    <div class="detail-item">
                        <h4>Selected Plan</h4>
                        <p>{{adjustmentType}} Plan</p>
                    </div>
                    <div class="detail-item">
                        <h4>Customer Name</h4>
                        <p>{{name}}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Email</h4>
                        <p>{{email}}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Phone</h4>
                        <p>{{phone}}</p>
                    </div>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>What Happens Next?</h3>
                <ul class="steps-list">
                    <li>Our team will review your requirements within 24 hours</li>
                    <li>We'll schedule a consultation call to discuss details</li>
                    <li>You'll receive a detailed project proposal and timeline</li>
                    <li>Once approved, we'll begin development immediately</li>
                    <li>Regular updates and milestone reviews throughout the process</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3>Need to Reach Us?</h3>
                <div class="contact-links">
                    <a href="mailto:hello@digicraft.one" class="contact-link">📧 Email Us</a>
                    <a href="https://digicraft.one" class="contact-link">🌐 Visit Website</a>
                    <a href="tel:+1234567890" class="contact-link">📞 Call Us</a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>DigiCraft <sub></sub></strong> - Transforming Ideas into Digital Reality</p>
            <p>Launch Before You Blink</p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                This email was sent from the DigiCraft contact form and is an automated response. If you have any
                questions, please don't hesitate to reach out.
            </p>
        </div>
    </div>
</body>

</html>`;

        // Replace template variables
        const replacements = {
            '{{name}}': data.name,
            '{{email}}': data.email,
            '{{phone}}': data.phone,
            '{{message}}': data.message,
            '{{productTitle}}': data.productTitle,
            '{{productDescription}}': data.productDescription,
            '{{adjustmentType}}': data.adjustmentType
        };

        // Apply all replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, 'g'), value);
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

// export async function sendAdminNotificationEmail(data: EnquiryEmailData) {
//     try {
//         const adminEmail = process.env.ADMIN_EMAIL;
//         if (!adminEmail) {
//             console.error("ADMIN_EMAIL environment variable not set");
//             return { success: false, error: "Admin email not configured" };
//         }

//         const htmlContent = `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//                 <h2 style="color: #14b8a6;">New Enquiry Received</h2>
//                 <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                     <h3>Customer Details:</h3>
//                     <p><strong>Name:</strong> ${data.name}</p>
//                     <p><strong>Email:</strong> ${data.email}</p>
//                     <p><strong>Phone:</strong> ${data.phone}</p>
//                     <p><strong>Message:</strong> ${data.message}</p>
//                 </div>
//                 <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                     <h3>Product Details:</h3>
//                     <p><strong>Product:</strong> ${data.productTitle}</p>
//                     <p><strong>Description:</strong> ${data.productDescription}</p>
//                     <p><strong>Plan:</strong> ${data.adjustmentType}</p>
//                 </div>
//                 <p style="color: #666; font-size: 14px;">
//                     This enquiry was submitted through the DigiCraft marketplace contact form.
//                 </p>
//             </div>
//         `;

//         return sendEmail({
//             to: [{ email: adminEmail, name: "DigiCraft Admin" }],
//             subject: `New Enquiry: ${data.name} - ${data.productTitle}`,
//             htmlContent: htmlContent,
//         });
//     } catch (error) {
//         console.error("Error sending admin notification email:", error);
//         return { success: false, error };
//     }
// }
