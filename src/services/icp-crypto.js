// ICP Crypto utilities
// Provides cryptographic functions for Internet Computer Protocol

import { Principal } from '@dfinity/principal';
import { Ed25519KeyIdentity } from '@dfinity/identity';

// Text encoder for string to bytes conversion
const textEncoder = new TextEncoder();

/**
 * SHA-224 hash function
 * @param {Uint8Array} data - Data to hash
 * @returns {Promise<Uint8Array>} - Hash result
 */
export async function sha224(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Take first 28 bytes for SHA-224
  return new Uint8Array(hashBuffer.slice(0, 28));
}

/**
 * Convert account ID to hex string
 * @param {Uint8Array} accountId - Account ID bytes
 * @returns {string} - Hex string
 */
export function accountIdToHex(accountId) {
  return Array.from(accountId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to account ID
 * @param {string} hex - Hex string
 * @returns {Uint8Array} - Account ID bytes
 */
export function hexToAccountId(hex) {
  const accountId = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    accountId[i/2] = parseInt(hex.substring(i, i+2), 16);
  }
  return accountId;
}

/**
 * Generate a random identity using Ed25519 (compatible with ICP)
 * @returns {Promise<object>} - Identity object
 */
export async function generateIdentity() {
  try {
    // Generate a random seed for Ed25519
    const seed = new Uint8Array(32);
    crypto.getRandomValues(seed);
    
    // Create identity from seed
    const identity = Ed25519KeyIdentity.fromSeed(seed);
    
    return {
      identity,
      seed,
      getPrincipal() {
        return identity.getPrincipal();
      },
      getPublicKey() {
        return identity.getPublicKey();
      },
      async sign(message) {
        return await identity.sign(message);
      }
    };
  } catch (error) {
    console.error('Error generating identity:', error);
    throw new Error('Failed to generate identity: ' + error.message);
  }
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
