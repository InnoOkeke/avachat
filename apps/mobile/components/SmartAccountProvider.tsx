import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, useEmbeddedWallet } from '@privy-io/expo';

interface SmartAccountContextType {
    smartAccountAddress: string | null;
    sendTransaction: (to: string, value: string, data?: string) => Promise<string>;
    isLoading: boolean;
}

const SmartAccountContext = createContext<SmartAccountContextType>({
    smartAccountAddress: null,
    sendTransaction: async () => '',
    isLoading: false,
});

export const useSmartAccount = () => useContext(SmartAccountContext);

export const SmartAccountProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = usePrivy();
    const wallet = useEmbeddedWallet();
    const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (wallet?.status === 'connected' && (wallet as any).wallet?.address) {
            setSmartAccountAddress((wallet as any).wallet.address);
        } else if (user?.linked_accounts) {
            // Fallback to searching linked accounts if the specific hook is still syncing
            const walletAccount = user.linked_accounts.find(a => a.type === 'wallet' || (a as any).address);
            if (walletAccount && (walletAccount as any).address) {
                setSmartAccountAddress((walletAccount as any).address);
            }
        }
    }, [wallet, user]);

    const sendTransaction = async (to: string, value: string, data: string = '0x') => {
        if (!wallet || wallet.status !== 'connected') throw new Error("No wallet connected");
        setIsLoading(true);
        try {
            const provider = await wallet.getProvider();
            const w = wallet as any;
            const hash = await provider.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: w.address,
                    to,
                    value,
                    data
                }]
            });
            return hash;
        } catch (error) {
            console.error("Tx failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SmartAccountContext.Provider value={{ smartAccountAddress, sendTransaction, isLoading }}>
            {children}
        </SmartAccountContext.Provider>
    );
};
