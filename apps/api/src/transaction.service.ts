import { Injectable } from '@nestjs/common';
import { encodeFunctionData, parseAbi, parseEther } from 'viem';

@Injectable()
export class TransactionService {
    private readonly ERC20_ABI = parseAbi([
        'function transfer(address to, uint256 amount) returns (bool)',
    ]);

    buildTransfer(to: string, amount: string, tokenAddress?: string) {
        if (!tokenAddress) {
            // Native AVAX transfer
            return {
                to,
                data: '0x',
                value: parseEther(amount).toString(),
            };
        }

        // ERC20 transfer
        const data = encodeFunctionData({
            abi: this.ERC20_ABI,
            functionName: 'transfer',
            args: [to as `0x${string}`, parseEther(amount)],
        });

        return {
            to: tokenAddress,
            data,
            value: '0',
        };
    }
}
