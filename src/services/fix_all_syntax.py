import re

# Read the file
with open('icpLedgerService.js', 'r') as f:
    content = f.read()

# Fix line 42 - remove duplicate line
content = re.sub(r'const principal = typeof principalId === string \? Principal\.fromText\(principalId\) : p\n\s*const principal = typeof principalId === string \? Principal\.fromText\(principalId\) : principalId;', 
                 'const principal = typeof principalId === 
