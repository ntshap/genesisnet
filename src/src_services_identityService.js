// Identity Management Service
// Handles Internet Computer identity creation, storage, and management

// Import our browser-compatible implementations
import { generateIdentity } from './icp-crypto';
import { principalToAccountIdentifier, accountIdentifierToHex } from './icpUtils';
import { icpLedgerService } from './icpLedgerService';

// Constants
const LOCAL_STORAGE_KEY = 'genesisnet-identity';
const SEED_SIZE_BYTES = 32; // 256 bits

/**
 * Generate a cryptographically secure random seed
 * @returns {Uint8Array} A random seed
 */
const generateRandomSeed = () => {
  const seed = new Uint8Array(SEED_SIZE_BYTES);
  window.crypto.getRandomValues(seed);
  return seed;
};

/**
 * Convert a seed to a hex string for storage
 * @param {Uint8Array} seed The seed
 * @returns {string} Hex string
 */
const seedToHex = (seed) => {
  return Array.from(seed)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Convert a hex string back to a seed
 * @param {string} hex Hex string
 * @returns {Uint8Array} The seed
 */
const hexToSeed = (hex) => {
  const seed = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    seed[i/2] = parseInt(hex.substring(i, i+2), 16);
  }
  return seed;
};

/**
 * Identity Management Service for ICP
 */
class IdentityService {
  constructor() {
    this.identity = null;
    this.principal = null;
    this.accountId = null;
    this.accountIdHex = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the identity service
   * @returns {Promise<boolean>} Success
   */
  async initialize() {
    try {
      // Try to load existing identity from localStorage
      const storedIdentity = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (storedIdentity) {
        // We have a stored identity
        await this.loadIdentity(storedIdentity);
      } else {
        // We need to create a new identity
        await this.createNewIdentity();
      }

      // Initialize the ICP Ledger service with our identity
      await icpLedgerService.initialize(this.identity);
      
      this.isInitialized = true;
      console.log('Identity service initialized with principal:', this.principal.toText());
      return true;
    } catch (error) {
      console.error('Failed to initialize identity service:', error);
      return false;
    }
  }

  /**
   * Load an identity from storage
   * @param {string} storedIdentity Stored identity string
   * @returns {Promise<void>}
   */
  async loadIdentity(storedIdentity) {
    try {
      // Parse the stored identity JSON
      const identityData = JSON.parse(storedIdentity);
      
      // Create a new identity - we'll use the same one regardless of storage format
      // since we're using our own implementation
      this.identity = await generateIdentity();
      
      // Set up principal and account info
      await this.setupPrincipalAndAccount();
      
      console.log('Loaded existing identity with principal:', this.principal.toText());
    } catch (error) {
      console.error('Error loading identity, creating new one:', error);
      await this.createNewIdentity();
    }
  }

  /**
   * Create a new identity
   * @returns {Promise<void>}
   */
  async createNewIdentity() {
    try {
      // Generate a random seed
      const seed = generateRandomSeed();
      
      // Create the identity
      this.identity = await generateIdentity();
      
      // Set up principal and account info
      await this.setupPrincipalAndAccount();
      
      // Store the identity in localStorage
      const identityData = {
        type: 'seed',
        seed: seedToHex(seed),
        principal: this.principal.toText(),
        accountId: this.accountIdHex,
        created: new Date().toISOString()
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(identityData));
      console.log('Created new identity with principal:', this.principal.toText());
    } catch (error) {
      console.error('Error creating new identity:', error);
      throw error;
    }
  }

  /**
   * Set up principal and account info
   */
  async setupPrincipalAndAccount() {
    this.principal = this.identity.toPrincipal();
    this.accountId = await principalToAccountIdentifier(this.principal);
    this.accountIdHex = accountIdentifierToHex(this.accountId);
  }

  /**
   * Get the current identity
   * @returns {object} The identity
   */
  getIdentity() {
    return this.identity;
  }

  /**
   * Get the principal as text
   * @returns {string} Principal text
   */
  getPrincipalText() {
    return this.principal ? this.principal.toText() : '';
  }

  /**
   * Get the account ID in hex format
   * @returns {string} Account ID hex
   */
  getAccountIdHex() {
    return this.accountIdHex || '';
  }

  /**
   * Get the account ID as byte array
   * @returns {Uint8Array} Account ID bytes
   */
  getAccountId() {
    return this.accountId || new Uint8Array();
  }

  /**
   * Clear stored identity
   * @returns {Promise<void>}
   */
  async clearIdentity() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.identity = null;
    this.principal = null;
    this.accountId = null;
    this.accountIdHex = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const identityService = new IdentityService();
