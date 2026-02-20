export class ParseIntentDto {
    prompt: string;
}

export interface IntentResponse {
    type: 'TRANSFER' | 'SWAP' | 'STAKE' | 'UNKNOWN';
    params: {
        to?: string;
        amount?: string;
        token?: string;
        fromToken?: string;
        toToken?: string;
    };
    rawTransaction?: {
        to: string;
        data: string;
        value: string;
    };
}
