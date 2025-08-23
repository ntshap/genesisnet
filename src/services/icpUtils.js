// ICP Utils
// Utility functions for working with Internet Computer Protocol

import { 
  principalToAccountIdentifier as cryptoPrincipalToAccountId,
  accountIdToHex,
  hexToAccountId,
  icpToE8s,
  e8sToIcp,
  SUB_ACCOUNT_ZERO,
  ACCOUNT_DOMAIN_SEPARATOR,
  ICP_LEDGER_CANISTER_ID
} from './icp-crypto';

// Export constants
export { SUB_ACCOUNT_ZERO, ACCOUNT_DOMAIN_SEPARATOR, ICP_LEDGER_CANISTER_ID };

/**
 * Convert a principal to an account identifier
 * @param {object} principal - The principal to convert
 * @param {Uint8Array} subAccount - The subaccount, defaults to 0
 * @returns {Promise<Uint8Array>} - The account identifier
 */
export async function principalToAccountIdentifier(principal, subAccount = SUB_ACCOUNT_ZERO) {
  return await cryptoPrincipalToAccountId(principal, subAccount);
}

/**
 * Convert an account identifier to a hex string
 * @param {Uint8Array} accountId - The account identifier
 * @returns {string} - The account identifier as a hex string
 */
export function accountIdentifierToHex(accountId) {
  return accountIdToHex(accountId);
}

/**
 * Convert a hex string to an account identifier
 * @param {string} hex - The account identifier as a hex string
 * @returns {Uint8Array} - The account identifier
 */
export function stringToAccountIdentifier(hex) {
  return hexToAccountId(hex);
}

/**
 * AccountIdentifier class with static methods for creating and handling account IDs
 */
export class AccountIdentifier {
  /**
   * Create an account identifier from a principal
   * @param {object} params - Parameters
   * @param {object} params.principal - The principal
   * @param {Uint8Array} [params.subAccount] - The subaccount (optional)
   * @returns {Promise<Uint8Array>} - The account identifier
   */
  static async fromPrincipal({ principal, subAccount = SUB_ACCOUNT_ZERO }) {
    return await principalToAccountIdentifier(principal, subAccount);
  }

  /**
   * Create an account identifier from a hex string
   * @param {string} hex - The hex string
   * @returns {Uint8Array} - The account identifier
   */
  static fromHex(hex) {
    return hexToAccountId(hex);
  }
}

// Helper to convert ICP to e8s (smallest unit)
export { icpToE8s };

// Helper to convert e8s to ICP
export { e8sToIcp };
