with open('icpLedgerService.js', 'r') as f:
    lines = f.readlines()

modified_lines = []
for i, line in enumerate(lines):
    modified_lines.append(line)
    if 'await this.initialize();' in line and i > 0 and 'getBalance' in lines[i-2]:
        modified_lines.append('\n')
        modified_lines.append('    if (!this.ledgerActor) {\n')
        modified_lines.append('      throw new Error(" ICP Ledger not available - check network connection\);\n')
