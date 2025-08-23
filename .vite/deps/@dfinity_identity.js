import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  Cbor,
  DER_COSE_OID,
  ED25519_OID,
  IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
  IC_REQUEST_DOMAIN_SEPARATOR,
  SignIdentity,
  ed25519,
  requestIdOf,
  unwrapDER,
  wrapDER
} from "./chunk-AQLZL5WA.js";
import {
  uint8Equals,
  uint8FromBufLike
} from "./chunk-R2JNNGV5.js";
import {
  Principal,
  bytesToHex,
  bytesToUtf8,
  hexToBytes,
  randomBytes
} from "./chunk-ZJ2KAVMQ.js";
import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __toESM,
  require_dist,
  require_dist2,
  require_dist3
} from "./chunk-5WUIHEDG.js";

// node_modules/@dfinity/identity/lib/esm/index.js
var import_dist16 = __toESM(require_dist());
var import_dist17 = __toESM(require_dist2());
var import_dist18 = __toESM(require_dist3());

// node_modules/@dfinity/identity/lib/esm/identity/ed25519.js
var import_dist = __toESM(require_dist(), 1);
var import_dist2 = __toESM(require_dist2(), 1);
var import_dist3 = __toESM(require_dist3(), 1);
function isObject(value) {
  return value !== null && typeof value === "object";
}
var _rawKey, _derKey;
var _Ed25519PublicKey = class _Ed25519PublicKey {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(key) {
    __privateAdd(this, _rawKey, void 0);
    __privateAdd(this, _derKey, void 0);
    if (key.byteLength !== _Ed25519PublicKey.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    __privateSet(this, _rawKey, key);
    __privateSet(this, _derKey, _Ed25519PublicKey.derEncode(key));
  }
  /**
   * Construct Ed25519PublicKey from an existing PublicKey
   * @param {unknown} maybeKey - existing PublicKey, ArrayBuffer, DerEncodedPublicKey, or hex string
   * @returns {Ed25519PublicKey} Instance of Ed25519PublicKey
   */
  static from(maybeKey) {
    if (typeof maybeKey === "string") {
      const key = hexToBytes(maybeKey);
      return this.fromRaw(key);
    } else if (isObject(maybeKey)) {
      const key = maybeKey;
      if (isObject(key) && Object.hasOwnProperty.call(key, "__derEncodedPublicKey__")) {
        return this.fromDer(key);
      } else if (ArrayBuffer.isView(key)) {
        const view = key;
        return this.fromRaw(uint8FromBufLike(view.buffer));
      } else if (key instanceof ArrayBuffer) {
        return this.fromRaw(uint8FromBufLike(key));
      } else if ("rawKey" in key && key.rawKey instanceof Uint8Array) {
        return this.fromRaw(key.rawKey);
      } else if ("derKey" in key) {
        return this.fromDer(key.derKey);
      } else if ("toDer" in key) {
        return this.fromDer(key.toDer());
      }
    }
    throw new Error("Cannot construct Ed25519PublicKey from the provided key.");
  }
  static fromRaw(rawKey) {
    return new _Ed25519PublicKey(rawKey);
  }
  static fromDer(derKey) {
    return new _Ed25519PublicKey(this.derDecode(derKey));
  }
  static derEncode(publicKey) {
    const key = wrapDER(publicKey, ED25519_OID);
    key.__derEncodedPublicKey__ = void 0;
    return key;
  }
  static derDecode(key) {
    const unwrapped = unwrapDER(key, ED25519_OID);
    if (unwrapped.length !== this.RAW_KEY_LENGTH) {
      throw new Error("An Ed25519 public key must be exactly 32bytes long");
    }
    return unwrapped;
  }
  get rawKey() {
    return __privateGet(this, _rawKey);
  }
  get derKey() {
    return __privateGet(this, _derKey);
  }
  toDer() {
    return this.derKey;
  }
  toRaw() {
    return this.rawKey;
  }
};
_rawKey = new WeakMap();
_derKey = new WeakMap();
_Ed25519PublicKey.RAW_KEY_LENGTH = 32;
var Ed25519PublicKey = _Ed25519PublicKey;
var _publicKey, _privateKey;
var _Ed25519KeyIdentity = class _Ed25519KeyIdentity extends SignIdentity {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(publicKey, privateKey) {
    super();
    __privateAdd(this, _publicKey, void 0);
    __privateAdd(this, _privateKey, void 0);
    __privateSet(this, _publicKey, Ed25519PublicKey.from(publicKey));
    __privateSet(this, _privateKey, privateKey);
  }
  /**
   * Generate a new Ed25519KeyIdentity.
   * @param seed a 32-byte seed for the private key. If not provided, a random seed will be generated.
   * @returns Ed25519KeyIdentity
   */
  static generate(seed) {
    if (seed && seed.length !== 32) {
      throw new Error("Ed25519 Seed needs to be 32 bytes long.");
    }
    if (!seed)
      seed = ed25519.utils.randomPrivateKey();
    if (uint8Equals(seed, new Uint8Array(new Array(32).fill(0)))) {
      console.warn("Seed is all zeros. This is not a secure seed. Please provide a seed with sufficient entropy if this is a production environment.");
    }
    const sk = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      sk[i] = seed[i];
    }
    const pk = ed25519.getPublicKey(sk);
    return _Ed25519KeyIdentity.fromKeyPair(pk, sk);
  }
  static fromParsedJson(obj) {
    const [publicKeyDer, privateKeyRaw] = obj;
    return new _Ed25519KeyIdentity(Ed25519PublicKey.fromDer(hexToBytes(publicKeyDer)), hexToBytes(privateKeyRaw));
  }
  static fromJSON(json) {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      if (typeof parsed[0] === "string" && typeof parsed[1] === "string") {
        return this.fromParsedJson([parsed[0], parsed[1]]);
      } else {
        throw new Error("Deserialization error: JSON must have at least 2 items.");
      }
    }
    throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
  }
  static fromKeyPair(publicKey, privateKey) {
    return new _Ed25519KeyIdentity(Ed25519PublicKey.fromRaw(publicKey), privateKey);
  }
  static fromSecretKey(secretKey) {
    const publicKey = ed25519.getPublicKey(secretKey);
    return _Ed25519KeyIdentity.fromKeyPair(publicKey, secretKey);
  }
  /**
   * Serialize this key to JSON.
   */
  toJSON() {
    return [bytesToHex(__privateGet(this, _publicKey).toDer()), bytesToHex(__privateGet(this, _privateKey))];
  }
  /**
   * Return a copy of the key pair.
   */
  getKeyPair() {
    return {
      secretKey: __privateGet(this, _privateKey),
      publicKey: __privateGet(this, _publicKey)
    };
  }
  /**
   * Return the public key.
   */
  getPublicKey() {
    return __privateGet(this, _publicKey);
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param challenge - challenge to sign with this identity's secretKey, producing a signature
   */
  async sign(challenge) {
    const signature = ed25519.sign(challenge, __privateGet(this, _privateKey).slice(0, 32));
    Object.defineProperty(signature, "__signature__", {
      enumerable: false,
      value: void 0
    });
    return signature;
  }
  /**
   * Verify
   * @param sig - signature to verify
   * @param msg - message to verify
   * @param pk - public key
   * @returns - true if the signature is valid, false otherwise
   */
  static verify(sig, msg, pk) {
    const [signature, message, publicKey] = [sig, msg, pk].map((x) => {
      if (typeof x === "string") {
        x = hexToBytes(x);
      }
      return uint8FromBufLike(x);
    });
    return ed25519.verify(signature, message, publicKey);
  }
};
_publicKey = new WeakMap();
_privateKey = new WeakMap();
var Ed25519KeyIdentity = _Ed25519KeyIdentity;

