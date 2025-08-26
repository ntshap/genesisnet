import { Principal } from '@dfinity/principal';
import { sha224 } from 'js-sha256';

// Constants
export const ACCOUNT_DOMAIN_SEPARATOR = '\x0Aaccount-id';
export const SUB_ACCOUNT_ZERO = new Uint8Array(32);

/**
 * Convert a Principal to an Account Identifier
 * @param {Principal} principal The principal
 * @param {Uint8Array} subAccount Sub-account (optional, defaults to zero)
 * @returns {Uint8Array} Account identifier
 */
export const principalToAccountIdentifier = (principal, subAccount = SUB_ACCOUNT_ZERO) => {
  const principalBytes = principal.toUint8Array();
  const accountIdBytes = new Uint8Array(4 + principalBytes.length + 32);

  // Add domain separator
  const domainSeparatorBytes = new TextEncoder().encode(ACCOUNT_DOMAIN_SEPARATOR);       
  accountIdBytes.set(domainSeparatorBytes.slice(0, 4), 0);

  // Add principal bytes
  accountIdBytes.set(principalBytes, 4);

  // Add sub-account
  accountIdBytes.set(subAccount, 4 + principalBytes.length);

  // Hash with SHA-224
  const hash = sha224.array(accountIdBytes);

  // Add checksum (first 4 bytes of hash)
  const checksum = hash.slice(0, 4);
  const accountId = new Uint8Array(32);
  accountId.set(checksum, 0);
  accountId.set(hash.slice(4), 4);

  return accountId;
};

/**
 * Convert an Account Identifier to hex string
 * @param {Uint8Array} accountId Account identifier
 * @returns {string} Hex string
 */
export const accountIdentifierToHex = (accountId) => {
  return Array.from(accountId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Convert hex string to Account Identifier
 * @param {string} hex Hex string
 * @returns {Uint8Array} Account identifier
 */
export const hexToAccountIdentifier = (hex) => {
  const accountId = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    accountId[i/2] = parseInt(hex.substring(i, i+2), 16);
  }
  return accountId;
};

/**
 * Validate an Account Identifier
 * @param {Uint8Array} accountId Account identifier
 * @returns {boolean} Is valid
 */
export const validateAccountIdentifier = (accountId) => {
  if (!accountId || accountId.length !== 32) {
    return false;
  }

  // Extract checksum and hash
  const checksum = accountId.slice(0, 4);
  const hash = accountId.slice(4);

  // Recalculate checksum
  const fullHash = new Uint8Array(28);
  fullHash.set(hash, 0);
  const calculatedChecksum = sha224.array(fullHash).slice(0, 4);

  // Compare checksums
  return checksum.every((byte, index) => byte === calculatedChecksum[index]);
};

// Export constants and functions needed by icpLedgerService
export const ICP_LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

export const accountIdToHex = (accountId) => {
  return Array.from(accountId, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const hexToAccountId = (hex) => {
  const bytes = hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
  return new Uint8Array(bytes);
};

export const icpToE8s = (icp) => {
  return BigInt(Math.round(icp * 100000000));
};

export const e8sToIcp = (e8s) => {
  return Number(e8s) / 100000000;
};
