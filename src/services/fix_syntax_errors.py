import re

# Read the file
with open('icpLedgerService.js', 'r') as f:
    content = f.read()

# Fix all problematic console.warn and console.log statements
# Pattern 1: \Attempt \ failed:\
pattern1 = r'console\.warn\(\\Attempt \\ failed:\\\);'
replacement1 = 'console.warn(Attempt failed:);'
content = re.sub(pattern1, replacement1, content)

# Pattern 2: \Retrying in \ms...\
pattern2 = r'console\.log\(\\Retrying in \\\$\{delay\}ms\.\.\.\\\);'
replacement2 = 'console.log(Retrying in ms...);'
content = re.sub(pattern2, replacement2, content)

# Pattern 3: \Balance fetched successfully: \
pattern3 = r'console\.log\(\\Balance fetched successfully: \\\$\{balance\}\\\);'
replacement3 = 'console.log(Balance fetched successfully: );'
content = re.sub(pattern3, replacement3, content)

# Write the fixed content back
with open('icpLedgerService.js', 'w') as f:
    f.write(content)

print('Fixed syntax errors in icpLedgerService.js')