// node_modules/@dfinity/identity/lib/esm/identity/ecdsa.js
var import_dist4 = __toESM(require_dist(), 1);
var import_dist5 = __toESM(require_dist2(), 1);
var import_dist6 = __toESM(require_dist3(), 1);
var CryptoError = class _CryptoError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, _CryptoError.prototype);
  }
};
function _getEffectiveCrypto(subtleCrypto) {
  if (typeof global !== "undefined" && global["crypto"] && global["crypto"]["subtle"]) {
    return global["crypto"]["subtle"];
  }
  if (subtleCrypto) {
    return subtleCrypto;
  } else if (typeof crypto !== "undefined" && crypto["subtle"]) {
    return crypto.subtle;
  } else {
    throw new CryptoError("Global crypto was not available and none was provided. Please inlcude a SubtleCrypto implementation. See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto");
  }
}
var ECDSAKeyIdentity = class _ECDSAKeyIdentity extends SignIdentity {
  /**
   * Generates a randomly generated identity for use in calls to the Internet Computer.
   * @param {CryptoKeyOptions} options optional settings
   * @param {CryptoKeyOptions['extractable']} options.extractable - whether the key should allow itself to be used. Set to false for maximum security.
   * @param {CryptoKeyOptions['keyUsages']} options.keyUsages - a list of key usages that the key can be used for
   * @param {CryptoKeyOptions['subtleCrypto']} options.subtleCrypto interface
   * @returns a {@link ECDSAKeyIdentity}
   */
  static async generate(options) {
    const { extractable = false, keyUsages = ["sign", "verify"], subtleCrypto } = options ?? {};
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const keyPair = await effectiveCrypto.generateKey({
      name: "ECDSA",
      namedCurve: "P-256"
    }, extractable, keyUsages);
    const derKey = uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
    Object.assign(derKey, {
      __derEncodedPublicKey__: void 0
    });
    return new this(keyPair, derKey, effectiveCrypto);
  }
  /**
   * generates an identity from a public and private key. Please ensure that you are generating these keys securely and protect the user's private key
   * @param keyPair a CryptoKeyPair
   * @param subtleCrypto - a SubtleCrypto interface in case one is not available globally
   * @returns an {@link ECDSAKeyIdentity}
   */
  static async fromKeyPair(keyPair, subtleCrypto) {
    const effectiveCrypto = _getEffectiveCrypto(subtleCrypto);
    const derKey = uint8FromBufLike(await effectiveCrypto.exportKey("spki", keyPair.publicKey));
    Object.assign(derKey, {
      __derEncodedPublicKey__: void 0
    });
    return new _ECDSAKeyIdentity(keyPair, derKey, effectiveCrypto);
  }
  // `fromKeyPair` and `generate` should be used for instantiation, not this constructor.
  constructor(keyPair, derKey, subtleCrypto) {
    super();
    this._keyPair = keyPair;
    this._derKey = derKey;
    this._subtleCrypto = subtleCrypto;
  }
  /**
   * Return the internally-used key pair.
   * @returns a CryptoKeyPair
   */
  getKeyPair() {
    return this._keyPair;
  }
  /**
   * Return the public key.
   * @returns an {@link PublicKey & DerCryptoKey}
   */
  getPublicKey() {
    const derKey = this._derKey;
    const key = Object.create(this._keyPair.publicKey);
    key.toDer = function() {
      return derKey;
    };
    return key;
  }
  /**
   * Signs a blob of data, with this identity's private key.
   * @param {Uint8Array} challenge - challenge to sign with this identity's secretKey, producing a signature
   * @returns {Promise<Signature>} signature
   */
  async sign(challenge) {
    const params = {
      name: "ECDSA",
      hash: { name: "SHA-256" }
    };
    const signature = uint8FromBufLike(await this._subtleCrypto.sign(params, this._keyPair.privateKey, challenge));
    Object.assign(signature, {
      __signature__: void 0
    });
    return signature;
  }
};

