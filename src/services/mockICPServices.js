// Mock implementations for Internet Computer functionality
// This file provides temporary mock implementations until we can properly
// install and configure the @dfinity packages

// Mock Principal class
export class MockPrincipal {
  constructor(text) {
    this.text = text || `mock-principal-${Date.now()}`;
  }

  static fromText(text) {
    return new MockPrincipal(text);
  }

  toText() {
    return this.text;
  }

  toUint8Array() {
    const encoder = new TextEncoder();
    return encoder.encode(this.text);
  }
}

// Mock Ed25519KeyIdentity class
export class MockEd25519KeyIdentity {
  constructor(seed) {
    this.seed = seed;
    this.publicKey = seed.slice(0, 32); // Simulate a public key
    this.privateKey = seed.slice(32, 64); // Simulate a private key
  }

  static generate() {
    const seed = new Uint8Array(64);
    window.crypto.getRandomValues(seed);
    return new MockEd25519KeyIdentity(seed);
  }

  static fromSeed(seed) {
    return new MockEd25519KeyIdentity(seed);
  }
  
  static fromSecretKey(secretKey) {
    // For our mock implementation, we'll just use the secretKey as the seed
    // In a real implementation, this would derive the key pair from the secret key
    const seed = new Uint8Array(64);
    seed.set(secretKey, 0);
    window.crypto.getRandomValues(seed.subarray(32)); // Fill the rest with random data
    return new MockEd25519KeyIdentity(seed);
  }

  getPrincipal() {
    return new MockPrincipal();
  }

  toJSON() {
    return {
      publicKey: Array.from(this.publicKey),
      privateKey: Array.from(this.privateKey)
    };
  }

  static fromJSON(json) {
    const publicKey = new Uint8Array(json.publicKey);
    const privateKey = new Uint8Array(json.privateKey);
    const seed = new Uint8Array(64);
    seed.set(publicKey, 0);
    seed.set(privateKey, 32);
    return new MockEd25519KeyIdentity(seed);
  }
}

// Mock HttpAgent class
export class MockHttpAgent {
  constructor(options = {}) {
    this.identity = options.identity || MockEd25519KeyIdentity.generate();
    this.host = options.host || 'https://ic0.app';
  }

  getPrincipal() {
    return this.identity.getPrincipal();
  }

  async fetchRootKey() {
    return new Uint8Array(32);
  }
}

// Mock Actor factory
export const MockActor = {
  createActor: (idl, options) => {
    return {
      balance: async () => ({ e8s: BigInt(100000000) }), // 1 ICP
      transfer: async () => ({ height: BigInt(123456) }),
      account_balance: async () => ({ e8s: BigInt(100000000) }), // 1 ICP
    };
  }
};

// Mock utility functions
export function mockPrincipalToAccountIdentifier(principal) {
  // Return a random buffer that simulates an account ID
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  return buffer;
}

export function mockAccountIdToHex(accountId) {
  return Array.from(accountId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constants
export const ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
export const SUB_ACCOUNT_ZERO = new Uint8Array(32);
export const ACCOUNT_DOMAIN_SEPARATOR = new TextEncoder().encode('\x0Aaccount-id');

// Mock sha224 function
export function mockSha224(data) {
  // Return a random hash for simulation
  const hash = new Uint8Array(28); // sha224 is 28 bytes
  window.crypto.getRandomValues(hash);
  return hash;
}

// Mock getCrc32 function
export function mockGetCrc32(buf) {
  // Return a random 4-byte number for simulation
  const bytes = new Uint8Array(4);
  window.crypto.getRandomValues(bytes);
  return bytes;
}
