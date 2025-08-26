#!/bin/bash

# Add null check to getBalance function
sed -i '/async getBalance(accountId) {/,/try {/ {
  /try {/i\
    if (!this.ledgerActor) {\
      throw new Error(" ICP Ledger not available - check network connection\);\
