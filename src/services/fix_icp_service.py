import re

# Read the file
with open('icpLedgerService.js', 'r') as f:
    content = f.read()

# Add null check after initialize in getBalance function
pattern = r'(async getBalance\(accountId\) \{[^}]*?await this\.initialize\(\);[^}]*?})'  
replacement = lambda m: m.group(0).replace('    }', '    }\n\n    if (!this.ledgerActor) {\n      throw new Error(" ICP Ledger not available - check network connection\);\n
