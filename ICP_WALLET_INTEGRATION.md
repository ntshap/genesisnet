# GenesisNet ICP Wallet Integration

This document explains how the ICP wallet integration works in GenesisNet and provides technical details about its implementation.

## Overview

GenesisNet uses the Internet Computer Protocol (ICP) as its primary currency for payments between Data Requester Agents and Data Provider Agents. The wallet system allows users to manage their ICP tokens, view funding history, and track payments for data transactions.

## Key Components

### 1. Token Economy

- **ICP Tokens**: The primary currency used for payments
- **Cycles**: Converted from ICP and used as "fuel" for canister operations
- **Transaction Records**: All payments are recorded on the ICP blockchain

### 2. Wallet Features

- **Balance Display**: Shows current ICP balance
- **Funding History**: Records sources of ICP funding
- **Payment History**: Tracks payments made to data providers
- **Pending Transactions**: Indicates transactions awaiting confirmation

### 3. Implementation

#### Frontend Components

- **Wallet Button**: Shows current balance and opens wallet history modal
- **Wallet Modal**: Displays detailed balance, funding history, and payment information
- **Transaction Notifications**: Alerts users about successful or failed transactions

#### Backend Integration

- **Data Requester Agent**: Manages ICP balance and makes payments
- **Data Provider Agent**: Receives and validates ICP payments
- **Reputation Agent**: Records transactions on the blockchain and updates reputation scores

## Transaction Flow

1. **Funding the Wallet**: Users deposit ICP tokens into their Data Requester Agent canister
2. **Cycles Conversion**: A portion of ICP tokens is converted to cycles for canister operation
3. **Data Negotiation**: Data Requester Agent negotiates with Data Provider Agents
4. **Payment Processing**: After agreement, tokens are transferred directly through ICP smart contracts
5. **Transaction Recording**: Reputation Agent records the transaction details and updates scores

## Technical Implementation

### ICP Integration

```javascript
// Example of how payments are processed in the Data Requester Agent

async function makePayment(providerPrincipal, amount) {
  // Verify sufficient balance
  if (this.balance < amount) {
    throw new Error("Insufficient funds");
  }
  
  // Create payment transaction
  const result = await this.ledger.transfer({
    to: providerPrincipal,
    amount: { e8s: amount * 100000000 }, // Convert to e8s units
    memo: Date.now(),
    fee: { e8s: 10000 },
  });
  
  // Process result
  if (result.Ok) {
    this.balance -= amount;
    return {
      success: true,
      blockHeight: result.Ok,
      transactionId: `${result.Ok}-${Date.now()}`
    };
  } else {
    throw new Error(`Payment failed: ${JSON.stringify(result.Err)}`);
  }
}
```

### Wallet UI Logic

The wallet UI in the Dashboard component handles:
- Displaying the current balance
- Showing funding sources with amounts and timestamps
- Managing the transaction history display
- Providing notifications about transaction statuses

## Usage Guidelines

### For Users

1. **Adding Funds**: Transfer ICP to your agent address
2. **Monitoring Balance**: Check your wallet balance before making data requests
3. **Payment Verification**: Verify transaction records after data purchases

### For Developers

1. **Backend Integration**: Connect to ICP ledger canister
2. **Error Handling**: Handle payment failures gracefully
3. **Transaction Monitoring**: Implement reliable confirmation system
4. **User Feedback**: Provide clear notifications about transaction status

## Troubleshooting

### Common Issues

- **Transaction Pending**: ICP network congestion may delay confirmations
- **Balance Discrepancy**: Refresh wallet data if balance doesn't match expected amount
- **Failed Payments**: Check error logs for specific payment failure reasons

## Future Enhancements

- **Multiple Token Support**: Adding support for other cryptocurrencies
- **Batch Transactions**: Optimizing for lower fees with batched payments
- **Automated Funding**: Setting up recurring deposits or auto-funding options
- **Payment Plans**: Implementing subscription models for regular data access
