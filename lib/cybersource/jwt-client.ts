// lib/cybersource/jwt-client.ts
const { CybsJwtClient } = require('@ryankleindev/cybs-jwt-client');
import path from 'path';

const client = new CybsJwtClient({
    runEnvironment: 'apitest.cybersource.com',
    merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
    requestP12: {
        path: path.resolve('./certificate/belarisu_1777926367.p12'),
        password: process.env.CYBERSOURCE_P12_PASSWORD
    },
    responseP12: {
        path: path.resolve('./certificate/belarisu_1777926367.p12'),
        password: process.env.CYBERSOURCE_P12_PASSWORD
    },
    defaultMle: { response: true }
});