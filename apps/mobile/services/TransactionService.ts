// This service calls the NestJS backend's AI Intent Engine.
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export interface parsedIntent {
    type: 'TRANSFER' | 'SWAP' | 'STAKE' | 'UNKNOWN';
    params: any;
    rawTransaction?: any;
    description: string;
}

export const TransactionService = {
    parseIntent: async (text: string): Promise<parsedIntent> => {
        try {
            const response = await fetch(`${API_URL}/intent/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            const data = await response.json();

            return {
                ...data,
                description: data.type === 'TRANSFER'
                    ? `Sending ${data.params.amount} to ${data.params.to}`
                    : data.type === 'SWAP'
                        ? `Swapping ${data.params.fromToken} for ${data.params.toToken}`
                        : "I didn't understand that command."
            };
        } catch (error) {
            console.error('Backend parse error:', error);
            return {
                type: 'UNKNOWN',
                params: {},
                description: "I'm having trouble connecting to my brain right now."
            };
        }
    },

    processNaturalLanguage: async (text: string, address: string | null): Promise<string> => {
        const intent = await TransactionService.parseIntent(text);
        if (intent.type === 'TRANSFER') {
            return `I've prepared a transaction to ${intent.description}. Please confirm in your wallet.`;
        }
        if (intent.type === 'SWAP') {
            return `I've prepared a swap for ${intent.description}. Ready to proceed?`;
        }
        return intent.description;
    }
};
