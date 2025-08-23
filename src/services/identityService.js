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
      
      // Different ways to create identity based on what's stored
      if (identityData.type === 'seed') {
        // Create identity from seed
        const seed = hexToSeed(identityData.seed);
        this.identity = Ed25519KeyIdentity.fromSecretKey(seed);
      } else if (identityData.key) {
        // Legacy format - direct key
        this.identity = Ed25519KeyIdentity.fromJSON(identityData.key);
      } else {
        // Unknown format, create new
        throw new Error('Unknown identity format');
      }
      
      // Set up principal and account info
      this.principal = this.identity.getPrincipal();
      this.accountId = mockPrincipalToAccountIdentifier(this.principal);
      this.accountIdHex = mockAccountIdToHex(this.accountId);
      
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
      
      // Create the identity from seed
      this.identity = Ed25519KeyIdentity.fromSecretKey(seed);
      
      // Set up principal and account info
      this.principal = this.identity.getPrincipal();
      this.accountId = mockPrincipalToAccountIdentifier(this.principal);
      this.accountIdHex = mockAccountIdToHex(this.accountId);
      
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
   * Get the current principal ID
   * @returns {Principal} Principal ID
   */
  getPrincipal() {
    return this.principal;
  }

  /**
   * Get the principal ID as text
   * @returns {string} Principal ID text
   */
  getPrincipalText() {
    return this.principal ? this.principal.toText() : '';
  }

  /**
   * Get the account ID
   * @returns {Uint8Array} Account ID
   */
  getAccountId() {
    return this.accountId;
  }

  /**
   * Get the account ID as hex string
   * @returns {string} Account ID hex
   */
  getAccountIdHex() {
    return this.accountIdHex;
  }

  /**
   * Get the current identity
   * @returns {Ed25519KeyIdentity} Identity
   */
  getIdentity() {
    return this.identity;
  }

  /**
   * Clear the current identity (logout)
   * @returns {void}
   */
  clearIdentity() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.identity = null;
    this.principal = null;
    this.accountId = null;
    this.accountIdHex = null;
    this.isInitialized = false;
  }
}

// Export a singleton instance
export const identityService = new IdentityService();

export default identityService;
