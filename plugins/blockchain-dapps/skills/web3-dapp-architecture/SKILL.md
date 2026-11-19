---
name: web3-dapp-architecture
description: Architect and integrate frontend Web3 dApps with multi-wallet connectors, Wagmi, Viem, and Solana Web3.js. Use when implementing wallet auth, smart contract hooks, transaction status tracking, and RPC management.
---

# Web3 dApp Frontend Architecture Guide

Best practices for connecting modern React/Next.js frontends to EVM and Solana blockchains.

## 1. EVM Frontend Stack (Wagmi + Viem + RainbowKit)
- Use **Wagmi v2** hooks for type-safe interaction with ABI definitions.
- Use **Viem** for lightweight, performant low-level client operations.
- Handle transaction confirmation lifecycles (`idle` -> `preparing` -> `prompting signature` -> `confirming on-chain` -> `success` / `reverted`).

## 2. Solana Frontend Stack (@solana/wallet-adapter)
- Wrap application with `ConnectionProvider` and `WalletProvider`.
- Use `useAnchorWallet` and `useConnection` to build signed Anchor client transactions.
- Handle RPC rate limits and auto-retries using custom RPC providers (Helius, QuickNode, Alchemy).
