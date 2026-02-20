# AvaChat PRD - Conversational Finance Layer on Avalanche

## 1. Product Overview
**AvaChat** is a conversational finance protocol built on Avalanche that enables users to execute blockchain transactions via natural language commands. It abstracts away complex wallet interactions into simple chat interfaces, leveraging AI for intent parsing and Avalanche for instant finality.

### Core Value Proposition
- **No Complex UI**: Transactions occur via chat (e.g., "Send 5 USDC to Alice").
- **Speed**: Utilizing Avalanche's sub-second finality.
- **Smart Accounts**: Non-custodial smart contract wallets for every user.
- **Social DeFi**: Group savings, Chat command yield earn on assets with rebalancing across prootocols, Automatic save and earn (set and forget auto deduction saving and earn), bill splitting, and conditional payments natively in chat.

---

## 2. Technical Architecture

### 2.1 Smart Contract Layer (Avalanche C-Chain)
- **Smart Wallet Factory**: Deploys deterministic conversational wallets (likely ERC-4337 Account Abstraction compatible) for users.
- **AvaChatCore**: Main entry point for trusted intent executors.
- **Treasury/Escrow Contracts**: Logic for group savings, time-locks, and multi-sig operations.
- **Registry**: Maps social identifiers (e.g., handles/phone numbers) to smart wallet addresses.

### 2.2 Backend AI Intent Engine
- **Intent Parser**: NLP model (LLM based) to convert "Send 10 AVAX" -> Structured Transaction Call.
- **Transaction Builder**: Constructs the raw transaction data for the user's smart wallet.
- **Relayer**: Submits transactions on behalf of users (gasless/sponsored via Paymaster) or returns call data for user signing.

### 2.3 Frontend "Super App" Interface
- **Interface**: A native mobile application built with **React Native (Expo)**. It functions as a complete "Super App" with native navigation and gestures.
- **Features**:
    - **Chat Tab**: core conversational finance flow.

    - **Apps Tab**: Full-screen browser for 3rd party Mini-Apps (Games, DeFi, Tools).
    - **Wallet Tab**: Asset dashboard and reputation score view.


---

### 3. Features & User Stories

#### 3.1 Onboarding & Identity
- **User Story**: "As a user, I want a wallet that connects to my social identity."
- **Implementation**: **Privy** for seamless email/phone login.
   - User logs in via Privy -> Generates Embedded Wallet (Signer) -> Deploys/Connects to `AvaChat Smart Account`.

#### 3.2 Advanced Conversational Transactions
- **Basic**: `Send 20 USDC to @david` (Instant settlement).
- **Advanced**: `Split ₦20,000 dinner bill with @alice, @bob, and @charlie` (Creates ad-hoc split contract).

#### 3.3 Rotating Savings (ROSCA/Esusu) - *The "Wow" Factor*
- **User Story**: "As a community, we want a trusted, automated rotating savings circle."
- **Command**: `Create a rotating savings group with 5 people. 50 USDC weekly. Auto distribute.`
- **Flow**:
    1. AI parses intent -> Deploys `RotatingSavings.sol`.
    2. Members accept invites via chat.
    3. Contract auto-pulls funds (via approved allowance) or prompts payment weekly.
    4. Contract auto-distributes the pot to the winner of the week securely.

#### 3.4 Yield & Auto-Save (Set & Forget)
- **Yield Command**: `Earn yield on my idle USDC` -> Moves funds to Aave/Benqi integrator contract.
- **Auto-Save Command**: `Save 10% of all incoming deposits to my Vault` -> Installs a **Smart Account Module** (Hook) that splits incoming transfers automatically.
- **Rebalance**: `Find best yield for USDT` -> AI checks Aave vs Curve vs Benqi -> Executes swap & supply.

#### 3.5 Conditional & Future Payments
- **Command**: `Send 100 AVAX to @developer when task #402 is done` (Oracle integration) or `Lock 100 USDC for @son until 18th birthday`.
- **Gasless**: All transactions are sponsored via Paymaster or paid in stablecoins, removing the need for AVAX gas for end users.

#### 3.6 Reputation & Credit Scoring
- **Concept**: Users build on-chain credit scores based on their ROSCA contribution history and savings consistency.
- **Utility**: Higher scores unlock lower fees or under-collateralized loans (future roadmap).

#### 3.7 Token Launchpad (Clanker / Pump.fun Style)
- **Command**: `Create token "MoonDog" "MDOG"`
- **Mechanism**: **Bonding Curve**.
    1. Users buy/sell token on a mathematical curve (low initial price).
    2. **Graduation**: Once market cap hits ~$69k (or configured threshold), the bonding curve stops.
    3. **Migration**: All liquidity from the curve is automatically deposited into a **TraderJoe/Uniswap V3** pool and burned/locked forever.
    4. **Safety**: No rug pulls possible during curve phase; liquidity is guaranteed upon graduation.

#### 3.8 Mini-App Platform (The "WeChat" Strategy)
- **User Story**: "As a developer, I want to build a prediction market or game that runs inside AvaChat."
- **Implementation**:
    - **AvaChat SDK**: A lightweight NPM package for 3rd party apps (`@avachat/sdk`).
    - **Standalone Mini-Apps**: Apps launch as dedicated full-screen pages (like MiniPay or Base builds), not cluttered inside chat bubbles.
    - **Discovery**: A dedicated "Apps" tab to browse games, yield optimizers, and tools.
    - **Wallet Injection**: Standard `window.ethereum` injection for seamless connection to the user's AvaChat Smart Account.



---


---

## 4. Security Architecture (Priority #1)

### 4.1 Smart Contract Security
- **Module Whitelisting**: The Smart Wallet will only allow execution from whitelisted modules (e.g., `RotatingSavings`, `YieldRouter`) to prevent unauthorized logic.
- **Spending Limits**: Users can set daily/weekly spending caps that require 2FA or social recovery to override.
- **Reentrancy Guards**: All treasury and savings contracts must implement strict non-reentrant logic.

### 4.2 Mini-App Sandboxing
- **Permission Model**: Mini-Apps cannot execute transactions without explicit user confirmation via the host AvaChat UI.
- **Origin Verification**: The SDK will verify the origin of all `postMessage` requests to prevent XSS attacks.

### 4.3 Backend & AI Safety
- **Intent Verification**: The AI parser output is *never* trusted blindly. It is presented to the user for signing.
- **Rate Limiting**: Strict API rate limits to prevent DDoS on the Relayer.

---

## 5. Monetization
- **Protocol Fee**: 0.2-0.5% on simplified transactions (configurable in contract).
- **Premium Features**: Advanced AI scheduling, complex treasury tools.

## 6. Roadmap
1. **MVP**: Smart Wallet Factory + parsing "Send" commands.
2. **V1**: Group Treasuries + Split Bill.
3. **V2**: Mini-App Platform (SDK + Store).

