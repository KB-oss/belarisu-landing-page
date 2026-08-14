// app/api/cybersource/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

const { createHeaders } = require('cybersource-auth');

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'USD' } = await req.json();
        const merchantId = process.env.CYBERSOURCE_MERCHANT_ID!;
        const apiKey = process.env.CYBERSOURCE_API_KEY!;
        const secretKey = process.env.CYBERSOURCE_SECRET_KEY!;
        const host = 'apitest.cybersource.com';

        const targetOrigin = process.env.NEXT_PUBLIC_CYBER_SOURCE_APP_URL
        const formattedAmount = amount.toFixed(2);

        // const requestBody = {
        //     targetOrigins: [targetOrigin?.toString()],
        //     clientVersion: "1.0",
        //     allowedCardNetworks: ["VISA", "MASTERCARD"],
        //     allowedPaymentTypes: ["PANENTRY"],
        //     country: "US",
        //     locale: "en_US",
        //     captureMandate: {
        //         billingType: "FULL",
        //         requestEmail: true,
        //         requestPhone: false,
        //         requestShipping: false,
        //         showAcceptedNetworkIcons: true
        //     },
        //     data: {
        //         orderInformation: {
        //             amountDetails: {
        //                 totalAmount: formattedAmount,
        //                 currency: currency
        //             }
        //         }
        //     }
        // };

        const requestBody = {
            targetOrigins: [targetOrigin?.toString()],
            clientVersion: "1.0",
            allowedCardNetworks: ["VISA", "MASTERCARD"],
            allowedPaymentTypes: ["PANENTRY"],
            country: "US",
            locale: "en_US",
            captureMandate: {
                billingType: "FULL",
                requestEmail: true,
                requestPhone: true,
                requestShipping: true,
                showAcceptedNetworkIcons: true
            },
            data: {
                clientReferenceInformation: {
                    code: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`
                },
                orderInformation: {
                    amountDetails: {
                        totalAmount: formattedAmount,
                        currency: currency
                    },
                    billTo: {
                        firstName: "John",
                        lastName: "Doe",
                        email: "john.doe@example.com",
                        phoneNumber: "4158880000",
                        address1: "1 Market St",
                        locality: "San Francisco",
                        administrativeArea: "CA",
                        postalCode: "94105",
                        country: "US"
                    },
                    shipTo: {
                        firstName: "John",
                        lastName: "Doe",
                        address1: "1 Market St",
                        locality: "San Francisco",
                        administrativeArea: "CA",
                        postalCode: "94105",
                        country: "US"
                    }
                }
            }
        };

        const jsonString = JSON.stringify(requestBody);
        const resourcePath = '/uc/v1/sessions';
        const method = 'POST';

        const headers = createHeaders(
            merchantId,
            host,
            method,
            resourcePath,
            jsonString,
            apiKey,
            secretKey
        );

        const response = await fetch(`https://${host}${resourcePath}`, {
            method: method,
            headers: headers,
            body: jsonString
        });

        if (response.status === 201 || response.status === 200) {
            // Get the capture context JWT
            const captureContext = await response.text();

            // Decode the JWT to extract clientLibrary and clientLibraryIntegrity
            const decoded = decodeJWT(captureContext);

            console.log('Decoded JWT payload:', JSON.stringify(decoded, null, 2));

            // Extract clientLibrary and clientLibraryIntegrity from the decoded payload
            // The structure may vary - check the logs to see where these values are
            let clientLibrary = '';
            let clientLibraryIntegrity = '';

            // Try different possible paths in the decoded JWT
            if (decoded?.data?.clientLibrary) {
                clientLibrary = decoded.data.clientLibrary;
                clientLibraryIntegrity = decoded.data.clientLibraryIntegrity || '';
            } else if (decoded?.clientLibrary) {
                clientLibrary = decoded.clientLibrary;
                clientLibraryIntegrity = decoded.clientLibraryIntegrity || '';
            } else if (decoded?.ctx?.[0]?.data?.clientLibrary) {
                clientLibrary = decoded.ctx[0].data.clientLibrary;
                clientLibraryIntegrity = decoded.ctx[0].data.clientLibraryIntegrity || '';
            }

            console.log('Extracted clientLibrary:', clientLibrary);
            console.log('Extracted clientLibraryIntegrity:', clientLibraryIntegrity);

            return NextResponse.json({
                success: true,
                captureContext: captureContext,
                clientLibrary: clientLibrary,
                clientLibraryIntegrity: clientLibraryIntegrity
            });
        }

        const text = await response.text();
        try {
            const errorData = JSON.parse(text);
            return NextResponse.json(
                { error: errorData.message || 'Failed to create session', details: errorData.errors },
                { status: response.status }
            );
        } catch {
            return NextResponse.json(
                { error: 'Session creation failed', rawResponse: text.substring(0, 200) },
                { status: response.status }
            );
        }

    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to decode JWT without verification
function decodeJWT(token: string): any {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        // Decode the payload (second part)
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to decode JWT:', e);
        return null;
    }
}