// node_modules/@dfinity/identity/lib/esm/identity/delegation.js
var import_dist10 = __toESM(require_dist(), 1);
var import_dist11 = __toESM(require_dist2(), 1);
var import_dist12 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/identity/lib/esm/identity/partial.js
var import_dist7 = __toESM(require_dist(), 1);
var import_dist8 = __toESM(require_dist2(), 1);
var import_dist9 = __toESM(require_dist3(), 1);
var _inner;
var PartialIdentity = class {
  constructor(inner) {
    __privateAdd(this, _inner, void 0);
    __privateSet(this, _inner, inner);
  }
  /**
   * The raw public key of this identity.
   */
  get rawKey() {
    return __privateGet(this, _inner).rawKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  get derKey() {
    return __privateGet(this, _inner).derKey;
  }
  /**
   * The DER-encoded public key of this identity.
   */
  toDer() {
    return __privateGet(this, _inner).toDer();
  }
  /**
   * The inner {@link PublicKey} used by this identity.
   */
  getPublicKey() {
    return __privateGet(this, _inner);
  }
  /**
   * The {@link Principal} of this identity.
   */
  getPrincipal() {
    if (!__privateGet(this, _inner).rawKey) {
      throw new Error("Cannot get principal from a public key without a raw key.");
    }
    return Principal.fromUint8Array(new Uint8Array(__privateGet(this, _inner).rawKey));
  }
  /**
   * Required for the Identity interface, but cannot implemented for just a public key.
   */
  transformRequest() {
    return Promise.reject("Not implemented. You are attempting to use a partial identity to sign calls, but this identity only has access to the public key.To sign calls, use a DelegationIdentity instead.");
  }
};
_inner = new WeakMap();

// node_modules/@dfinity/identity/lib/esm/identity/delegation.js
function _parseBlob(value) {
  if (typeof value !== "string" || value.length < 64) {
    throw new Error("Invalid public key.");
  }
  return hexToBytes(value);
}
var Delegation = class {
  constructor(pubkey, expiration, targets) {
    this.pubkey = pubkey;
    this.expiration = expiration;
    this.targets = targets;
  }
  toCborValue() {
    return {
      pubkey: this.pubkey,
      expiration: this.expiration,
      ...this.targets && {
        targets: this.targets
      }
    };
  }
  toJSON() {
    return {
      expiration: this.expiration.toString(16),
      pubkey: bytesToHex(this.pubkey),
      ...this.targets && { targets: this.targets.map((p) => p.toHex()) }
    };
  }
};
async function _createSingleDelegation(from, to, expiration, targets) {
  const delegation = new Delegation(
    to.toDer(),
    BigInt(+expiration) * BigInt(1e6),
    // In nanoseconds.
    targets
  );
  const challenge = new Uint8Array([
    ...IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
    ...new Uint8Array(requestIdOf({ ...delegation }))
  ]);
  const signature = await from.sign(challenge);
  return {
    delegation,
    signature
  };
}
var DelegationChain = class _DelegationChain {
  /**
   * Create a delegation chain between two (or more) keys. By default, the expiration time
   * will be very short (15 minutes).
   *
   * To build a chain of more than 2 identities, this function needs to be called multiple times,
   * passing the previous delegation chain into the options argument. For example:
   * @example
   * const rootKey = createKey();
   * const middleKey = createKey();
   * const bottomeKey = createKey();
   *
   * const rootToMiddle = await DelegationChain.create(
   *   root, middle.getPublicKey(), Date.parse('2100-01-01'),
   * );
   * const middleToBottom = await DelegationChain.create(
   *   middle, bottom.getPublicKey(), Date.parse('2100-01-01'), { previous: rootToMiddle },
   * );
   *
   * // We can now use a delegation identity that uses the delegation above:
   * const identity = DelegationIdentity.fromDelegation(bottomKey, middleToBottom);
   * @param from The identity that will delegate.
   * @param to The identity that gets delegated. It can now sign messages as if it was the
   *           identity above.
   * @param expiration The length the delegation is valid. By default, 15 minutes from calling
   *                   this function.
   * @param options A set of options for this delegation. expiration and previous
   * @param options.previous - Another DelegationChain that this chain should start with.
   * @param options.targets - targets that scope the delegation (e.g. Canister Principals)
   */
  static async create(from, to, expiration = new Date(Date.now() + 15 * 60 * 1e3), options = {}) {
    var _a, _b;
    const delegation = await _createSingleDelegation(from, to, expiration, options.targets);
    return new _DelegationChain([...((_a = options.previous) == null ? void 0 : _a.delegations) || [], delegation], ((_b = options.previous) == null ? void 0 : _b.publicKey) || from.getPublicKey().toDer());
  }
  /**
   * Creates a DelegationChain object from a JSON string.
   * @param json The JSON string to parse.
   */
  static fromJSON(json) {
    const { publicKey, delegations } = typeof json === "string" ? JSON.parse(json) : json;
    if (!Array.isArray(delegations)) {
      throw new Error("Invalid delegations.");
    }
    const parsedDelegations = delegations.map((signedDelegation) => {
      const { delegation, signature } = signedDelegation;
      const { pubkey, expiration, targets } = delegation;
      if (targets !== void 0 && !Array.isArray(targets)) {
        throw new Error("Invalid targets.");
      }
      return {
        delegation: new Delegation(
          _parseBlob(pubkey),
          BigInt("0x" + expiration),
          // expiration in JSON is an hexa string (See toJSON() below).
          targets && targets.map((t) => {
            if (typeof t !== "string") {
              throw new Error("Invalid target.");
            }
            return Principal.fromHex(t);
          })
        ),
        signature: _parseBlob(signature)
      };
    });
    return new this(parsedDelegations, _parseBlob(publicKey));
  }
  /**
   * Creates a DelegationChain object from a list of delegations and a DER-encoded public key.
   * @param delegations The list of delegations.
   * @param publicKey The DER-encoded public key of the key-pair signing the first delegation.
   */
  static fromDelegations(delegations, publicKey) {
    return new this(delegations, publicKey);
  }
  constructor(delegations, publicKey) {
    this.delegations = delegations;
    this.publicKey = publicKey;
  }
  toJSON() {
    return {
      delegations: this.delegations.map((signedDelegation) => {
        const { delegation, signature } = signedDelegation;
        const { targets } = delegation;
        return {
          delegation: {
            expiration: delegation.expiration.toString(16),
            pubkey: bytesToHex(delegation.pubkey),
            ...targets && {
              targets: targets.map((t) => t.toHex())
            }
          },
          signature: bytesToHex(signature)
        };
      }),
      publicKey: bytesToHex(this.publicKey)
    };
  }
};
var DelegationIdentity = class extends SignIdentity {
  /**
   * Create a delegation without having access to delegateKey.
   * @param key The key used to sign the requests.
   * @param delegation A delegation object created using `createDelegation`.
   */
  static fromDelegation(key, delegation) {
    return new this(key, delegation);
  }
  constructor(_inner2, _delegation2) {
    super();
    this._inner = _inner2;
    this._delegation = _delegation2;
  }
  getDelegation() {
    return this._delegation;
  }
  getPublicKey() {
    return {
      derKey: this._delegation.publicKey,
      toDer: () => this._delegation.publicKey
    };
  }
  sign(blob) {
    return this._inner.sign(blob);
  }
  async transformRequest(request) {
    const { body, ...fields } = request;
    const requestId = await requestIdOf(body);
    return {
      ...fields,
      body: {
        content: body,
        sender_sig: await this.sign(new Uint8Array([...IC_REQUEST_DOMAIN_SEPARATOR, ...new Uint8Array(requestId)])),
        sender_delegation: this._delegation.delegations,
        sender_pubkey: this._delegation.publicKey
      }
    };
  }
};
var _delegation;
var _PartialDelegationIdentity = class _PartialDelegationIdentity extends PartialIdentity {
  constructor(inner, delegation) {
    super(inner);
    __privateAdd(this, _delegation, void 0);
    __privateSet(this, _delegation, delegation);
  }
  /**
   * The Delegation Chain of this identity.
   */
  get delegation() {
    return __privateGet(this, _delegation);
  }
  /**
   * Create a {@link PartialDelegationIdentity} from a {@link PublicKey} and a {@link DelegationChain}.
   * @param key The {@link PublicKey} to delegate to.
   * @param delegation a {@link DelegationChain} targeting the inner key.
   */
  static fromDelegation(key, delegation) {
    return new _PartialDelegationIdentity(key, delegation);
  }
};
_delegation = new WeakMap();
var PartialDelegationIdentity = _PartialDelegationIdentity;
function isDelegationValid(chain, checks) {
  for (const { delegation } of chain.delegations) {
    if (+new Date(Number(delegation.expiration / BigInt(1e6))) <= +Date.now()) {
      return false;
    }
  }
  const scopes = [];
  const maybeScope = checks == null ? void 0 : checks.scope;
  if (maybeScope) {
    if (Array.isArray(maybeScope)) {
      scopes.push(...maybeScope.map((s) => typeof s === "string" ? Principal.fromText(s) : s));
    } else {
      scopes.push(typeof maybeScope === "string" ? Principal.fromText(maybeScope) : maybeScope);
    }
  }
  for (const s of scopes) {
    const scope = s.toText();
    for (const { delegation } of chain.delegations) {
      if (delegation.targets === void 0) {
        continue;
      }
      let none = true;
      for (const target of delegation.targets) {
        if (target.toText() === scope) {
          none = false;
          break;
        }
      }
      if (none) {
        return false;
      }
    }
  }
  return true;
}

// node_modules/@dfinity/identity/lib/esm/identity/webauthn.js
var import_dist13 = __toESM(require_dist(), 1);
var import_dist14 = __toESM(require_dist2(), 1);
var import_dist15 = __toESM(require_dist3(), 1);
function _coseToDerEncodedBlob(cose) {
  return wrapDER(cose, DER_COSE_OID);
}
function _authDataToCose(authData) {
  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  [...new Uint8Array(idLenBytes)].forEach((v, i) => dataView.setUint8(i, v));
  const credentialIdLength = dataView.getUint16(0);
  return authData.slice(55 + credentialIdLength);
}
var CosePublicKey = class {
  constructor(_cose) {
    this._cose = _cose;
    this._encodedKey = _coseToDerEncodedBlob(_cose);
  }
  toDer() {
    return this._encodedKey;
  }
  getCose() {
    return this._cose;
  }
};
function _createChallengeBuffer(challenge = "<ic0.app>") {
  if (typeof challenge === "string") {
    return Uint8Array.from(challenge, (c) => c.charCodeAt(0));
  } else {
    return challenge;
  }
}
async function _createCredential(credentialCreationOptions) {
  const creds = await navigator.credentials.create(credentialCreationOptions ?? {
    publicKey: {
      authenticatorSelection: {
        userVerification: "preferred"
      },
      attestation: "direct",
      challenge: _createChallengeBuffer(),
      pubKeyCredParams: [{ type: "public-key", alg: PubKeyCoseAlgo.ECDSA_WITH_SHA256 }],
      rp: {
        name: "Internet Identity Service"
      },
      user: {
        id: randomBytes(16),
        name: "Internet Identity",
        displayName: "Internet Identity"
      }
    }
  });
  if (creds === null) {
    return null;
  }
  return {
    // do _not_ use ...creds here, as creds is not enumerable in all cases
    id: creds.id,
    response: creds.response,
    type: creds.type,
    authenticatorAttachment: creds.authenticatorAttachment,
    getClientExtensionResults: creds.getClientExtensionResults,
    // Some password managers will return a Uint8Array, so we ensure we return an ArrayBuffer.
    rawId: creds.rawId,
    toJSON: creds.toJSON.bind(creds)
    // Ensure the toJSON method is included
  };
}
var PubKeyCoseAlgo;
(function(PubKeyCoseAlgo2) {
  PubKeyCoseAlgo2[PubKeyCoseAlgo2["ECDSA_WITH_SHA256"] = -7] = "ECDSA_WITH_SHA256";
})(PubKeyCoseAlgo || (PubKeyCoseAlgo = {}));
var WebAuthnIdentity = class extends SignIdentity {
  /**
   * Create an identity from a JSON serialization.
   * @param json - json to parse
   */
  static fromJSON(json) {
    const { publicKey, rawId } = JSON.parse(json);
    if (typeof publicKey !== "string" || typeof rawId !== "string") {
      throw new Error("Invalid JSON string.");
    }
    return new this(hexToBytes(rawId), hexToBytes(publicKey), void 0);
  }
  /**
   * Create an identity.
   * @param credentialCreationOptions an optional CredentialCreationOptions Challenge
   */
  static async create(credentialCreationOptions) {
    const creds = await _createCredential(credentialCreationOptions);
    if (!creds || creds.type !== "public-key") {
      throw new Error("Could not create credentials.");
    }
    const response = creds.response;
    if (response.attestationObject === void 0) {
      throw new Error("Was expecting an attestation response.");
    }
    const attObject = Cbor.decode(new Uint8Array(response.attestationObject));
    return new this(uint8FromBufLike(creds.rawId), _authDataToCose(attObject.authData), creds.authenticatorAttachment ?? void 0);
  }
  constructor(rawId, cose, authenticatorAttachment) {
    super();
    this.rawId = rawId;
    this.authenticatorAttachment = authenticatorAttachment;
    this._publicKey = new CosePublicKey(cose);
  }
  getPublicKey() {
    return this._publicKey;
  }
  /**
   * WebAuthn level 3 spec introduces a new attribute on successful WebAuthn interactions,
   * see https://w3c.github.io/webauthn/#dom-publickeycredential-authenticatorattachment.
   * This attribute is already implemented for Chrome, Safari and Edge.
   *
   * Given the attribute is only available after a successful interaction, the information is
   * provided opportunistically and might also be `undefined`.
   */
  getAuthenticatorAttachment() {
    return this.authenticatorAttachment;
  }
  async sign(blob) {
    const result = await navigator.credentials.get({
      publicKey: {
        allowCredentials: [
          {
            type: "public-key",
            id: this.rawId
          }
        ],
        challenge: blob,
        userVerification: "preferred"
      }
    });
    if (result.authenticatorAttachment !== null) {
      this.authenticatorAttachment = result.authenticatorAttachment;
    }
    const response = result.response;
    const encoded = Cbor.encode({
      authenticator_data: response.authenticatorData,
      client_data_json: bytesToUtf8(new Uint8Array(response.clientDataJSON)),
      signature: response.signature
    });
    if (!encoded) {
      throw new Error("failed to encode cbor");
    }
    Object.assign(encoded, {
      __signature__: void 0
    });
    return encoded;
  }
  /**
   * Allow for JSON serialization of all information needed to reuse this identity.
   */
  toJSON() {
    return {
      publicKey: bytesToHex(this._publicKey.getCose()),
      rawId: bytesToHex(this.rawId)
    };
  }
};

// node_modules/@dfinity/identity/lib/esm/index.js
var Secp256k1KeyIdentity = class {
  constructor() {
    throw new Error("Secp256k1KeyIdentity has been moved to a new repo: @dfinity/identity-secp256k1");
  }
};
export {
  CryptoError,
  DER_COSE_OID,
  Delegation,
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  ED25519_OID,
  Ed25519KeyIdentity,
  Ed25519PublicKey,
  PartialDelegationIdentity,
  PartialIdentity,
  Secp256k1KeyIdentity,
  WebAuthnIdentity,
  isDelegationValid,
  unwrapDER,
  wrapDER
};
//# sourceMappingURL=@dfinity_identity.js.map
