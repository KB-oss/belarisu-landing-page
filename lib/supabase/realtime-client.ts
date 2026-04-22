// lib/supabase/realtime-client.ts
import { createClient } from '@/lib/supabase/client';
import { Notification } from '@/app/(protected)/actions/notification';

const supabase = createClient();

export function subscribeToNotifications(
    onNotification: (notification: Notification) => void
): () => void {
    let channel: any = null;
    
    const setupSubscription = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('No user found, cannot subscribe to notifications');
            return;
        }

        console.log('🔌 Setting up WebSocket connection for user:', user.id);

        // THIS IS THE CRITICAL PART - Creates the WebSocket connection
        channel = supabase
            .channel(`notifications-${user.id}`)  // Unique channel per user
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log('📨 WEBSOCKET RECEIVED NEW NOTIFICATION!', payload);
                    const newNotification = payload.new as Notification;
                    onNotification(newNotification);
                }
            )
            .subscribe((status) => {
                console.log('WebSocket connection status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ WebSocket connected! Real-time notifications active.');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ WebSocket failed to connect');
                }
            });
    };

    setupSubscription();

    // Return unsubscribe function to close WebSocket
    return () => {
        console.log('🔌 Closing WebSocket connection');
        if (channel) {
            supabase.removeChannel(channel);
        }
    };
}