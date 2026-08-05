// app/api/cybersource/generate-webhook-key/route.ts
import { NextRequest, NextResponse } from 'next/server';

const { createHeaders } = require('cybersource-auth');

export async function POST(req: NextRequest) {
    try {
        // Your credentials
        const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
        const apiKeyId = process.env.CYBERSOURCE_API_KEY!;
        const apiSecret = process.env.CYBERSOURCE_SECRET_KEY!;
        const host = 'apitest.cybersource.com';
        const resourcePath = '/kms/egress/v2/keys-sym';

        // Request body
        const requestBody = {
            clientRequestAction: "CREATE",
            keyInformation: {
                provider: "nrtd",
                tenant: merchantId,
                keyType: "sharedSecret",
                organizationId: merchantId
            }
        };

        const bodyString = JSON.stringify(requestBody);

        // ✅ Use createHeaders() - handles everything!
        const headers = createHeaders(
            merchantId,
            host,
            "POST",
            resourcePath,
            bodyString,
            apiKeyId,
            apiSecret
        );

        console.log('📤 Generating webhook digital signature key...');

        // Make the request
        const response = await fetch(`https://${host}${resourcePath}`, {
            method: 'POST',
            headers: headers,
            body: bodyString
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Failed to generate webhook key:', data);
            return NextResponse.json(
                {
                    success: false,
                    error: data.message || 'Failed to generate webhook key',
                    details: data
                },
                { status: response.status }
            );
        }

        // Extract the webhook secret
        const webhookKeyId = data.keyInformation?.keyId;
        const webhookSecret = data.keyInformation?.key;

        console.log('✅ Webhook digital signature key generated successfully!');
        console.log(`Key ID: ${webhookKeyId}`);
        console.log(`Secret: ${webhookSecret}`);

        return NextResponse.json({
            success: true,
            message: 'Webhook digital signature key generated successfully. Save these values immediately!',
            keyId: webhookKeyId,
            secret: webhookSecret,
            warning: 'Save the secret value now. Cybersource does not store it and it cannot be retrieved later.'
        });

    } catch (error) {
        console.error('❌ Error generating webhook key:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}