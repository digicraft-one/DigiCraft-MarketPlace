import { NextRequest, NextResponse } from "next/server";
import { testBrevoConfiguration } from "@/lib/email/brevo";

export async function GET(req: NextRequest) {
    try {
        console.log("🧪 Testing email configuration...");
        const result = await testBrevoConfiguration();
        
        if (result.success) {
            return NextResponse.json({ 
                success: true, 
                message: "Email configuration is working correctly!",
                data: result.data 
            });
        } else {
            return NextResponse.json({ 
                success: false, 
                message: "Email configuration failed",
                error: result.error 
            }, { status: 500 });
        }
    } catch (error) {
        console.error("❌ Test endpoint error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Test failed",
            error: error 
        }, { status: 500 });
    }
} 