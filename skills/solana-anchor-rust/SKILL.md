---
name: solana-anchor-rust
description: Develop secure Solana on-chain programs using Rust and the Anchor framework. Use when writing Solana programs, PDA derivation, account validation, CPI calls, or building TypeScript client tests.
---

# Solana & Anchor Rust Development Guide

The standard framework for authoring high-throughput, secure Solana programs in Rust using **Anchor**.

## 1. Core Architecture & Account Validation
- **Account Validation:** Always annotate structs with `#[derive(Accounts)]`.
- **Type Cosplaying Defense:** Use Anchor's `#[account]` macro to enforce automatic 8-byte discriminator validation on all stored state.
- **PDA Verification:** Derive and validate Program Derived Addresses (PDAs) with explicit seeds and canonical bumps:
```rust
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod token_vault {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, vault_name: String) -> Result<()> {
        let vault = &mut ctx.accounts.vault_account;
        vault.owner = ctx.accounts.authority.key();
        vault.vault_name = vault_name;
        vault.bump = ctx.bumps.vault_account;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(vault_name: String)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + (4 + 32) + 1,
        seeds = [b"vault", authority.key().as_ref(), vault_name.as_bytes()],
        bump
    )]
    pub vault_account: Account<'info, VaultData>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VaultData {
    pub owner: Pubkey,
    pub vault_name: String,
    pub bump: u8,
}
```

## 2. Safe Math & Cross-Program Invocations (CPI)
- **Math Safety:** Always use checked math (`checked_add`, `checked_sub`, `checked_mul`) or Anchor constraints to prevent integer overflows.
- **CPI Calls:** Use `CpiContext` and `anchor_spl::token` to execute safe SPL token transfers.
