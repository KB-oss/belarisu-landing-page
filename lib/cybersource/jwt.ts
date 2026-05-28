// lib/cybersource/jwt.ts
import jwt from 'jsonwebtoken';

export function generateJwtToken(requestBody: object, requestMethod: string, requestPath: string): string {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = now + 300; // 5 minutes
    
    const payload = {
        iss: process.env.CYBERSOURCE_API_KEY,
        exp: expiresIn,
        nbf: now,
        iat: now,
        merchant_id: process.env.CYBERSOURCE_MERCHANT_ID,
        request: {
            method: requestMethod,
            path: requestPath,
            body: JSON.stringify(requestBody)
        }
    };
    
    const token = jwt.sign(payload, process.env.CYBERSOURCE_SECRET_KEY!, {
        algorithm: 'RS256',
        header: {
            kid: process.env.CYBERSOURCE_API_KEY,
            alg: 'RS256',
            typ: 'JWT'
        }
    });
    
    return token;
}