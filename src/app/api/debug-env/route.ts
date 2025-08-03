import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const fromName = process.env.EMAIL_FROM_NAME;
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        
        // Check API key format (without exposing the full key)
        const apiKeyInfo = {
            exists: !!apiKey,
            length: apiKey?.length || 0,
            startsWithXkeysib: apiKey?.startsWith('xkeysib-') || false,
            firstChars: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set',
            lastChars: apiKey ? `...${apiKey.substring(apiKey.length - 4)}` : 'Not set'
        };

        return NextResponse.json({
            success: true,
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                apiKey: apiKeyInfo,
                fromName: {
                    exists: !!fromName,
                    value: fromName || 'Not set'
                },
                fromAddress: {
                    exists: !!fromAddress,
                    value: fromAddress || 'Not set'
                }
            },
            recommendations: {
                apiKeyType: apiKeyInfo.startsWithXkeysib ? '✅ Correct SMTP API key format' : '❌ Should start with xkeysib-',
                senderEmail: fromAddress ? '✅ Sender email configured' : '❌ EMAIL_FROM_ADDRESS not set',
                senderName: fromName ? '✅ Sender name configured' : '❌ EMAIL_FROM_NAME not set'
            }
        });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error 
        }, { status: 500 });
    }
} 