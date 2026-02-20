import { createPublicClient, http, formatEther, parseAbi, Address } from 'viem';
import { avalanche } from 'viem/chains';

export interface TokenBalance {
    symbol: string;
    name: string;
    balance: string;
    usdValue: string;
    logo: string;
    change24h?: string;
}

const publicClient = createPublicClient({
    chain: avalanche,
    transport: http('https://api.avax.network/ext/bc/C/rpc')
});

const ERC20_ABI = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
]);

const TOKENS: { [key: string]: { address: Address, name: string, logo: string } } = {
    'USDC': {
        address: '0xB97EF9Ef8734C71904D8ce46b236Ba5b094a1663',
        name: 'USD Coin',
        logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    'USDT': {
        address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4df4a8c7',
        name: 'Tether',
        logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    }
};

export class WalletService {
    /**
     * Fetch real balances for common tokens on Avalanche using viem
     */
    static async getBalances(address: string | null): Promise<TokenBalance[]> {
        // Initialize with default assets at 0 balance
        const results: Map<string, TokenBalance> = new Map();

        // Add default AVAX
        results.set('AVAX', {
            symbol: 'AVAX',
            name: 'Avalanche',
            balance: '0.0000',
            usdValue: '0.00',
            logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
            change24h: '+0.0%'
        });

        // Add default ERC20s
        for (const [symbol, info] of Object.entries(TOKENS)) {
            results.set(symbol, {
                symbol,
                name: info.name,
                balance: '0.00',
                usdValue: '0.00',
                logo: info.logo,
                change24h: '0.0%'
            });
        }

        if (!address || !address.startsWith('0x')) {
            return Array.from(results.values());
        }

        try {
            // 1. Fetch real AVAX Balance
            const avaxBalance = await publicClient.getBalance({ address: address as Address });
            const formattedAvax = formatEther(avaxBalance);
            const avax = results.get('AVAX')!;
            avax.balance = parseFloat(formattedAvax).toFixed(4);
            avax.usdValue = (parseFloat(formattedAvax) * 40).toFixed(2); // Mock price $40
            avax.change24h = '+2.3%'; // Mock

            // 2. Fetch real ERC20 Balances
            for (const [symbol, info] of Object.entries(TOKENS)) {
                try {
                    const balance = await publicClient.readContract({
                        address: info.address,
                        abi: ERC20_ABI,
                        functionName: 'balanceOf',
                        args: [address as Address]
                    });

                    const decimals = await publicClient.readContract({
                        address: info.address,
                        abi: ERC20_ABI,
                        functionName: 'decimals'
                    });

                    const formatted = (Number(balance) / Math.pow(10, decimals)).toFixed(2);
                    const token = results.get(symbol)!;
                    token.balance = formatted;
                    token.usdValue = formatted; // $1 for stables
                } catch (e) {
                    // Fallback to 0 handled by initialization
                }
            }
        } catch (error) {
            console.error("WalletService fetch error:", error);
        }

        return Array.from(results.values());
    }

    /**
     * Resolve username or email to an Avalanche address
     */
    static async resolveSocialIdentifier(identifier: string): Promise<{ address: string, username: string, avatar?: string } | null> {
        // In a real production app with Privy backend set up:
        // You would call your NestJS backend which uses Privy Server SDK to search users

        const cleanId = identifier.toLowerCase().replace('@', '');

        // Mocking resolution because searching Privy users requires server-side API keys
        if (cleanId === 'vitalik' || cleanId === 'vitalik.eth') {
            return {
                address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
                username: 'vitalik.eth',
                avatar: 'https://gateway.pinata.cloud/ipfs/Qmd8jFz6o2nKovfXhK4N0gKzQoR4KofzG7q0fD6k7o0fD6'
            };
        }

        return null;
    }

    /**
     * Simulate a yield earning interaction
     */
    static async executeYieldStrategy(token: string, amount: string): Promise<string> {
        // This would involve a viem contract.write call
        await new Promise(resolve => setTimeout(resolve, 3000));
        return "0x" + Math.random().toString(16).slice(2, 66);
    }
}
