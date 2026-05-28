// types/cybersource.d.ts
interface CybersourcePaymentConfig {
    captureContext: string;
    onSuccess: (data: { transactionId: string }) => void;
    onError: (error: { message: string }) => void;
    onCancel: () => void;
    onLoad: () => void;
}

interface CybersourceWindow {
    Payment: new (config: CybersourcePaymentConfig) => {
        render: (element: HTMLElement) => void;
    };
}

// types/cybersource.d.ts

declare global {
    interface Window {
        Vas: {
            UnifiedCheckout: (captureContext: string) => Promise<{
                createCheckout: (options?: { autoProcessing?: boolean }) => Promise<{
                    mount: (container: HTMLElement | string) => Promise<{ transactionId?: string }>;
                    unmount: () => void;
                    destroy: () => void;
                }>;
                destroy: () => void;
            }>;
        };
    }
}

export {};
