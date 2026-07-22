// components/cybersource/UnifiedCheckout.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface UnifiedCheckoutProps {
    amount: number;
    captureContext: string;
    clientLibrary: string;
    clientLibraryIntegrity: string;
    onSuccess: (transactionId: string) => void;
    onError: (error: string) => void;
    onCancel: () => void;
}

declare global {
    interface Window {
        VAS?: {
            UnifiedCheckout: (sessionJWT: string) => Promise<{
                createCheckout: (options?: { autoProcessing?: boolean }) => Promise<{
                    mount: (selector: string | HTMLElement) => Promise<{ transactionId?: string }>;
                    unmount: () => void;
                    destroy: () => void;
                }>;
                destroy: () => void;
            }>;
        };
    }
}

export function UnifiedCheckout({
    amount,
    captureContext,
    clientLibrary,
    clientLibraryIntegrity,
    onSuccess,
    onError,
    onCancel
}: UnifiedCheckoutProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [containerReady, setContainerReady] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);
    const containerId = 'cybersource-payment-container'; // Use ID for more reliable mounting

    // Step 1: Load the SDK script
    // useEffect(() => {
    //     if (!clientLibrary || initializedRef.current) return;

    //     console.log('Loading SDK from:', clientLibrary);
        
    //     if (window?.VAS?.UnifiedCheckout) {
    //         console.log('SDK already loaded');
    //         setSdkLoaded(true);
    //         return;
    //     }

    //     const script = document.createElement('script');
    //     script.src = clientLibrary;
    //     if (clientLibraryIntegrity) {
    //         script.integrity = clientLibraryIntegrity;
    //         script.crossOrigin = 'anonymous';
    //     }
    //     script.async = true;
        
    //     script.onload = () => {
    //         console.log('SDK script loaded successfully');
    //         setTimeout(() => {
    //             setSdkLoaded(true);
    //         }, 200);
    //     };
        
    //     script.onerror = (err) => {
    //         console.error('Failed to load SDK:', err);
    //         setError('Failed to load payment system. Please refresh and try again.');
    //         setIsLoading(false);
    //         onError('SDK load failed');
    //     };
        
    //     document.head.appendChild(script);
        
    //     return () => {
    //         if (script.parentNode) {
    //             script.parentNode.removeChild(script);
    //         }
    //     };
    // }, [clientLibrary, clientLibraryIntegrity]);
    useEffect(() => {
    if (!clientLibrary || initializedRef.current) return;

    // Get nonce from meta tag
    const getNonce = () => {
        const meta = document.querySelector('meta[property="csp-nonce"]');
        return meta ? meta.getAttribute('content') : null;
    };
    
    const nonce = getNonce();

    console.log('Loading SDK from:', clientLibrary);
    
    if (window?.VAS?.UnifiedCheckout) {
        console.log('SDK already loaded');
        setSdkLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.src = clientLibrary;
    if (clientLibraryIntegrity) {
        script.integrity = clientLibraryIntegrity;
        script.crossOrigin = 'anonymous';
    }
    
    // // ✅ ADD THIS: Set nonce on the script tag
    // if (nonce) {
    //     script.nonce = nonce;
    // }
    
    script.async = true;
    
    script.onload = () => {
        console.log('SDK script loaded successfully');
        setTimeout(() => {
            setSdkLoaded(true);
        }, 200);
    };
    
    script.onerror = (err) => {
        console.error('Failed to load SDK:', err);
        setError('Failed to load payment system. Please refresh and try again.');
        setIsLoading(false);
        onError('SDK load failed');
    };
    
    document.head.appendChild(script);
    
    return () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    };
}, [clientLibrary, clientLibraryIntegrity]);

    // Step 2: Mark container as ready after render
    useEffect(() => {
        if (containerRef.current) {
            console.log('Container element is ready');
            setContainerReady(true);
        }
    }, []);

    // Step 3: Initialize checkout once SDK is loaded AND container is ready
    useEffect(() => {
        if (!sdkLoaded || !containerReady || !window.VAS?.UnifiedCheckout || initializedRef.current) return;
        
        const initCheckout = async () => {
            try {
                initializedRef.current = true;
                console.log('Initializing Unified Checkout...');
                console.log('Capture context length:', captureContext.length);
                
                // Wait an additional moment for the container to be fully rendered
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Verify container exists in DOM
                const container = document.getElementById(containerId);
                if (!container) {
                    throw new Error(`Container #${containerId} not found in DOM`);
                }
                
                console.log('Container found in DOM:', container);
                
                // Initialize the SDK
                const client = await window?.VAS?.UnifiedCheckout(captureContext);
                console.log('Client created successfully');
                
                // Create checkout with autoProcessing
                const checkout = await client?.createCheckout({ autoProcessing: true });
                console.log('Checkout created successfully');
                
                // Mount using string selector (more reliable than ref)
                console.log('Mounting to container:', `#${containerId}`);
                const result = await checkout?.mount(`#${containerId}`);
                console.log('Mount result:', result);
                
                if (result?.transactionId) {
                    console.log('Payment completed:', result.transactionId);
                    onSuccess(result.transactionId);
                }
                
                setIsLoading(false);
                
            } catch (err) {
                console.error('Checkout initialization error:', err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
                setError(errorMessage);
                onError(errorMessage);
                setIsLoading(false);
                initializedRef.current = false;
            }
        };
        
        initCheckout();
        
        return () => {
            if (initializedRef.current) {
                console.log('Cleaning up checkout...');
            }
        };
    }, [sdkLoaded, containerReady, captureContext, onSuccess, onError]);

    const handleCancel = () => {
        onCancel();
    };

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h3 className="font-semibold text-lg">Secure Payment</h3>
                    <p className="text-sm text-gray-500">
                        Amount: <span className="font-bold">${amount.toFixed(2)}</span>
                    </p>
                </div>
                <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                >
                    Cancel
                </button>
            </div>
            
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-500">Loading secure payment form...</span>
                </div>
            )}
            
            {/* Container with ID - MUST exist before mount() is called */}
            <div 
                id={containerId}
                ref={containerRef}
                className="w-full"
                style={{ minHeight: '400px', display: isLoading ? 'none' : 'block' }}
            />
        </div>
    );
}