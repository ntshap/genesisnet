# ICP Ledger Integration in GenesisNet

GenesisNet now uses the Internet Computer Protocol (ICP) Ledger for all payment transactions, providing a true decentralized payment system for data exchange.

## Overview

The ICP Ledger is a canister (smart contract) on the Internet Computer that maintains the ledger for the ICP utility token. It's the official way to transfer ICP tokens between principals (users, canisters, etc.) on the Internet Computer.

In GenesisNet, we've integrated the ICP Ledger for:

1. Managing user wallet balances
2. Making payments for data services
3. Receiving funds from other sources
4. Tracking transaction history

## Implementation Details

### ICP Ledger Canister

The official ICP Ledger canister (`ryjl3-tyaaa-aaaaa-aaaba-cai`) is used for all transactions. This canister provides the following key functionalities:

- `account_balance`: Query an account's balance
- `transfer`: Transfer ICP from one account to another

### Frontend Integration

The frontend integration consists of:

- `icpLedgerService.js`: Provides the interface to interact with the ICP Ledger canister
- `icpAgent.js`: Integrates the ledger service with our agent system
- Dashboard UI components for displaying wallet balance and transaction history

### Key Functions

1. **Balance Queries**
   - `getWalletBalance()`: Retrieves the current balance from the ICP Ledger
   - Uses `account_balance` query on the ledger canister

2. **Transfers**
   - `initiatePayment(providerId, amountICP, metadata)`: Makes a payment to a data provider
   - Uses `transfer` call on the ledger canister
   - Records transaction with the reputation agent

3. **Transaction History**
   - `getTransactionHistory()`: Retrieves transaction history from the ledger
   - Shows both incoming and outgoing transactions

4. **Wallet Management**
   - Add funds via the Top Up button
   - View detailed transaction history
   - See funding sources and payment history

## Technical Details

### Token Format

ICP tokens use the e8s format (10^8 e8s = 1 ICP). The conversion functions are:

```javascript
// Convert ICP to e8s (smallest unit)
export const icpToE8s = (icp) => {
  return BigInt(Math.floor(icp * 100000000));
};

// Convert e8s to ICP
export const e8sToIcp = (e8s) => {
  return Number(e8s) / 100000000;
};
```

### Transaction Flow

1. **Data Request Flow**:
   - User negotiates with data provider
   - User approves payment of X ICP
   - Frontend calls `initiatePayment(providerId, amount)`
   - Payment is processed via ICP Ledger
   - Data provider verifies payment receipt
   - Data is delivered to the user

2. **Fund Addition Flow**:
   - User clicks "Top Up" in wallet UI
   - User enters amount to add
   - Funds are added to the wallet (in real implementation, this would connect to an exchange or faucet)
   - Transaction is recorded in the ledger
   - Wallet balance updates

## Mock Implementation

For development and testing purposes, we've implemented a mock version that simulates the ICP Ledger behavior. The mock:

1. Maintains a simulated wallet balance
2. Tracks transaction history
3. Simulates transaction fees and processing times
4. Occasionally produces random failures to test error handling

## Future Enhancements

1. **Integration with Real Exchanges**: Allow direct purchase of ICP from exchanges
2. **Subaccounts Support**: Support for multiple subaccounts under a principal
3. **Multi-Signature Transactions**: For enhanced security of large transactions
4. **Transaction Receipt Verification**: Cryptographic verification of transaction receipts
5. **Detailed Transaction Reporting**: Enhanced analytics and reporting on transaction history

---

*Note: This is a simplified implementation for demonstration purposes. A production implementation would include additional security measures and proper account handling.*
