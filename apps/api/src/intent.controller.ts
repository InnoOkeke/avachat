import { Controller, Post, Body } from '@nestjs/common';
import { ParseIntentDto, IntentResponse } from './intent.dto';
import { TransactionService } from './transaction.service';

@Controller('intent')
export class IntentController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post('parse')
    async parseIntent(@Body() dto: ParseIntentDto): Promise<IntentResponse> {
        const prompt = dto.prompt.toLowerCase();

        // Simple regex-based logic for MVP/V1
        // In V2, this will be replaced by a proper LLM call (OpenAI/Anthropic)

        if (prompt.includes('send') || prompt.includes('transfer')) {
            const amountMatch = prompt.match(/(\d+(\.\d+)?)/);
            const amount = amountMatch ? amountMatch[0] : '0';

            // Mock resolution for demo purposes
            let targetAddress = '0x1234567890123456789012345678901234567890';
            if (prompt.includes('vitalik')) {
                targetAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
            }

            const tx = this.transactionService.buildTransfer(targetAddress, amount);

            return {
                type: 'TRANSFER',
                params: { to: targetAddress, amount },
                rawTransaction: tx,
            };
        }

        return {
            type: 'UNKNOWN',
            params: {},
        };
    }
}
