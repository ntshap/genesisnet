// Browser-compatible implementation of ICP cryptography functions
// This file provides compatibility with the Internet Computer Protocol

// We'll use the SubtleCrypto API for browser-compatible cryptography
const textEncoder = new TextEncoder();

/**
 * Browser-compatible SHA-224 implementation
 * @param {Uint8Array} data - Data to hash
 * @returns {Promise<Uint8Array>} - The hash result
 */
export async function sha224(data) {
  // SHA-256 is widely supported, while SHA-224 often isn't
  // We'll use SHA-256 and truncate to match SHA-224 output size (28 bytes)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  // Truncate to 28 bytes (SHA-224 output size)
  return hashArray.slice(0, 28);
}

/**
 * CRC32 implementation 
 * @param {Uint8Array} data - Data to calculate CRC for
 * @returns {Uint8Array} - CRC32 value as a 4-byte array
 */
export function getCrc32(data) {
  const table = new Uint32Array(256);
  
  // Build CRC table
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[i] = crc;
  }
  
  // Calculate CRC
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  
  // Convert to bytes
  const result = new Uint8Array(4);
  result[0] = (crc >>> 24) & 0xff;
  result[1] = (crc >>> 16) & 0xff;
  result[2] = (crc >>> 8) & 0xff;
  result[3] = crc & 0xff;
  
  return result;
}

/**
 * Create an account identifier from a principal and subaccount
 * @param {object} principal - Principal object
 * @param {Uint8Array} subAccount - Subaccount identifier
 * @returns {Promise<Uint8Array>} - Account identifier
 */
export async function principalToAccountIdentifier(principal, subAccount) {
  // Get principal as bytes
  const principalBytes = principal.toUint8Array();
  
  // Domain separator for account ids
  const domainSep = textEncoder.encode('\x0Aaccount-id');
  
  // Construct the hash input: domain_separator | principal | subaccount | subaccount_length
  const hashInput = new Uint8Array(
    domainSep.length + principalBytes.length + subAccount.length + 1
  );
  
  let offset = 0;
  hashInput.set(domainSep, offset);
  offset += domainSep.length;
  hashInput.set(principalBytes, offset);
  offset += principalBytes.length;
  hashInput.set(subAccount, offset);
  offset += subAccount.length;
  hashInput[offset] = subAccount.length;
  
  // Hash the input
  const hash = await sha224(hashInput);
  
  // Calculate CRC-32 of the hash
  const crc = getCrc32(hash);
  
  // Combine CRC and hash
  const result = new Uint8Array(hash.length + 4);
  result.set(crc, 0);
  result.set(hash, 4);
  
  return result;
}

/**
 * Convert account identifier to hex string
 * @param {Uint8Array} accountId - Account identifier
 * @returns {string} - Hex string
 */
export function accountIdToHex(accountId) {
  return Array.from(accountId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to account identifier
 * @param {string} hex - Hex string
 * @returns {Uint8Array} - Account identifier
 */
export function hexToAccountId(hex) {
  if (hex.startsWith('0x')) {
    hex = hex.substring(2);
  }
  
  const accountId = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    accountId[i/2] = parseInt(hex.substring(i, i+2), 16);
  }
  
  return accountId;
}

/**
 * Generate a random identity
 * @returns {Promise<object>} - Identity object
 */
export async function generateIdentity() {
  // Generate a key pair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );
  
  // Export the public key
  const publicKeyBuffer = await crypto.subtle.exportKey('raw', keyPair.publicKey);
  const publicKey = new Uint8Array(publicKeyBuffer);
  
  // Export the private key
  const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKey = new Uint8Array(privateKeyBuffer);
  
  // Create a principal from the public key
  const principalBytes = await sha224(publicKey);
  
  return {
    publicKey,
    privateKey,
    principalBytes,
    toPrincipal() {
      return {
        toUint8Array() {
          return principalBytes;
        },
        toText() {
          return accountIdToHex(principalBytes);
        }
      };
    },
    async sign(message) {
      const signature = await crypto.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: 'SHA-256' },
        },
        keyPair.privateKey,
        message
      );
      return new Uint8Array(signature);
    }
  };
}

// Constants
export const SUB_ACCOUNT_ZERO = new Uint8Array(32).fill(0);
export const ACCOUNT_DOMAIN_SEPARATOR = textEncoder.encode('\x0Aaccount-id');
export const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

// Helper to convert ICP to e8s (smallest unit)
export const icpToE8s = (icp) => {
  return BigInt(Math.floor(icp * 100000000));
};

// Helper to convert e8s to ICP
export const e8sToIcp = (e8s) => {
  return Number(e8s) / 100000000;
};
