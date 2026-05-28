// lib/cybersource/config.js
const config = {
    authenticationType: "http_signature",
    merchantID: process.env.CYBERSOURCE_MERCHANT_ID,
    merchantKeyId: process.env.CYBERSOURCE_API_KEY,
    merchantsecretKey: process.env.CYBERSOURCE_SECRET_KEY,
    runEnvironment: "apitest.cybersource.com",
    enableLog: true,
    logDirectory: "./log",
    logMaximumSize: 10485760,
    logFilename: "cybs"
};

export default config;