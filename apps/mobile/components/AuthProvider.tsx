import { PrivyProvider } from '@privy-io/expo';
import React from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Note: Expo requires the EXPO_PUBLIC_ prefix for env vars to be available on the client
    const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID || '';
    const clientId = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID || '';

    if (!appId) {
        console.error('Privy App ID is missing. Please ensure EXPO_PUBLIC_PRIVY_APP_ID is set in your .env file.');
    }

    return (
        <PrivyProvider
            appId={appId}
            clientId={clientId}
            config={{
                embedded: {
                    ethereum: {
                        createOnLogin: 'all-users',
                    }
                }
            }}
        >
            {children}
        </PrivyProvider>
    );
};
