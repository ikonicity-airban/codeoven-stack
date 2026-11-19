---
name: solidity-hardhat
description: Author, test, and deploy production-grade Ethereum/EVM smart contracts using Solidity, Hardhat, and OpenZeppelin. Use when writing smart contracts, auditing vulnerabilities, running Hardhat tests, or managing gas optimization.
---

# Solidity & Hardhat Development Guide

Guide for building, testing, and securing EVM smart contracts using **Solidity (0.8.x+)** and **Hardhat**.

## 1. Security First: Critical Vulnerability Defenses
- **Checks-Effects-Interactions (CEI):** Always validate inputs, update contract state, and perform external calls last to eliminate reentrancy vulnerabilities.
- **Reentrancy Guards:** Use OpenZeppelin's `ReentrancyGuard` (`nonReentrant` modifier) on all state-changing external functions that transfer tokens or ether.
- **Access Control:** Enforce role-based access control (`AccessControl` or `Ownable`) on admin, minting, pausing, and upgrade endpoints.
- **Integer Safety:** Solidity 0.8+ natively reverts on arithmetic overflow/underflow; use `unchecked` blocks only when mathematical overflow is provably impossible.

## 2. Hardhat Project Architecture
```text
contracts/           # Smart contract source files
scripts/deploy.ts    # Deployment and migration scripts
test/                # Unit and integration test suites
hardhat.config.ts    # Networks, compilers, and gas reporter configuration
```

### Example: Production ERC-20 / Staking Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StakingVault is Ownable, ReentrancyGuard {
    IERC20 public immutable stakingToken;
    mapping(address => uint256) public balances;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(IERC20 _token) Ownable(msg.sender) {
        stakingToken = _token;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount; // Effect first
        stakingToken.transfer(msg.sender, amount); // Interaction last
        emit Withdrawn(msg.sender, amount);
    }
}
```

## 3. Testing with Hardhat & Viem/Ethers
Always test happy paths, reversion conditions, and events:
```ts
import { expect } from "chai";
import hre from "hardhat";

describe("StakingVault", function () {
  it("should revert if staking 0 tokens", async function () {
    const vault = await hre.ethers.deployContract("StakingVault", [tokenAddress]);
    await expect(vault.stake(0)).to.be.revertedWith("Cannot stake 0");
  });
});
```
