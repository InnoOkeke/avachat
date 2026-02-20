# Smart Wallet Integration

## Overview
The Smart Wallet is the core of AvaChat. It is a non-custodial wallet that is controlled by the user's embedded **Privy** signer.

## Architecture
- **Provider**: `SmartAccountProvider.tsx` wraps the app and exposes the `sendTransaction` function.
- **Signer**: The Privy Embedded Wallet is used as the signer one-of-one for the Smart Account (in this MVP, we use the specific embedded wallet directly).
- **Intent Engine**: `TransactionService.ts` parses natural language into structured transaction data.

## Flow
1. User types "Send 1 AVAX to bob".
2. `TransactionService` parses this to `{ type: 'TRANSFER', amount: '1', to: '0x...' }`.
3. `ChatScreen` confirms and calls `sendTransaction`.
4. `SmartAccountProvider` uses the Privy wallet to sign and send the transaction to the network.

## TODO
- Implement full Account Abstraction (ERC-4337) using `permissionless.js` to enable gas sponsorship.
- Connect to the real NestJS backend for AI intent parsing.
