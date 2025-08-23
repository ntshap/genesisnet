# ICP Wallet User Guide

## Introduction

The GenesisNet platform now features an integrated ICP wallet, allowing you to manage your Internet Computer Protocol tokens directly within the application. This guide explains how to use the wallet features to manage your funds, view transaction history, and make payments for data services.

## Accessing Your Wallet

You can access your ICP wallet by clicking on the wallet button in the top navigation bar. This button displays your current ICP balance and opens the wallet interface when clicked.

## Wallet Features

### 1. View Balance

Your current ICP balance is displayed prominently at the top of the wallet interface. This balance reflects the amount of ICP tokens available for you to use on the platform.

### 2. View Principal ID

Your unique Principal ID is displayed below your balance. This ID is your identity on the Internet Computer and serves as your wallet address. Others can use this ID to send you ICP tokens.

### 3. Add Funds

To add funds to your wallet:

1. Click the "Top Up" button in the wallet interface
2. Enter the amount of ICP you wish to add
3. Confirm the transaction

Note: In a production environment, this would connect to an exchange or other funding source. In the current implementation, this simulates adding funds for demonstration purposes.

### 4. View Funding History

The "Funding History" tab shows all sources of incoming funds to your wallet, including:
- Initial grants
- Referral bonuses
- Staking rewards
- Manual deposits
- Other funding sources

Each entry includes:
- Source of funds
- Amount
- Description
- Date and time
- Transaction hash

### 5. View Transaction History

The "Transaction History" tab displays all ICP Ledger transactions associated with your wallet, including:
- Incoming transfers (received ICP)
- Outgoing transfers (sent ICP)
- Transaction fees
- Block height
- Timestamps
- Transaction memos

### 6. Make Payments

When you use GenesisNet to purchase data from providers, payments are processed through the ICP Ledger. The transaction will:
1. Deduct the payment amount from your wallet balance
2. Transfer the ICP tokens to the data provider's principal ID
3. Record the transaction in your history
4. Update your wallet balance

## Security Considerations

- Your Principal ID is your unique identifier on the Internet Computer. Do not share this with untrusted parties.
- All transactions on the ICP Ledger are permanent and cannot be reversed.
- Keep track of your transaction history to monitor your wallet activity.

## Technical Details

- ICP tokens are divisible to 8 decimal places (e8s format)
- Standard transaction fee is 0.0001 ICP
- Transactions are confirmed on the Internet Computer blockchain
- Each transaction has a unique block height and timestamp

## Troubleshooting

If you encounter issues with your wallet:
- Check your connection to the Internet Computer network
- Verify that you have sufficient balance for transactions (including fees)
- Review your transaction history for any unexpected activity
- Contact support if you need assistance

---

*This wallet implementation demonstrates how GenesisNet integrates with the Internet Computer Protocol for decentralized payments.*
