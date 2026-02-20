# AvaChat Security Strategy

## 1. Authentication & Wallet
- **Privy**: We use Privy for embedded wallets.
- **Biometrics**: Login should be protected by FaceID/TouchID (to be implemented).
- **Non-Custodial**: Keys are split/sharded; we never see the user's private key.

## 2. Smart Contract Security
- **Audits**: Contracts must be audited before mainnet.
- **Reentrancy**: All external calls must use `ReentrancyGuard`.
- **RBAC**: `Ownable` and AccessControl for admin functions.

## 3. Mini-App Sandboxing
- **WebView Isolation**: Mini-apps run in a WebView.
- **Content Security Policy (CSP)**: Injected into the WebView to prevent malicious scripts.
- **Bridge**: Communication between Mini-App and Host is strictly typed via `postMessage`.

## 4. API Security
- **Rate Limiting**: Protect backend endpoints.
- **Input Validation**: Zod schemas for all inputs.
