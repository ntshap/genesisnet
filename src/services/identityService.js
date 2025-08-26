import { Principal } from '@dfinity/principal';
import { HttpAgent, Actor } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { generateIdentity } from './icp-crypto';
import { principalToAccountIdentifier, accountIdentifierToHex } from './icpUtils';

// Constants
const LOCAL_STORAGE_KEY = 'genesisnet-identity';
const SEED_SIZE_BYTES = 32; // 256 bits

/**
 * Generate a cryptographically secure random seed
 * @returns {Uint8Array} A random seed
 */
const generateRandomSeed = () => {
  const seed = new Uint8Array(SEED_SIZE_BYTES);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(seed);
  } else {
    // Fallback for environments without window.crypto
    for (let i = 0; i < seed.length; i++) {
      seed[i] = Math.floor(Math.random() * 256);
    }
  }
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
 * Identity Service Class
 * Manages Internet Computer identities for the application
 */
class IdentityService {
  constructor() {
    this.identity = null;
    this.principal = null;
    this.accountId = null;
    this.accountIdHex = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize the identity service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    // Prevent multiple simultaneous initializations
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  async _doInitialize() {
    try {
      // Check if we have a stored identity
      const storedIdentity = this.loadStoredIdentity();
      
      if (storedIdentity) {
        console.log('Loaded existing identity with principal:', this.principal.toText());
        this.isInitialized = true;
        return true;
      } else {
        // Create a new identity
        await this.createNewIdentity();
        this.isInitialized = true;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize identity service:', error);
      this.isInitialized = false;
      return false;
    } finally {
      this.initializationPromise = null;
    }
  }

  /**
   * Load identity from localStorage
   * @returns {boolean} Success status
   */
  loadStoredIdentity() {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available');
        return false;
      }

      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedData) {
        return false;
      }

      const identityData = JSON.parse(storedData);
      if (!identityData.seed) {
        console.warn('Invalid stored identity data');
        return false;
      }

      // Recreate identity from stored seed
      const seed = hexToSeed(identityData.seed);
      this.identity = Ed25519KeyIdentity.fromSecretKey(seed);
      this.principal = this.identity.getPrincipal();
      
      // Calculate account ID if not stored or if utilities are available
      if (typeof principalToAccountIdentifier === 'function') {
        this.accountId = principalToAccountIdentifier(this.principal);
        this.accountIdHex = accountIdentifierToHex(this.accountId);
      } else {
        // Fallback to stored values
        this.accountIdHex = identityData.accountId || this.principal.toText();
      }

      return true;
    } catch (error) {
      console.error('Error loading stored identity:', error);
      // Clear corrupted data
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      return false;
    }
  }

  /**
   * Create a new identity
   * @returns {Promise<void>}
   */
  async createNewIdentity() {
    try {
      // Generate a new seed
      const seed = generateRandomSeed();
      
      // Create identity from seed
      this.identity = Ed25519KeyIdentity.fromSecretKey(seed);
      this.principal = this.identity.getPrincipal();
      
      // Calculate account ID if utilities are available
      if (typeof principalToAccountIdentifier === 'function') {
        this.accountId = principalToAccountIdentifier(this.principal);
        this.accountIdHex = accountIdentifierToHex(this.accountId);
      } else {
        // Fallback
        this.accountIdHex = this.principal.toText();
      }

      // Store the identity in localStorage
      if (typeof localStorage !== 'undefined') {
        const identityData = {
          type: 'seed',
          seed: seedToHex(seed),
          principal: this.principal.toText(),
          accountId: this.accountIdHex,
          created: new Date().toISOString()
        };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(identityData));
      }
      
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
    return this.accountIdHex || '';
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
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    this.identity = null;
    this.principal = null;
    this.accountId = null;
    this.accountIdHex = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Check if the service is initialized
   * @returns {boolean} Initialization status
   */
  isReady() {
    return this.isInitialized && this.identity !== null;
  }
}

// Export a singleton instance
export const identityService = new IdentityService();
export default identityService;
