#!/bin/bash
cp icpLedgerService.js icpLedgerService_backup.js
sed '/async getBalance(accountId) {/,/try {/ {
  /try {/i\
    if (!this.ledgerActor) {\
      throw new Error(" ICP Ledger not available - check network connection\);\
