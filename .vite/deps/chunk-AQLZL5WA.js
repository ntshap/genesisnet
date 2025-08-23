import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'
globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
import __global_polyfill from 'vite-plugin-node-polyfills/shims/global'
globalThis.global = globalThis.global || __global_polyfill
import __process_polyfill from 'vite-plugin-node-polyfills/shims/process'
globalThis.process = globalThis.process || __process_polyfill

import {
  PipeArrayBuffer,
  compare,
  idl_exports,
  lebDecode,
  lebEncode
} from "./chunk-R2JNNGV5.js";
import {
  Hash,
  Principal,
  abytes,
  aexists,
  ahash,
  anumber,
  bytesToHex,
  clean,
  concatBytes,
  hexToBytes,
  isBytes,
  randomBytes,
  sha256,
  sha512,
  toBytes,
  utf8ToBytes
} from "./chunk-ZJ2KAVMQ.js";
import {
  __export,
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __privateWrapper,
  __toESM,
  require_dist,
  require_dist2,
  require_dist3
} from "./chunk-5WUIHEDG.js";

// node_modules/@dfinity/agent/lib/esm/index.js
var import_dist115 = __toESM(require_dist());
var import_dist116 = __toESM(require_dist2());
var import_dist117 = __toESM(require_dist3());

// node_modules/@dfinity/agent/lib/esm/actor.js
var import_dist109 = __toESM(require_dist(), 1);
var import_dist110 = __toESM(require_dist2(), 1);
var import_dist111 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/agent/index.js
var import_dist100 = __toESM(require_dist(), 1);
var import_dist101 = __toESM(require_dist2(), 1);
var import_dist102 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/agent/api.js
var import_dist = __toESM(require_dist(), 1);
var import_dist2 = __toESM(require_dist2(), 1);
var import_dist3 = __toESM(require_dist3(), 1);
var ReplicaRejectCode;
(function(ReplicaRejectCode2) {
  ReplicaRejectCode2[ReplicaRejectCode2["SysFatal"] = 1] = "SysFatal";
  ReplicaRejectCode2[ReplicaRejectCode2["SysTransient"] = 2] = "SysTransient";
  ReplicaRejectCode2[ReplicaRejectCode2["DestinationInvalid"] = 3] = "DestinationInvalid";
  ReplicaRejectCode2[ReplicaRejectCode2["CanisterReject"] = 4] = "CanisterReject";
  ReplicaRejectCode2[ReplicaRejectCode2["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
var QueryResponseStatus;
(function(QueryResponseStatus2) {
  QueryResponseStatus2["Replied"] = "replied";
  QueryResponseStatus2["Rejected"] = "rejected";
})(QueryResponseStatus || (QueryResponseStatus = {}));
function isV2ResponseBody(body) {
  return body !== null && body !== void 0 && "reject_code" in body;
}
function isV3ResponseBody(body) {
  return body !== null && body !== void 0 && "certificate" in body;
}

// node_modules/@dfinity/agent/lib/esm/agent/http/index.js
var import_dist97 = __toESM(require_dist(), 1);
var import_dist98 = __toESM(require_dist2(), 1);
var import_dist99 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/errors.js
var import_dist4 = __toESM(require_dist(), 1);
var import_dist5 = __toESM(require_dist2(), 1);
var import_dist6 = __toESM(require_dist3(), 1);
var ErrorKindEnum;
(function(ErrorKindEnum2) {
  ErrorKindEnum2["Trust"] = "Trust";
  ErrorKindEnum2["Protocol"] = "Protocol";
  ErrorKindEnum2["Reject"] = "Reject";
  ErrorKindEnum2["Transport"] = "Transport";
  ErrorKindEnum2["External"] = "External";
  ErrorKindEnum2["Limit"] = "Limit";
  ErrorKindEnum2["Input"] = "Input";
  ErrorKindEnum2["Unknown"] = "Unknown";
})(ErrorKindEnum || (ErrorKindEnum = {}));
var ErrorCode = class {
  constructor(isCertified = false) {
    this.isCertified = isCertified;
  }
  toString() {
    let errorMessage = this.toErrorMessage();
    if (this.requestContext) {
      errorMessage += `
Request context:
  Request ID (hex): ${this.requestContext.requestId ? bytesToHex(this.requestContext.requestId) : "undefined"}
  Sender pubkey (hex): ${bytesToHex(this.requestContext.senderPubKey)}
  Sender signature (hex): ${bytesToHex(this.requestContext.senderSignature)}
  Ingress expiry: ${this.requestContext.ingressExpiry.toString()}`;
    }
    if (this.callContext) {
      errorMessage += `
Call context:
  Canister ID: ${this.callContext.canisterId.toText()}
  Method name: ${this.callContext.methodName}
  HTTP details: ${JSON.stringify(this.callContext.httpDetails, null, 2)}`;
    }
    return errorMessage;
  }
};
var AgentError = class _AgentError extends Error {
  get code() {
    return this.cause.code;
  }
  set code(code) {
    this.cause.code = code;
  }
  get kind() {
    return this.cause.kind;
  }
  set kind(kind) {
    this.cause.kind = kind;
  }
  /**
   * Reads the `isCertified` property of the underlying error code.
   * @returns `true` if the error is certified, `false` otherwise.
   */
  get isCertified() {
    return this.code.isCertified;
  }
  constructor(code, kind) {
    super(code.toString());
    this.name = "AgentError";
    this.cause = { code, kind };
    Object.setPrototypeOf(this, _AgentError.prototype);
  }
  hasCode(code) {
    return this.code instanceof code;
  }
  toString() {
    return `${this.name} (${this.kind}): ${this.message}`;
  }
};
var ErrorKind = class extends AgentError {
  static fromCode(code) {
    return new this(code);
  }
};
var TrustError = class _TrustError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Trust);
    this.name = "TrustError";
    Object.setPrototypeOf(this, _TrustError.prototype);
  }
};
var ProtocolError = class _ProtocolError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Protocol);
    this.name = "ProtocolError";
    Object.setPrototypeOf(this, _ProtocolError.prototype);
  }
};
var RejectError = class _RejectError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Reject);
    this.name = "RejectError";
    Object.setPrototypeOf(this, _RejectError.prototype);
  }
};
var TransportError = class _TransportError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Transport);
    this.name = "TransportError";
    Object.setPrototypeOf(this, _TransportError.prototype);
  }
};
var ExternalError = class _ExternalError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.External);
    this.name = "ExternalError";
    Object.setPrototypeOf(this, _ExternalError.prototype);
  }
};
var LimitError = class _LimitError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Limit);
    this.name = "LimitError";
    Object.setPrototypeOf(this, _LimitError.prototype);
  }
};
var InputError = class _InputError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Input);
    this.name = "InputError";
    Object.setPrototypeOf(this, _InputError.prototype);
  }
};
var UnknownError = class _UnknownError extends ErrorKind {
  constructor(code) {
    super(code, ErrorKindEnum.Unknown);
    this.name = "UnknownError";
    Object.setPrototypeOf(this, _UnknownError.prototype);
  }
};
var CertificateVerificationErrorCode = class _CertificateVerificationErrorCode extends ErrorCode {
  constructor(reason, error) {
    super();
    this.reason = reason;
    this.error = error;
    this.name = "CertificateVerificationErrorCode";
    Object.setPrototypeOf(this, _CertificateVerificationErrorCode.prototype);
  }
  toErrorMessage() {
    let errorMessage = this.reason;
    if (this.error) {
      errorMessage += `: ${formatUnknownError(this.error)}`;
    }
    return `Certificate verification error: "${errorMessage}"`;
  }
};
var CertificateTimeErrorCode = class _CertificateTimeErrorCode extends ErrorCode {
  constructor(maxAgeInMinutes, certificateTime, currentTime, timeDiffMsecs, ageType) {
    super();
    this.maxAgeInMinutes = maxAgeInMinutes;
    this.certificateTime = certificateTime;
    this.currentTime = currentTime;
    this.timeDiffMsecs = timeDiffMsecs;
    this.ageType = ageType;
    this.name = "CertificateTimeErrorCode";
    Object.setPrototypeOf(this, _CertificateTimeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Certificate is signed more than ${this.maxAgeInMinutes} minutes in the ${this.ageType}. Certificate time: ${this.certificateTime.toISOString()} Current time: ${this.currentTime.toISOString()} Clock drift: ${this.timeDiffMsecs}ms`;
  }
};
var CertificateHasTooManyDelegationsErrorCode = class _CertificateHasTooManyDelegationsErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "CertificateHasTooManyDelegationsErrorCode";
    Object.setPrototypeOf(this, _CertificateHasTooManyDelegationsErrorCode.prototype);
  }
  toErrorMessage() {
    return "Certificate has too many delegations";
  }
};
var CertificateNotAuthorizedErrorCode = class _CertificateNotAuthorizedErrorCode extends ErrorCode {
  constructor(canisterId, subnetId) {
    super();
    this.canisterId = canisterId;
    this.subnetId = subnetId;
    this.name = "CertificateNotAuthorizedErrorCode";
    Object.setPrototypeOf(this, _CertificateNotAuthorizedErrorCode.prototype);
  }
  toErrorMessage() {
    return `The certificate contains a delegation that does not include the canister ${this.canisterId.toText()} in the canister_ranges field. Subnet ID: ${this.subnetId.toText()}`;
  }
};
var LookupErrorCode = class _LookupErrorCode extends ErrorCode {
  constructor(message, lookupStatus) {
    super();
    this.message = message;
    this.lookupStatus = lookupStatus;
    this.name = "LookupErrorCode";
    Object.setPrototypeOf(this, _LookupErrorCode.prototype);
  }
  toErrorMessage() {
    return `${this.message}. Lookup status: ${this.lookupStatus}`;
  }
};
var MalformedLookupFoundValueErrorCode = class _MalformedLookupFoundValueErrorCode extends ErrorCode {
  constructor(message) {
    super();
    this.message = message;
    this.name = "MalformedLookupFoundValueErrorCode";
    Object.setPrototypeOf(this, _MalformedLookupFoundValueErrorCode.prototype);
  }
  toErrorMessage() {
    return this.message;
  }
};
var MissingLookupValueErrorCode = class _MissingLookupValueErrorCode extends ErrorCode {
  constructor(message) {
    super();
    this.message = message;
    this.name = "MissingLookupValueErrorCode";
    Object.setPrototypeOf(this, _MissingLookupValueErrorCode.prototype);
  }
  toErrorMessage() {
    return this.message;
  }
};
var DerKeyLengthMismatchErrorCode = class _DerKeyLengthMismatchErrorCode extends ErrorCode {
  constructor(expectedLength, actualLength) {
    super();
    this.expectedLength = expectedLength;
    this.actualLength = actualLength;
    this.name = "DerKeyLengthMismatchErrorCode";
    Object.setPrototypeOf(this, _DerKeyLengthMismatchErrorCode.prototype);
  }
  toErrorMessage() {
    return `BLS DER-encoded public key must be ${this.expectedLength} bytes long, but is ${this.actualLength} bytes long`;
  }
};
var DerPrefixMismatchErrorCode = class _DerPrefixMismatchErrorCode extends ErrorCode {
  constructor(expectedPrefix, actualPrefix) {
    super();
    this.expectedPrefix = expectedPrefix;
    this.actualPrefix = actualPrefix;
    this.name = "DerPrefixMismatchErrorCode";
    Object.setPrototypeOf(this, _DerPrefixMismatchErrorCode.prototype);
  }
  toErrorMessage() {
    return `BLS DER-encoded public key is invalid. Expected the following prefix: ${bytesToHex(this.expectedPrefix)}, but got ${bytesToHex(this.actualPrefix)}`;
  }
};
var DerDecodeLengthMismatchErrorCode = class _DerDecodeLengthMismatchErrorCode extends ErrorCode {
  constructor(expectedLength, actualLength) {
    super();
    this.expectedLength = expectedLength;
    this.actualLength = actualLength;
    this.name = "DerDecodeLengthMismatchErrorCode";
    Object.setPrototypeOf(this, _DerDecodeLengthMismatchErrorCode.prototype);
  }
  toErrorMessage() {
    return `DER payload mismatch: Expected length ${this.expectedLength}, actual length: ${this.actualLength}`;
  }
};
var DerDecodeErrorCode = class _DerDecodeErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "DerDecodeErrorCode";
    Object.setPrototypeOf(this, _DerDecodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to decode DER: ${this.error}`;
  }
};
var DerEncodeErrorCode = class _DerEncodeErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "DerEncodeErrorCode";
    Object.setPrototypeOf(this, _DerEncodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to encode DER: ${this.error}`;
  }
};
var CborDecodeErrorCode = class _CborDecodeErrorCode extends ErrorCode {
  constructor(error, input) {
    super();
    this.error = error;
    this.input = input;
    this.name = "CborDecodeErrorCode";
    Object.setPrototypeOf(this, _CborDecodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to decode CBOR: ${formatUnknownError(this.error)}, input: ${bytesToHex(this.input)}`;
  }
};
var CborEncodeErrorCode = class _CborEncodeErrorCode extends ErrorCode {
  constructor(error, value) {
    super();
    this.error = error;
    this.value = value;
    this.name = "CborEncodeErrorCode";
    Object.setPrototypeOf(this, _CborEncodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to encode CBOR: ${formatUnknownError(this.error)}, input: ${this.value}`;
  }
};
var HexDecodeErrorCode = class _HexDecodeErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "HexDecodeErrorCode";
    Object.setPrototypeOf(this, _HexDecodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to decode hex: ${this.error}`;
  }
};
var TimeoutWaitingForResponseErrorCode = class _TimeoutWaitingForResponseErrorCode extends ErrorCode {
  constructor(message, requestId, status) {
    super();
    this.message = message;
    this.requestId = requestId;
    this.status = status;
    this.name = "TimeoutWaitingForResponseErrorCode";
    Object.setPrototypeOf(this, _TimeoutWaitingForResponseErrorCode.prototype);
  }
  toErrorMessage() {
    let errorMessage = `${this.message}
`;
    if (this.requestId) {
      errorMessage += `  Request ID: ${bytesToHex(this.requestId)}
`;
    }
    if (this.status) {
      errorMessage += `  Request status: ${this.status}
`;
    }
    return errorMessage;
  }
};
var CertificateOutdatedErrorCode = class _CertificateOutdatedErrorCode extends ErrorCode {
  constructor(maxIngressExpiryInMinutes, requestId, retryTimes) {
    super();
    this.maxIngressExpiryInMinutes = maxIngressExpiryInMinutes;
    this.requestId = requestId;
    this.retryTimes = retryTimes;
    this.name = "CertificateOutdatedErrorCode";
    Object.setPrototypeOf(this, _CertificateOutdatedErrorCode.prototype);
  }
  toErrorMessage() {
    let errorMessage = `Certificate is stale (over ${this.maxIngressExpiryInMinutes} minutes). Is the computer's clock synchronized?
  Request ID: ${bytesToHex(this.requestId)}
`;
    if (this.retryTimes !== void 0) {
      errorMessage += `  Retried ${this.retryTimes} times.`;
    }
    return errorMessage;
  }
};
var CertifiedRejectErrorCode = class _CertifiedRejectErrorCode extends ErrorCode {
  constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
    super(true);
    this.requestId = requestId;
    this.rejectCode = rejectCode;
    this.rejectMessage = rejectMessage;
    this.rejectErrorCode = rejectErrorCode;
    this.name = "CertifiedRejectErrorCode";
    Object.setPrototypeOf(this, _CertifiedRejectErrorCode.prototype);
  }
  toErrorMessage() {
    return `The replica returned a rejection error:
  Request ID: ${bytesToHex(this.requestId)}
  Reject code: ${this.rejectCode}
  Reject text: ${this.rejectMessage}
  Error code: ${this.rejectErrorCode}
`;
  }
};
var UncertifiedRejectErrorCode = class _UncertifiedRejectErrorCode extends ErrorCode {
  constructor(requestId, rejectCode, rejectMessage, rejectErrorCode, signatures) {
    super();
    this.requestId = requestId;
    this.rejectCode = rejectCode;
    this.rejectMessage = rejectMessage;
    this.rejectErrorCode = rejectErrorCode;
    this.signatures = signatures;
    this.name = "UncertifiedRejectErrorCode";
    Object.setPrototypeOf(this, _UncertifiedRejectErrorCode.prototype);
  }
  toErrorMessage() {
    return `The replica returned a rejection error:
  Request ID: ${bytesToHex(this.requestId)}
  Reject code: ${this.rejectCode}
  Reject text: ${this.rejectMessage}
  Error code: ${this.rejectErrorCode}
`;
  }
};
var UncertifiedRejectUpdateErrorCode = class _UncertifiedRejectUpdateErrorCode extends ErrorCode {
  constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
    super();
    this.requestId = requestId;
    this.rejectCode = rejectCode;
    this.rejectMessage = rejectMessage;
    this.rejectErrorCode = rejectErrorCode;
    this.name = "UncertifiedRejectUpdateErrorCode";
    Object.setPrototypeOf(this, _UncertifiedRejectUpdateErrorCode.prototype);
  }
  toErrorMessage() {
    return `The replica returned a rejection error:
  Request ID: ${bytesToHex(this.requestId)}
  Reject code: ${this.rejectCode}
  Reject text: ${this.rejectMessage}
  Error code: ${this.rejectErrorCode}
`;
  }
};
var RequestStatusDoneNoReplyErrorCode = class _RequestStatusDoneNoReplyErrorCode extends ErrorCode {
  constructor(requestId) {
    super();
    this.requestId = requestId;
    this.name = "RequestStatusDoneNoReplyErrorCode";
    Object.setPrototypeOf(this, _RequestStatusDoneNoReplyErrorCode.prototype);
  }
  toErrorMessage() {
    return `Call was marked as done but we never saw the reply:
  Request ID: ${bytesToHex(this.requestId)}
`;
  }
};
var MissingRootKeyErrorCode = class _MissingRootKeyErrorCode extends ErrorCode {
  constructor(shouldFetchRootKey) {
    super();
    this.shouldFetchRootKey = shouldFetchRootKey;
    this.name = "MissingRootKeyErrorCode";
    Object.setPrototypeOf(this, _MissingRootKeyErrorCode.prototype);
  }
  toErrorMessage() {
    if (this.shouldFetchRootKey === void 0) {
      return "Agent is missing root key";
    }
    return `Agent is missing root key and the shouldFetchRootKey value is set to ${this.shouldFetchRootKey}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`;
  }
};
var HashValueErrorCode = class _HashValueErrorCode extends ErrorCode {
  constructor(value) {
    super();
    this.value = value;
    this.name = "HashValueErrorCode";
    Object.setPrototypeOf(this, _HashValueErrorCode.prototype);
  }
  toErrorMessage() {
    return `Attempt to hash a value of unsupported type: ${this.value}`;
  }
};
var HttpDefaultFetchErrorCode = class _HttpDefaultFetchErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "HttpDefaultFetchErrorCode";
    Object.setPrototypeOf(this, _HttpDefaultFetchErrorCode.prototype);
  }
  toErrorMessage() {
    return this.error;
  }
};
var IdentityInvalidErrorCode = class _IdentityInvalidErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "IdentityInvalidErrorCode";
    Object.setPrototypeOf(this, _IdentityInvalidErrorCode.prototype);
  }
  toErrorMessage() {
    return "This identity has expired due this application's security policy. Please refresh your authentication.";
  }
};
var IngressExpiryInvalidErrorCode = class _IngressExpiryInvalidErrorCode extends ErrorCode {
  constructor(message, providedIngressExpiryInMinutes) {
    super();
    this.message = message;
    this.providedIngressExpiryInMinutes = providedIngressExpiryInMinutes;
    this.name = "IngressExpiryInvalidErrorCode";
    Object.setPrototypeOf(this, _IngressExpiryInvalidErrorCode.prototype);
  }
  toErrorMessage() {
    return `${this.message}. Provided ingress expiry time is ${this.providedIngressExpiryInMinutes} minutes.`;
  }
};
var CreateHttpAgentErrorCode = class _CreateHttpAgentErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "CreateHttpAgentErrorCode";
    Object.setPrototypeOf(this, _CreateHttpAgentErrorCode.prototype);
  }
  toErrorMessage() {
    return "Failed to create agent from provided agent";
  }
};
var MalformedSignatureErrorCode = class _MalformedSignatureErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "MalformedSignatureErrorCode";
    Object.setPrototypeOf(this, _MalformedSignatureErrorCode.prototype);
  }
  toErrorMessage() {
    return `Query response contained a malformed signature: ${this.error}`;
  }
};
var MissingSignatureErrorCode = class _MissingSignatureErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "MissingSignatureErrorCode";
    Object.setPrototypeOf(this, _MissingSignatureErrorCode.prototype);
  }
  toErrorMessage() {
    return "Query response did not contain any node signatures";
  }
};
var MalformedPublicKeyErrorCode = class _MalformedPublicKeyErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "MalformedPublicKeyErrorCode";
    Object.setPrototypeOf(this, _MalformedPublicKeyErrorCode.prototype);
  }
  toErrorMessage() {
    return "Read state response contained a malformed public key";
  }
};
var QuerySignatureVerificationFailedErrorCode = class _QuerySignatureVerificationFailedErrorCode extends ErrorCode {
  constructor(nodeId) {
    super();
    this.nodeId = nodeId;
    this.name = "QuerySignatureVerificationFailedErrorCode";
    Object.setPrototypeOf(this, _QuerySignatureVerificationFailedErrorCode.prototype);
  }
  toErrorMessage() {
    return `Query signature verification failed. Node ID: ${this.nodeId}`;
  }
};
var UnexpectedErrorCode = class _UnexpectedErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "UnexpectedErrorCode";
    Object.setPrototypeOf(this, _UnexpectedErrorCode.prototype);
  }
  toErrorMessage() {
    return `Unexpected error: ${formatUnknownError(this.error)}`;
  }
};
var HashTreeDecodeErrorCode = class _HashTreeDecodeErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "HashTreeDecodeErrorCode";
    Object.setPrototypeOf(this, _HashTreeDecodeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to decode certificate: ${this.error}`;
  }
};
var HttpErrorCode = class _HttpErrorCode extends ErrorCode {
  constructor(status, statusText, headers, bodyText) {
    super();
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.bodyText = bodyText;
    this.name = "HttpErrorCode";
    Object.setPrototypeOf(this, _HttpErrorCode.prototype);
  }
  toErrorMessage() {
    let errorMessage = `HTTP request failed:
  Status: ${this.status} (${this.statusText})
  Headers: ${JSON.stringify(this.headers)}
`;
    if (this.bodyText) {
      errorMessage += `  Body: ${this.bodyText}
`;
    }
    return errorMessage;
  }
};
var HttpV3ApiNotSupportedErrorCode = class _HttpV3ApiNotSupportedErrorCode extends ErrorCode {
  constructor() {
    super();
    this.name = "HttpV3ApiNotSupportedErrorCode";
    Object.setPrototypeOf(this, _HttpV3ApiNotSupportedErrorCode.prototype);
  }
  toErrorMessage() {
    return "HTTP request failed: v3 API is not supported";
  }
};
var HttpFetchErrorCode = class _HttpFetchErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "HttpFetchErrorCode";
    Object.setPrototypeOf(this, _HttpFetchErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to fetch HTTP request: ${formatUnknownError(this.error)}`;
  }
};
var MissingCanisterIdErrorCode = class _MissingCanisterIdErrorCode extends ErrorCode {
  constructor(receivedCanisterId) {
    super();
    this.receivedCanisterId = receivedCanisterId;
    this.name = "MissingCanisterIdErrorCode";
    Object.setPrototypeOf(this, _MissingCanisterIdErrorCode.prototype);
  }
  toErrorMessage() {
    return `Canister ID is required, but received ${typeof this.receivedCanisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`;
  }
};
var InvalidReadStateRequestErrorCode = class _InvalidReadStateRequestErrorCode extends ErrorCode {
  constructor(request2) {
    super();
    this.request = request2;
    this.name = "InvalidReadStateRequestErrorCode";
    Object.setPrototypeOf(this, _InvalidReadStateRequestErrorCode.prototype);
  }
  toErrorMessage() {
    return `Invalid read state request: ${this.request}`;
  }
};
var ExpiryJsonDeserializeErrorCode = class _ExpiryJsonDeserializeErrorCode extends ErrorCode {
  constructor(error) {
    super();
    this.error = error;
    this.name = "ExpiryJsonDeserializeErrorCode";
    Object.setPrototypeOf(this, _ExpiryJsonDeserializeErrorCode.prototype);
  }
  toErrorMessage() {
    return `Failed to deserialize expiry: ${this.error}`;
  }
};
function formatUnknownError(error) {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
var UNREACHABLE_ERROR = new Error("unreachable");

// node_modules/@dfinity/agent/lib/esm/auth.js
var import_dist16 = __toESM(require_dist(), 1);
var import_dist17 = __toESM(require_dist2(), 1);
var import_dist18 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/request_id.js
var import_dist10 = __toESM(require_dist(), 1);
var import_dist11 = __toESM(require_dist2(), 1);
var import_dist12 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/utils/buffer.js
var import_dist7 = __toESM(require_dist(), 1);
var import_dist8 = __toESM(require_dist2(), 1);
var import_dist9 = __toESM(require_dist3(), 1);
function uint8FromBufLike(bufLike) {
  if (!bufLike) {
    throw new Error("Input cannot be null or undefined");
  }
  if (bufLike instanceof Uint8Array) {
    return bufLike;
  }
  if (bufLike instanceof ArrayBuffer) {
    return new Uint8Array(bufLike);
  }
  if (Array.isArray(bufLike)) {
    return new Uint8Array(bufLike);
  }
  if ("buffer" in bufLike) {
    return uint8FromBufLike(bufLike.buffer);
  }
  return new Uint8Array(bufLike);
}
function uint8ToBuf(arr) {
  const buf = new ArrayBuffer(arr.byteLength);
  const view = new Uint8Array(buf);
  view.set(arr);
  return buf;
}
function uint8Equals(a2, b2) {
  if (a2.length !== b2.length)
    return false;
  for (let i = 0; i < a2.length; i++) {
    if (a2[i] !== b2[i])
      return false;
  }
  return true;
}

// node_modules/@dfinity/agent/lib/esm/request_id.js
function hashValue(value) {
  if (typeof value === "string") {
    return hashString(value);
  } else if (typeof value === "number") {
    return sha256(lebEncode(value));
  } else if (value instanceof Uint8Array || ArrayBuffer.isView(value)) {
    return sha256(uint8FromBufLike(value));
  } else if (Array.isArray(value)) {
    const vals = value.map(hashValue);
    return sha256(concatBytes(...vals));
  } else if (value && typeof value === "object" && value._isPrincipal) {
    return sha256(value.toUint8Array());
  } else if (typeof value === "object" && value !== null && typeof value.toHash === "function") {
    return hashValue(value.toHash());
  } else if (typeof value === "object") {
    return hashOfMap(value);
  } else if (typeof value === "bigint") {
    return sha256(lebEncode(value));
  }
  throw InputError.fromCode(new HashValueErrorCode(value));
}
var hashString = (value) => {
  const encoded = new TextEncoder().encode(value);
  return sha256(encoded);
};
function requestIdOf(request2) {
  return hashOfMap(request2);
}
function hashOfMap(map) {
  const hashed = Object.entries(map).filter(([, value]) => value !== void 0).map(([key, value]) => {
    const hashedKey = hashString(key);
    const hashedValue = hashValue(value);
    return [hashedKey, hashedValue];
  });
  const traversed = hashed;
  const sorted = traversed.sort(([k1], [k2]) => {
    return compare(k1, k2);
  });
  const concatenated = concatBytes(...sorted.map((x2) => concatBytes(...x2)));
  const result = sha256(concatenated);
  return result;
}

// node_modules/@dfinity/agent/lib/esm/constants.js
var import_dist13 = __toESM(require_dist(), 1);
var import_dist14 = __toESM(require_dist2(), 1);
var import_dist15 = __toESM(require_dist3(), 1);
var DEFAULT_INGRESS_EXPIRY_DELTA_IN_MSECS = 5 * 60 * 1e3;
var IC_REQUEST_DOMAIN_SEPARATOR = new TextEncoder().encode("\nic-request");
var IC_RESPONSE_DOMAIN_SEPARATOR = new TextEncoder().encode("\vic-response");
var IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR = new TextEncoder().encode("ic-request-auth-delegation");

// node_modules/@dfinity/agent/lib/esm/auth.js
var SignIdentity = class {
  /**
   * Get the principal represented by this identity. Normally should be a
   * `Principal.selfAuthenticating()`.
   */
  getPrincipal() {
    if (!this._principal) {
      this._principal = Principal.selfAuthenticating(new Uint8Array(this.getPublicKey().toDer()));
    }
    return this._principal;
  }
  /**
   * Transform a request into a signed version of the request. This is done last
   * after the transforms on the body of a request. The returned object can be
   * anything, but must be serializable to CBOR.
   * @param request - internet computer request to transform
   */
  async transformRequest(request2) {
    const { body, ...fields } = request2;
    const requestId = requestIdOf(body);
    return {
      ...fields,
      body: {
        content: body,
        sender_pubkey: this.getPublicKey().toDer(),
        sender_sig: await this.sign(concatBytes(IC_REQUEST_DOMAIN_SEPARATOR, requestId))
      }
    };
  }
};
var AnonymousIdentity = class {
  getPrincipal() {
    return Principal.anonymous();
  }
  async transformRequest(request2) {
    return {
      ...request2,
      body: { content: request2.body }
    };
  }
};
function createIdentityDescriptor(identity) {
  const identityIndicator = "getPublicKey" in identity ? { type: "PublicKeyIdentity", publicKey: bytesToHex(identity.getPublicKey().toDer()) } : { type: "AnonymousIdentity" };
  return identityIndicator;
}

// node_modules/@dfinity/agent/lib/esm/cbor.js
var import_dist22 = __toESM(require_dist(), 1);
var import_dist23 = __toESM(require_dist2(), 1);
var import_dist24 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/cbor/dist/cbor.mjs
var import_dist19 = __toESM(require_dist(), 1);
var import_dist20 = __toESM(require_dist2(), 1);
var import_dist21 = __toESM(require_dist3(), 1);
var w = class extends Error {
  constructor(n) {
    super(n), this.name = "DecodingError";
  }
};
var m = 55799;
var L = Symbol("CBOR_STOP_CODE");
var g = ((t) => (t[t.False = 20] = "False", t[t.True = 21] = "True", t[t.Null = 22] = "Null", t[t.Undefined = 23] = "Undefined", t[t.Break = 31] = "Break", t))(g || {});
var c = ((t) => (t[t.UnsignedInteger = 0] = "UnsignedInteger", t[t.NegativeInteger = 1] = "NegativeInteger", t[t.ByteString = 2] = "ByteString", t[t.TextString = 3] = "TextString", t[t.Array = 4] = "Array", t[t.Map = 5] = "Map", t[t.Tag = 6] = "Tag", t[t.Simple = 7] = "Simple", t))(c || {});
var z = 23;
var Y = 255;
var G = 65535;
var P = 4294967295;
var H = BigInt("0xffffffffffffffff");
var d = ((t) => (t[t.Value = 23] = "Value", t[t.OneByte = 24] = "OneByte", t[t.TwoBytes = 25] = "TwoBytes", t[t.FourBytes = 26] = "FourBytes", t[t.EightBytes = 27] = "EightBytes", t[t.Indefinite = 31] = "Indefinite", t))(d || {});
var h = false;
function W(t) {
  return t == null;
}
function R(t, n) {
  const e = new Uint8Array(n);
  return e.set(t), e;
}
var K = new TextDecoder();
function Z(t) {
  return (t & 224) >> 5;
}
function q(t) {
  return t & 31;
}
var A = new Uint8Array();
var y;
var a = 0;
function ut(t, n) {
  A = t, a = 0;
  const e = B(n);
  return (n == null ? void 0 : n(e)) ?? e;
}
function B(t) {
  const [n, e] = N();
  switch (n) {
    case c.UnsignedInteger:
      return E(e);
    case c.NegativeInteger:
      return j(e);
    case c.ByteString:
      return $(e);
    case c.TextString:
      return F(e);
    case c.Array:
      return J(e, t);
    case c.Map:
      return b(e, t);
    case c.Tag:
      return M(e, t);
    case c.Simple:
      return Q(e);
  }
  throw new w(`Unsupported major type: ${n}`);
}
function N() {
  const t = A.at(a);
  if (W(t))
    throw new w("Provided CBOR data is empty");
  const n = Z(t), e = q(t);
  return a++, [n, e];
}
function J(t, n) {
  const e = E(t);
  if (e === 1 / 0) {
    const u = [];
    let f = B(n);
    for (; f !== L; )
      u.push((n == null ? void 0 : n(f)) ?? f), f = B(n);
    return u;
  }
  const i = new Array(e);
  for (let u = 0; u < e; u++) {
    const f = B(n);
    i[u] = (n == null ? void 0 : n(f)) ?? f;
  }
  return i;
}
function Q(t) {
  switch (t) {
    case g.False:
      return false;
    case g.True:
      return true;
    case g.Null:
      return null;
    case g.Undefined:
      return;
    case g.Break:
      return L;
  }
  throw new w(`Unrecognized simple type: ${t.toString(2)}`);
}
function b(t, n) {
  const e = E(t), i = {};
  if (e === 1 / 0) {
    let [u, f] = N();
    for (; u !== c.Simple && f !== g.Break; ) {
      const l = F(f), U = B(n);
      i[l] = (n == null ? void 0 : n(U, l)) ?? U, [u, f] = N();
    }
    return i;
  }
  for (let u = 0; u < e; u++) {
    const [f, l] = N();
    if (f !== c.TextString)
      throw new w("Map keys must be text strings");
    const U = F(l), D = B(n);
    i[U] = (n == null ? void 0 : n(D, U)) ?? D;
  }
  return i;
}
function E(t) {
  if (t <= d.Value)
    return t;
  switch (y = new DataView(A.buffer, A.byteOffset + a), t) {
    case d.OneByte:
      return a++, y.getUint8(0);
    case d.TwoBytes:
      return a += 2, y.getUint16(0, h);
    case d.FourBytes:
      return a += 4, y.getUint32(0, h);
    case d.EightBytes:
      return a += 8, y.getBigUint64(0, h);
    case d.Indefinite:
      return 1 / 0;
    default:
      throw new w(`Unsupported integer info: ${t.toString(2)}`);
  }
}
function j(t) {
  const n = E(t);
  return typeof n == "number" ? -1 - n : -1n - n;
}
function $(t) {
  const n = E(t);
  if (n > Number.MAX_SAFE_INTEGER)
    throw new w("Byte length is too large");
  const e = Number(n);
  return a += e, A.slice(a - e, a);
}
function F(t) {
  const n = $(t);
  return K.decode(n);
}
function M(t, n) {
  const e = E(t);
  if (e === m)
    return B(n);
  throw new w(`Unsupported tag: ${e}.`);
}
var x = class extends Error {
  constructor(n) {
    super(n), this.name = "SerializationError";
  }
};
var p = 2 * 1024;
var C = 100;
var v = new TextEncoder();
function S(t) {
  return t << 5;
}
var o = new Uint8Array(p);
var r = new DataView(o.buffer);
var s = 0;
var O = [];
function dt(t, n) {
  s = 0;
  const e = (n == null ? void 0 : n(t)) ?? t;
  return it(m, e, n), o.slice(0, s);
}
function _(t, n) {
  if (s > o.length - C && (o = R(o, o.length * 2), r = new DataView(o.buffer)), t === false || t === true || t === null || t === void 0) {
    et(t);
    return;
  }
  if (typeof t == "number" || typeof t == "bigint") {
    ft(t);
    return;
  }
  if (typeof t == "string") {
    X(t);
    return;
  }
  if (t instanceof Uint8Array) {
    V(t);
    return;
  }
  if (t instanceof ArrayBuffer) {
    V(new Uint8Array(t));
    return;
  }
  if (Array.isArray(t)) {
    tt(t, n);
    return;
  }
  if (typeof t == "object") {
    nt(t, n);
    return;
  }
  throw new x(`Unsupported type: ${typeof t}`);
}
function tt(t, n) {
  I(c.Array, t.length), t.forEach((e, i) => {
    _((n == null ? void 0 : n(e, i.toString())) ?? e, n);
  });
}
function nt(t, n) {
  O = Object.entries(t), I(c.Map, O.length), O.forEach(([e, i]) => {
    X(e), _((n == null ? void 0 : n(i, e)) ?? i, n);
  });
}
function I(t, n) {
  if (n <= z) {
    r.setUint8(
      s++,
      S(t) | Number(n)
    );
    return;
  }
  if (n <= Y) {
    r.setUint8(
      s++,
      S(t) | d.OneByte
    ), r.setUint8(s, Number(n)), s += 1;
    return;
  }
  if (n <= G) {
    r.setUint8(
      s++,
      S(t) | d.TwoBytes
    ), r.setUint16(s, Number(n), h), s += 2;
    return;
  }
  if (n <= P) {
    r.setUint8(
      s++,
      S(t) | d.FourBytes
    ), r.setUint32(s, Number(n), h), s += 4;
    return;
  }
  if (n <= H) {
    r.setUint8(
      s++,
      S(t) | d.EightBytes
    ), r.setBigUint64(s, BigInt(n), h), s += 8;
    return;
  }
  throw new x(`Value too large to encode: ${n}`);
}
function et(t) {
  I(c.Simple, st(t));
}
function st(t) {
  if (t === false)
    return g.False;
  if (t === true)
    return g.True;
  if (t === null)
    return g.Null;
  if (t === void 0)
    return g.Undefined;
  throw new x(`Unrecognized simple value: ${t.toString()}`);
}
function k(t, n) {
  I(t, n.length), s > o.length - n.length && (o = R(o, o.length + n.length), r = new DataView(o.buffer)), o.set(n, s), s += n.length;
}
function T(t, n) {
  I(t, n);
}
function ct(t) {
  T(c.UnsignedInteger, t);
}
function ot(t) {
  T(
    c.NegativeInteger,
    typeof t == "bigint" ? -1n - t : -1 - t
  );
}
function ft(t) {
  t >= 0 ? ct(t) : ot(t);
}
function X(t) {
  k(c.TextString, v.encode(t));
}
function V(t) {
  k(c.ByteString, t);
}
function it(t, n, e) {
  I(c.Tag, t), _(n, e);
}

// node_modules/@dfinity/agent/lib/esm/cbor.js
var ToCborValue = class {
};
function hasCborValueMethod(value) {
  return typeof value === "object" && value !== null && "toCborValue" in value;
}
function encode(value) {
  try {
    return dt(value, (value2) => {
      if (Principal.isPrincipal(value2)) {
        return value2.toUint8Array();
      }
      if (Expiry.isExpiry(value2)) {
        return value2.toBigInt();
      }
      if (hasCborValueMethod(value2)) {
        return value2.toCborValue();
      }
      return value2;
    });
  } catch (error) {
    throw InputError.fromCode(new CborEncodeErrorCode(error, value));
  }
}
function decode(input) {
  try {
    return ut(input);
  } catch (error) {
    throw InputError.fromCode(new CborDecodeErrorCode(error, input));
  }
}
var Cbor = {
  encode,
  decode
};

// node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js
var import_dist31 = __toESM(require_dist(), 1);
var import_dist32 = __toESM(require_dist2(), 1);
var import_dist33 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/agent/http/types.js
var import_dist28 = __toESM(require_dist(), 1);
var import_dist29 = __toESM(require_dist2(), 1);
var import_dist30 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/utils/random.js
var import_dist25 = __toESM(require_dist(), 1);
var import_dist26 = __toESM(require_dist2(), 1);
var import_dist27 = __toESM(require_dist3(), 1);
var randomNumber = () => {
  if (typeof window !== "undefined" && !!window.crypto && !!window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0];
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0];
  }
  if (typeof crypto !== "undefined" && crypto.randomInt) {
    return crypto.randomInt(0, 4294967295);
  }
  return Math.floor(Math.random() * 4294967295);
};

// node_modules/@dfinity/agent/lib/esm/agent/http/types.js
var Endpoint;
(function(Endpoint2) {
  Endpoint2["Query"] = "read";
  Endpoint2["ReadState"] = "read_state";
  Endpoint2["Call"] = "call";
})(Endpoint || (Endpoint = {}));
var SubmitRequestType;
(function(SubmitRequestType2) {
  SubmitRequestType2["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
var ReadRequestType;
(function(ReadRequestType2) {
  ReadRequestType2["Query"] = "query";
  ReadRequestType2["ReadState"] = "read_state";
})(ReadRequestType || (ReadRequestType = {}));
function makeNonce() {
  const buffer = new ArrayBuffer(16);
  const view = new DataView(buffer);
  const rand1 = randomNumber();
  const rand2 = randomNumber();
  const rand3 = randomNumber();
  const rand4 = randomNumber();
  view.setUint32(0, rand1);
  view.setUint32(4, rand2);
  view.setUint32(8, rand3);
  view.setUint32(12, rand4);
  return Object.assign(new Uint8Array(buffer), { __nonce__: void 0 });
}

// node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js
var JSON_KEY_EXPIRY = "__expiry__";
var SECONDS_TO_MILLISECONDS = BigInt(1e3);
var MILLISECONDS_TO_NANOSECONDS = BigInt(1e6);
var MINUTES_TO_SECONDS = BigInt(60);
var EXPIRY_DELTA_THRESHOLD_MILLISECONDS = BigInt(90) * SECONDS_TO_MILLISECONDS;
function roundMillisToSeconds(millis) {
  return millis / SECONDS_TO_MILLISECONDS;
}
function roundMillisToMinutes(millis) {
  return roundMillisToSeconds(millis) / MINUTES_TO_SECONDS;
}
var Expiry = class _Expiry {
  constructor(__expiry__) {
    this.__expiry__ = __expiry__;
    this._isExpiry = true;
  }
  /**
   * Creates an Expiry object from a delta in milliseconds.
   * If the delta is less than 90 seconds, the expiry is rounded down to the nearest second.
   * Otherwise, the expiry is rounded down to the nearest minute.
   * @param deltaInMs The milliseconds to add to the current time.
   * @param clockDriftMs The milliseconds to add to the current time, typically the clock drift between IC network clock and the client's clock. Defaults to `0` if not provided.
   * @returns {Expiry} The constructed Expiry object.
   */
  static fromDeltaInMilliseconds(deltaInMs, clockDriftMs = 0) {
    const deltaMs = BigInt(deltaInMs);
    const expiryMs = BigInt(Date.now()) + deltaMs + BigInt(clockDriftMs);
    let roundedExpirySeconds;
    if (deltaMs < EXPIRY_DELTA_THRESHOLD_MILLISECONDS) {
      roundedExpirySeconds = roundMillisToSeconds(expiryMs);
    } else {
      const roundedExpiryMinutes = roundMillisToMinutes(expiryMs);
      roundedExpirySeconds = roundedExpiryMinutes * MINUTES_TO_SECONDS;
    }
    return new _Expiry(roundedExpirySeconds * SECONDS_TO_MILLISECONDS * MILLISECONDS_TO_NANOSECONDS);
  }
  toBigInt() {
    return this.__expiry__;
  }
  toHash() {
    return lebEncode(this.__expiry__);
  }
  toString() {
    return this.__expiry__.toString();
  }
  /**
   * Serializes to JSON
   * @returns {JsonnableExpiry} a JSON object with a single key, {@link JSON_KEY_EXPIRY}, whose value is the expiry as a string
   */
  toJSON() {
    return { [JSON_KEY_EXPIRY]: this.toString() };
  }
  /**
   * Deserializes a {@link JsonnableExpiry} object from a JSON string.
   * @param input The JSON string to deserialize.
   * @returns {Expiry} The deserialized Expiry object.
   */
  static fromJSON(input) {
    const obj = JSON.parse(input);
    if (obj[JSON_KEY_EXPIRY]) {
      try {
        const expiry = BigInt(obj[JSON_KEY_EXPIRY]);
        return new _Expiry(expiry);
      } catch (error) {
        throw new InputError(new ExpiryJsonDeserializeErrorCode(`Not a valid BigInt: ${error}`));
      }
    }
    throw new InputError(new ExpiryJsonDeserializeErrorCode(`The input does not contain the key ${JSON_KEY_EXPIRY}`));
  }
  static isExpiry(other) {
    return other instanceof _Expiry || typeof other === "object" && other !== null && "_isExpiry" in other && other["_isExpiry"] === true && "__expiry__" in other && typeof other["__expiry__"] === "bigint";
  }
};
function makeNonceTransform(nonceFn = makeNonce) {
  return async (request2) => {
    const headers = request2.request.headers;
    request2.request.headers = headers;
    if (request2.endpoint === Endpoint.Call) {
      request2.body.nonce = nonceFn();
    }
  };
}
function makeExpiryTransform(delayInMilliseconds) {
  return async (request2) => {
    request2.body.ingress_expiry = Expiry.fromDeltaInMilliseconds(delayInMilliseconds);
  };
}
function httpHeadersTransform(headers) {
  const headerFields = [];
  headers.forEach((value, key) => {
    headerFields.push([key, value]);
  });
  return headerFields;
}

// node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js
var canisterStatus_exports = {};
__export(canisterStatus_exports, {
  CustomPath: () => CustomPath,
  encodePath: () => encodePath,
  fetchNodeKeys: () => fetchNodeKeys,
  request: () => request
});
var import_dist70 = __toESM(require_dist(), 1);
var import_dist71 = __toESM(require_dist2(), 1);
var import_dist72 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/certificate.js
var import_dist67 = __toESM(require_dist(), 1);
var import_dist68 = __toESM(require_dist2(), 1);
var import_dist69 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/utils/bls.js
var import_dist61 = __toESM(require_dist(), 1);
var import_dist62 = __toESM(require_dist2(), 1);
var import_dist63 = __toESM(require_dist3(), 1);

// node_modules/@noble/curves/esm/bls12-381.js
var import_dist58 = __toESM(require_dist());
var import_dist59 = __toESM(require_dist2());
var import_dist60 = __toESM(require_dist3());

// node_modules/@noble/curves/esm/abstract/bls.js
var import_dist52 = __toESM(require_dist(), 1);
var import_dist53 = __toESM(require_dist2(), 1);
var import_dist54 = __toESM(require_dist3(), 1);

// node_modules/@noble/curves/esm/utils.js
var import_dist34 = __toESM(require_dist(), 1);
var import_dist35 = __toESM(require_dist2(), 1);
var import_dist36 = __toESM(require_dist3(), 1);
var _0n = BigInt(0);
var _1n = BigInt(1);
function _abool2(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}"`;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function _abytes2(value, length, title = "") {
  const bytes = isBytes(value);
  const len = value == null ? void 0 : value.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function equalBytes(a2, b2) {
  if (a2.length !== b2.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a2.length; i++)
    diff |= a2[i] ^ b2[i];
  return diff === 0;
}
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
var isPosBig = (n) => typeof n === "bigint" && _0n <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n;
}
var bitMask = (n) => (_1n << BigInt(n)) - _1n;
function isHash(val) {
  return typeof val === "function" && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
  if (!object || typeof object !== "object")
    throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0)
      return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  Object.entries(fields).forEach(([k2, v2]) => checkField(k2, v2, false));
  Object.entries(optFields).forEach(([k2, v2]) => checkField(k2, v2, true));
}
var notImplemented = () => {
  throw new Error("not implemented");
};
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

// node_modules/@noble/curves/esm/abstract/curve.js
var import_dist40 = __toESM(require_dist(), 1);
var import_dist41 = __toESM(require_dist2(), 1);
var import_dist42 = __toESM(require_dist3(), 1);

// node_modules/@noble/curves/esm/abstract/modular.js
var import_dist37 = __toESM(require_dist(), 1);
var import_dist38 = __toESM(require_dist2(), 1);
var import_dist39 = __toESM(require_dist3(), 1);
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _7n = BigInt(7);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a2, b2) {
  const result = a2 % b2;
  return result >= _0n2 ? result : b2 + result;
}
function pow2(x2, power, modulo) {
  let res = x2;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a2 = mod(number, modulo);
  let b2 = modulo;
  let x2 = _0n2, y2 = _1n2, u = _1n2, v2 = _0n2;
  while (a2 !== _0n2) {
    const q2 = b2 / a2;
    const r2 = b2 % a2;
    const m2 = x2 - u * q2;
    const n = y2 - v2 * q2;
    b2 = a2, a2 = r2, x2 = u, y2 = v2, u = m2, v2 = n;
  }
  const gcd = b2;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x2, modulo);
}
function assertIsSquare(Fp4, root, n) {
  if (!Fp4.eql(Fp4.sqr(root), n))
    throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp4, n) {
  const p1div4 = (Fp4.ORDER + _1n2) / _4n;
  const root = Fp4.pow(n, p1div4);
  assertIsSquare(Fp4, root, n);
  return root;
}
function sqrt5mod8(Fp4, n) {
  const p5div8 = (Fp4.ORDER - _5n) / _8n;
  const n2 = Fp4.mul(n, _2n);
  const v2 = Fp4.pow(n2, p5div8);
  const nv = Fp4.mul(n, v2);
  const i = Fp4.mul(Fp4.mul(nv, _2n), v2);
  const root = Fp4.mul(nv, Fp4.sub(i, Fp4.ONE));
  assertIsSquare(Fp4, root, n);
  return root;
}
function sqrt9mod16(P2) {
  const Fp_ = Field(P2);
  const tn = tonelliShanks(P2);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P2 + _7n) / _16n;
  return (Fp4, n) => {
    let tv1 = Fp4.pow(n, c4);
    let tv2 = Fp4.mul(tv1, c1);
    const tv3 = Fp4.mul(tv1, c2);
    const tv4 = Fp4.mul(tv1, c3);
    const e1 = Fp4.eql(Fp4.sqr(tv2), n);
    const e2 = Fp4.eql(Fp4.sqr(tv3), n);
    tv1 = Fp4.cmov(tv1, tv2, e1);
    tv2 = Fp4.cmov(tv4, tv3, e2);
    const e3 = Fp4.eql(Fp4.sqr(tv2), n);
    const root = Fp4.cmov(tv1, tv2, e3);
    assertIsSquare(Fp4, root, n);
    return root;
  };
}
function tonelliShanks(P2) {
  if (P2 < _3n)
    throw new Error("sqrt is not defined for small field");
  let Q2 = P2 - _1n2;
  let S2 = 0;
  while (Q2 % _2n === _0n2) {
    Q2 /= _2n;
    S2++;
  }
  let Z2 = _2n;
  const _Fp = Field(P2);
  while (FpLegendre(_Fp, Z2) === 1) {
    if (Z2++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S2 === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z2, Q2);
  const Q1div2 = (Q2 + _1n2) / _2n;
  return function tonelliSlow(Fp4, n) {
    if (Fp4.is0(n))
      return n;
    if (FpLegendre(Fp4, n) !== 1)
      throw new Error("Cannot find square root");
    let M2 = S2;
    let c2 = Fp4.mul(Fp4.ONE, cc);
    let t = Fp4.pow(n, Q2);
    let R2 = Fp4.pow(n, Q1div2);
    while (!Fp4.eql(t, Fp4.ONE)) {
      if (Fp4.is0(t))
        return Fp4.ZERO;
      let i = 1;
      let t_tmp = Fp4.sqr(t);
      while (!Fp4.eql(t_tmp, Fp4.ONE)) {
        i++;
        t_tmp = Fp4.sqr(t_tmp);
        if (i === M2)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M2 - i - 1);
      const b2 = Fp4.pow(c2, exponent);
      M2 = i;
      c2 = Fp4.sqr(b2);
      t = Fp4.mul(t, c2);
      R2 = Fp4.mul(R2, b2);
    }
    return R2;
  };
}
function FpSqrt(P2) {
  if (P2 % _4n === _3n)
    return sqrt3mod4;
  if (P2 % _8n === _5n)
    return sqrt5mod8;
  if (P2 % _16n === _9n)
    return sqrt9mod16(P2);
  return tonelliShanks(P2);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "number",
    BITS: "number"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  _validateObject(field, opts);
  return field;
}
function FpPow(Fp4, num, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return Fp4.ONE;
  if (power === _1n2)
    return num;
  let p2 = Fp4.ONE;
  let d2 = num;
  while (power > _0n2) {
    if (power & _1n2)
      p2 = Fp4.mul(p2, d2);
    d2 = Fp4.sqr(d2);
    power >>= _1n2;
  }
  return p2;
}
function FpInvertBatch(Fp4, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp4.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp4.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp4.mul(acc, num);
  }, Fp4.ONE);
  const invertedAcc = Fp4.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp4.is0(num))
      return acc;
    inverted[i] = Fp4.mul(acc, inverted[i]);
    return Fp4.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp4, n) {
  const p1mod2 = (Fp4.ORDER - _1n2) / _2n;
  const powered = Fp4.pow(n, p1mod2);
  const yes = Fp4.eql(powered, Fp4.ONE);
  const zero = Fp4.eql(powered, Fp4.ZERO);
  const no = Fp4.eql(powered, Fp4.neg(Fp4.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
  if (ORDER <= _0n2)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  let _nbitLength = void 0;
  let _sqrt = void 0;
  let modFromBytes = false;
  let allowedLengths = void 0;
  if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
    if (opts.sqrt || isLE)
      throw new Error("cannot specify opts in two arguments");
    const _opts = bitLenOrOpts;
    if (_opts.BITS)
      _nbitLength = _opts.BITS;
    if (_opts.sqrt)
      _sqrt = _opts.sqrt;
    if (typeof _opts.isLE === "boolean")
      isLE = _opts.isLE;
    if (typeof _opts.modFromBytes === "boolean")
      modFromBytes = _opts.modFromBytes;
    allowedLengths = _opts.allowedLengths;
  } else {
    if (typeof bitLenOrOpts === "number")
      _nbitLength = bitLenOrOpts;
    if (opts.sqrt)
      _sqrt = opts.sqrt;
  }
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    allowedLengths,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    // is valid and invertible
    isValidNot0: (num) => !f.is0(num) && f.isValid(num),
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: _sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes, skipValidation = true) => {
      if (allowedLengths) {
        if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      if (modFromBytes)
        scalar = mod(scalar, ORDER);
      if (!skipValidation) {
        if (!f.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a2, b2, c2) => c2 ? b2 : a2
  });
  return Object.freeze(f);
}
function FpSqrtEven(Fp4, elm) {
  if (!Fp4.isOdd)
    throw new Error("Field doesn't have isOdd");
  const root = Fp4.sqrt(elm);
  return Fp4.isOdd(root) ? Fp4.neg(root) : root;
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function normalizeZ(c2, points) {
  const invertedZs = FpInvertBatch(c2.Fp, points.map((p2) => p2.Z));
  return points.map((p2, i) => c2.fromAffine(p2.toAffine(invertedZs[i])));
}
function validateW(W2, bits) {
  if (!Number.isSafeInteger(W2) || W2 <= 0 || W2 > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W2);
}
function calcWOpts(W2, scalarBits) {
  validateW(W2, scalarBits);
  const windows = Math.ceil(scalarBits / W2) + 1;
  const windowSize = 2 ** (W2 - 1);
  const maxNumber = 2 ** W2;
  const mask = bitMask(W2);
  const shiftBy = BigInt(W2);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window2, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window2 * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window2 % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c2) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p2, i) => {
    if (!(p2 instanceof c2))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s2, i) => {
    if (!field.isValid(s2))
      throw new Error("invalid scalar at index " + i);
  });
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P2) {
  return pointWindowSizes.get(P2) || 1;
}
function assert0(n) {
  if (n !== _0n3)
    throw new Error("invalid wNAF");
}
var wNAF = class {
  // Parametrized with a given Point class (not individual point)
  constructor(Point, bits) {
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.Fn = Point.Fn;
    this.bits = bits;
  }
  // non-const time multiplication ladder
  _unsafeLadder(elm, n, p2 = this.ZERO) {
    let d2 = elm;
    while (n > _0n3) {
      if (n & _1n3)
        p2 = p2.add(d2);
      d2 = d2.double();
      n >>= _1n3;
    }
    return p2;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W2) {
    const { windows, windowSize } = calcWOpts(W2, this.bits);
    const points = [];
    let p2 = point;
    let base = p2;
    for (let window2 = 0; window2 < windows; window2++) {
      base = p2;
      points.push(base);
      for (let i = 1; i < windowSize; i++) {
        base = base.add(p2);
        points.push(base);
      }
      p2 = base.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W2, precomputes, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let p2 = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W2, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        f = f.add(negateCt(isNegF, precomputes[offsetF]));
      } else {
        p2 = p2.add(negateCt(isNeg, precomputes[offset]));
      }
    }
    assert0(n);
    return { p: p2, f };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W2, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W2, this.bits);
    for (let window2 = 0; window2 < wo.windows; window2++) {
      if (n === _0n3)
        break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
      n = nextN;
      if (isZero) {
        continue;
      } else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W2, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W2);
      if (W2 !== 1) {
        if (typeof transform === "function")
          comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W2 = getW(point);
    return this.wNAF(W2, this.getPrecomputes(W2, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W2 = getW(point);
    if (W2 === 1)
      return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W2, this.getPrecomputes(W2, point, transform), scalar, prev);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(P2, W2) {
    validateW(W2, this.bits);
    pointWindowSizes.set(P2, W2);
    pointPrecomputes.delete(P2);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
function mulEndoUnsafe(Point, point, k1, k2) {
  let acc = point;
  let p1 = Point.ZERO;
  let p2 = Point.ZERO;
  while (k1 > _0n3 || k2 > _0n3) {
    if (k1 & _1n3)
      p1 = p1.add(acc);
    if (k2 & _1n3)
      p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n3;
    k2 >>= _1n3;
  }
  return { p1, p2 };
}
function pippenger(c2, fieldN, points, scalars) {
  validateMSMPoints(points, c2);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c2.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j2 = 0; j2 < slength; j2++) {
      const scalar = scalars[j2];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j2]);
    }
    let resI = zero;
    for (let j2 = buckets.length - 1, sumI = zero; j2 > 0; j2--) {
      sumI = sumI.add(buckets[j2]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j2 = 0; j2 < windowSize; j2++)
        sum = sum.double();
  }
  return sum;
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else {
    return Field(order, { isLE });
  }
}
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0)
    FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object")
    throw new Error(`expected valid ${type} CURVE object`);
  for (const p2 of ["p", "n", "h"]) {
    const val = CURVE[p2];
    if (!(typeof val === "bigint" && val > _0n3))
      throw new Error(`CURVE.${p2} must be positive bigint`);
  }
  const Fp4 = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn2 = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const _b2 = type === "weierstrass" ? "b" : "d";
  const params = ["Gx", "Gy", "a", _b2];
  for (const p2 of params) {
    if (!Fp4.isValid(CURVE[p2]))
      throw new Error(`CURVE.${p2} must be valid field element of CURVE.Fp`);
  }
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return { CURVE, Fp: Fp4, Fn: Fn2 };
}

// node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var import_dist43 = __toESM(require_dist(), 1);
var import_dist44 = __toESM(require_dist2(), 1);
var import_dist45 = __toESM(require_dist3(), 1);
var os2ip = bytesToNumberBE;
function i2osp(value, length) {
  anum(value);
  anum(length);
  if (value < 0 || value >= 1 << 8 * length)
    throw new Error("invalid I2OSP input: " + value);
  const res = Array.from({ length }).fill(0);
  for (let i = length - 1; i >= 0; i--) {
    res[i] = value & 255;
    value >>>= 8;
  }
  return new Uint8Array(res);
}
function strxor(a2, b2) {
  const arr = new Uint8Array(a2.length);
  for (let i = 0; i < a2.length; i++) {
    arr[i] = a2[i] ^ b2[i];
  }
  return arr;
}
function anum(item) {
  if (!Number.isSafeInteger(item))
    throw new Error("number expected");
}
function normDST(DST) {
  if (!isBytes(DST) && typeof DST !== "string")
    throw new Error("DST must be Uint8Array or string");
  return typeof DST === "string" ? utf8ToBytes(DST) : DST;
}
function expand_message_xmd(msg, DST, lenInBytes, H2) {
  abytes(msg);
  anum(lenInBytes);
  DST = normDST(DST);
  if (DST.length > 255)
    DST = H2(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
  const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H2;
  const ell = Math.ceil(lenInBytes / b_in_bytes);
  if (lenInBytes > 65535 || ell > 255)
    throw new Error("expand_message_xmd: invalid lenInBytes");
  const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
  const Z_pad = i2osp(0, r_in_bytes);
  const l_i_b_str = i2osp(lenInBytes, 2);
  const b2 = new Array(ell);
  const b_0 = H2(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
  b2[0] = H2(concatBytes(b_0, i2osp(1, 1), DST_prime));
  for (let i = 1; i <= ell; i++) {
    const args = [strxor(b_0, b2[i - 1]), i2osp(i + 1, 1), DST_prime];
    b2[i] = H2(concatBytes(...args));
  }
  const pseudo_random_bytes = concatBytes(...b2);
  return pseudo_random_bytes.slice(0, lenInBytes);
}
function expand_message_xof(msg, DST, lenInBytes, k2, H2) {
  abytes(msg);
  anum(lenInBytes);
  DST = normDST(DST);
  if (DST.length > 255) {
    const dkLen = Math.ceil(2 * k2 / 8);
    DST = H2.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
  }
  if (lenInBytes > 65535 || DST.length > 255)
    throw new Error("expand_message_xof: invalid lenInBytes");
  return H2.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
function hash_to_field(msg, count, options) {
  _validateObject(options, {
    p: "bigint",
    m: "number",
    k: "number",
    hash: "function"
  });
  const { p: p2, k: k2, m: m2, hash, expand, DST } = options;
  if (!isHash(options.hash))
    throw new Error("expected valid hash");
  abytes(msg);
  anum(count);
  const log2p = p2.toString(2).length;
  const L2 = Math.ceil((log2p + k2) / 8);
  const len_in_bytes = count * m2 * L2;
  let prb;
  if (expand === "xmd") {
    prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
  } else if (expand === "xof") {
    prb = expand_message_xof(msg, DST, len_in_bytes, k2, hash);
  } else if (expand === "_internal_pass") {
    prb = msg;
  } else {
    throw new Error('expand must be "xmd" or "xof"');
  }
  const u = new Array(count);
  for (let i = 0; i < count; i++) {
    const e = new Array(m2);
    for (let j2 = 0; j2 < m2; j2++) {
      const elm_offset = L2 * (j2 + i * m2);
      const tv = prb.subarray(elm_offset, elm_offset + L2);
      e[j2] = mod(os2ip(tv), p2);
    }
    u[i] = e;
  }
  return u;
}
function isogenyMap(field, map) {
  const coeff = map.map((i) => Array.from(i).reverse());
  return (x2, y2) => {
    const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x2), i)));
    const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
    x2 = field.mul(xn, xd_inv);
    y2 = field.mul(y2, field.mul(yn, yd_inv));
    return { x: x2, y: y2 };
  };
}
var _DST_scalar = utf8ToBytes("HashToScalar-");
function createHasher(Point, mapToCurve, defaults) {
  if (typeof mapToCurve !== "function")
    throw new Error("mapToCurve() must be defined");
  function map(num) {
    return Point.fromAffine(mapToCurve(num));
  }
  function clear(initial) {
    const P2 = initial.clearCofactor();
    if (P2.equals(Point.ZERO))
      return Point.ZERO;
    P2.assertValidity();
    return P2;
  }
  return {
    defaults,
    hashToCurve(msg, options) {
      const opts = Object.assign({}, defaults, options);
      const u = hash_to_field(msg, 2, opts);
      const u0 = map(u[0]);
      const u1 = map(u[1]);
      return clear(u0.add(u1));
    },
    encodeToCurve(msg, options) {
      const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
      const opts = Object.assign({}, defaults, optsDst, options);
      const u = hash_to_field(msg, 1, opts);
      const u0 = map(u[0]);
      return clear(u0);
    },
    /** See {@link H2CHasher} */
    mapToCurve(scalars) {
      if (!Array.isArray(scalars))
        throw new Error("expected array of bigints");
      for (const i of scalars)
        if (typeof i !== "bigint")
          throw new Error("expected array of bigints");
      return clear(map(scalars));
    },
    // hash_to_scalar can produce 0: https://www.rfc-editor.org/errata/eid8393
    // RFC 9380, draft-irtf-cfrg-bbs-signatures-08
    hashToScalar(msg, options) {
      const N2 = Point.Fn.ORDER;
      const opts = Object.assign({}, defaults, { p: N2, m: 1, DST: _DST_scalar }, options);
      return hash_to_field(msg, 1, opts)[0][0];
    }
  };
}

// node_modules/@noble/curves/esm/abstract/weierstrass.js
var import_dist49 = __toESM(require_dist(), 1);
var import_dist50 = __toESM(require_dist2(), 1);
var import_dist51 = __toESM(require_dist3(), 1);

// node_modules/@noble/hashes/esm/hmac.js
var import_dist46 = __toESM(require_dist());
var import_dist47 = __toESM(require_dist2());
var import_dist48 = __toESM(require_dist3());
var HMAC = class extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    ahash(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

// node_modules/@noble/curves/esm/abstract/weierstrass.js
var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n2) / den;
function _splitEndoScalar(k2, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k2, n);
  const c2 = divNearest(-b1 * k2, n);
  let k1 = k2 - c1 * a1 - c2 * a2;
  let k22 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n4;
  const k2neg = k22 < _0n4;
  if (k1neg)
    k1 = -k1;
  if (k2neg)
    k22 = -k22;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n4;
  if (k1 < _0n4 || k1 >= MAX_NUM || k22 < _0n4 || k22 >= MAX_NUM) {
    throw new Error("splitScalar (endomorphism): failed, k=" + k2);
  }
  return { k1neg, k1, k2neg, k2: k22 };
}
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n2 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function _normFnElement(Fn2, key) {
  const { BYTES: expected } = Fn2;
  let num;
  if (typeof key === "bigint") {
    num = key;
  } else {
    let bytes = ensureBytes("private key", key);
    try {
      num = Fn2.fromBytes(bytes);
    } catch (error) {
      throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
    }
  }
  if (!Fn2.isValidNot0(num))
    throw new Error("invalid private key: out of range [1..N-1]");
  return num;
}
function weierstrassN(params, extraOpts = {}) {
  const validated = _createCurveFields("weierstrass", params, extraOpts);
  const { Fp: Fp4, Fn: Fn2 } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  _validateObject(extraOpts, {}, {
    allowInfinityPoint: "boolean",
    clearCofactor: "function",
    isTorsionFree: "function",
    fromBytes: "function",
    toBytes: "function",
    endo: "object",
    wrapPrivateKey: "boolean"
  });
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp4.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) {
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
    }
  }
  const lengths = getWLengths(Fp4, Fn2);
  function assertCompressionIsSupported() {
    if (!Fp4.isOdd)
      throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes(_c, point, isCompressed) {
    const { x: x2, y: y2 } = point.toAffine();
    const bx = Fp4.toBytes(x2);
    _abool2(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      const hasEvenY = !Fp4.isOdd(y2);
      return concatBytes(pprefix(hasEvenY), bx);
    } else {
      return concatBytes(Uint8Array.of(4), bx, Fp4.toBytes(y2));
    }
  }
  function pointFromBytes(bytes) {
    _abytes2(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x2 = Fp4.fromBytes(tail);
      if (!Fp4.isValid(x2))
        throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x2);
      let y3;
      try {
        y3 = Fp4.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const isYOdd = Fp4.isOdd(y3);
      const isHeadOdd = (head & 1) === 1;
      if (isHeadOdd !== isYOdd)
        y3 = Fp4.neg(y3);
      return { x: x2, y: y3 };
    } else if (length === uncomp && head === 4) {
      const L2 = Fp4.BYTES;
      const x2 = Fp4.fromBytes(tail.subarray(0, L2));
      const y2 = Fp4.fromBytes(tail.subarray(L2, L2 * 2));
      if (!isValidXY(x2, y2))
        throw new Error("bad point: is not on curve");
      return { x: x2, y: y2 };
    } else {
      throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
    }
  }
  const encodePoint = extraOpts.toBytes || pointToBytes;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x2) {
    const x22 = Fp4.sqr(x2);
    const x3 = Fp4.mul(x22, x2);
    return Fp4.add(Fp4.add(x3, Fp4.mul(x2, CURVE.a)), CURVE.b);
  }
  function isValidXY(x2, y2) {
    const left = Fp4.sqr(y2);
    const right = weierstrassEquation(x2);
    return Fp4.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp4.mul(Fp4.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp4.mul(Fp4.sqr(CURVE.b), BigInt(27));
  if (Fp4.is0(Fp4.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function acoord(title, n, banZero = false) {
    if (!Fp4.isValid(n) || banZero && Fp4.is0(n))
      throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ProjectivePoint expected");
  }
  function splitEndoScalarN(k2) {
    if (!endo || !endo.basises)
      throw new Error("no endo");
    return _splitEndoScalar(k2, endo.basises, Fn2.ORDER);
  }
  const toAffineMemo = memoized((p2, iz) => {
    const { X: X2, Y: Y2, Z: Z2 } = p2;
    if (Fp4.eql(Z2, Fp4.ONE))
      return { x: X2, y: Y2 };
    const is0 = p2.is0();
    if (iz == null)
      iz = is0 ? Fp4.ONE : Fp4.inv(Z2);
    const x2 = Fp4.mul(X2, iz);
    const y2 = Fp4.mul(Y2, iz);
    const zz = Fp4.mul(Z2, iz);
    if (is0)
      return { x: Fp4.ZERO, y: Fp4.ZERO };
    if (!Fp4.eql(zz, Fp4.ONE))
      throw new Error("invZ was invalid");
    return { x: x2, y: y2 };
  });
  const assertValidMemo = memoized((p2) => {
    if (p2.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp4.is0(p2.Y))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x: x2, y: y2 } = p2.toAffine();
    if (!Fp4.isValid(x2) || !Fp4.isValid(y2))
      throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x2, y2))
      throw new Error("bad point: equation left != right");
    if (!p2.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point(Fp4.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  class Point {
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X2, Y2, Z2) {
      this.X = acoord("x", X2);
      this.Y = acoord("y", Y2, true);
      this.Z = acoord("z", Z2);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p2) {
      const { x: x2, y: y2 } = p2 || {};
      if (!p2 || !Fp4.isValid(x2) || !Fp4.isValid(y2))
        throw new Error("invalid affine point");
      if (p2 instanceof Point)
        throw new Error("projective point not allowed");
      if (Fp4.is0(x2) && Fp4.is0(y2))
        return Point.ZERO;
      return new Point(x2, y2, Fp4.ONE);
    }
    static fromBytes(bytes) {
      const P2 = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
      P2.assertValidity();
      return P2;
    }
    static fromHex(hex) {
      return Point.fromBytes(ensureBytes("pointHex", hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_3n2);
      return this;
    }
    // TODO: return `this`
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y: y2 } = this.toAffine();
      if (!Fp4.isOdd)
        throw new Error("Field doesn't support isOdd");
      return !Fp4.isOdd(y2);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp4.eql(Fp4.mul(X1, Z2), Fp4.mul(X2, Z1));
      const U2 = Fp4.eql(Fp4.mul(Y1, Z2), Fp4.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp4.neg(this.Y), this.Z);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a: a2, b: b2 } = CURVE;
      const b3 = Fp4.mul(b2, _3n2);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp4.ZERO, Y3 = Fp4.ZERO, Z3 = Fp4.ZERO;
      let t0 = Fp4.mul(X1, X1);
      let t1 = Fp4.mul(Y1, Y1);
      let t2 = Fp4.mul(Z1, Z1);
      let t3 = Fp4.mul(X1, Y1);
      t3 = Fp4.add(t3, t3);
      Z3 = Fp4.mul(X1, Z1);
      Z3 = Fp4.add(Z3, Z3);
      X3 = Fp4.mul(a2, Z3);
      Y3 = Fp4.mul(b3, t2);
      Y3 = Fp4.add(X3, Y3);
      X3 = Fp4.sub(t1, Y3);
      Y3 = Fp4.add(t1, Y3);
      Y3 = Fp4.mul(X3, Y3);
      X3 = Fp4.mul(t3, X3);
      Z3 = Fp4.mul(b3, Z3);
      t2 = Fp4.mul(a2, t2);
      t3 = Fp4.sub(t0, t2);
      t3 = Fp4.mul(a2, t3);
      t3 = Fp4.add(t3, Z3);
      Z3 = Fp4.add(t0, t0);
      t0 = Fp4.add(Z3, t0);
      t0 = Fp4.add(t0, t2);
      t0 = Fp4.mul(t0, t3);
      Y3 = Fp4.add(Y3, t0);
      t2 = Fp4.mul(Y1, Z1);
      t2 = Fp4.add(t2, t2);
      t0 = Fp4.mul(t2, t3);
      X3 = Fp4.sub(X3, t0);
      Z3 = Fp4.mul(t2, t1);
      Z3 = Fp4.add(Z3, Z3);
      Z3 = Fp4.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp4.ZERO, Y3 = Fp4.ZERO, Z3 = Fp4.ZERO;
      const a2 = CURVE.a;
      const b3 = Fp4.mul(CURVE.b, _3n2);
      let t0 = Fp4.mul(X1, X2);
      let t1 = Fp4.mul(Y1, Y2);
      let t2 = Fp4.mul(Z1, Z2);
      let t3 = Fp4.add(X1, Y1);
      let t4 = Fp4.add(X2, Y2);
      t3 = Fp4.mul(t3, t4);
      t4 = Fp4.add(t0, t1);
      t3 = Fp4.sub(t3, t4);
      t4 = Fp4.add(X1, Z1);
      let t5 = Fp4.add(X2, Z2);
      t4 = Fp4.mul(t4, t5);
      t5 = Fp4.add(t0, t2);
      t4 = Fp4.sub(t4, t5);
      t5 = Fp4.add(Y1, Z1);
      X3 = Fp4.add(Y2, Z2);
      t5 = Fp4.mul(t5, X3);
      X3 = Fp4.add(t1, t2);
      t5 = Fp4.sub(t5, X3);
      Z3 = Fp4.mul(a2, t4);
      X3 = Fp4.mul(b3, t2);
      Z3 = Fp4.add(X3, Z3);
      X3 = Fp4.sub(t1, Z3);
      Z3 = Fp4.add(t1, Z3);
      Y3 = Fp4.mul(X3, Z3);
      t1 = Fp4.add(t0, t0);
      t1 = Fp4.add(t1, t0);
      t2 = Fp4.mul(a2, t2);
      t4 = Fp4.mul(b3, t4);
      t1 = Fp4.add(t1, t2);
      t2 = Fp4.sub(t0, t2);
      t2 = Fp4.mul(a2, t2);
      t4 = Fp4.add(t4, t2);
      t0 = Fp4.mul(t1, t4);
      Y3 = Fp4.add(Y3, t0);
      t0 = Fp4.mul(t5, t4);
      X3 = Fp4.mul(t3, X3);
      X3 = Fp4.sub(X3, t0);
      t0 = Fp4.mul(t3, t1);
      Z3 = Fp4.mul(t5, Z3);
      Z3 = Fp4.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2 } = extraOpts;
      if (!Fn2.isValidNot0(scalar))
        throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = (n) => wnaf.cached(this, n, (p2) => normalizeZ(Point, p2));
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo2.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p: p2, f } = mul(scalar);
        point = p2;
        fake = f;
      }
      return normalizeZ(Point, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2 } = extraOpts;
      const p2 = this;
      if (!Fn2.isValid(sc))
        throw new Error("invalid scalar: out of range");
      if (sc === _0n4 || p2.is0())
        return Point.ZERO;
      if (sc === _1n4)
        return p2;
      if (wnaf.hasCache(this))
        return this.multiply(sc);
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2: p22 } = mulEndoUnsafe(Point, p2, k1, k2);
        return finishEndo(endo2.beta, p1, p22, k1neg, k2neg);
      } else {
        return wnaf.unsafe(p2, sc);
      }
    }
    multiplyAndAddUnsafe(Q2, a2, b2) {
      const sum = this.multiplyUnsafe(a2).add(Q2.multiplyUnsafe(b2));
      return sum.is0() ? void 0 : sum;
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      _abool2(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    // TODO: remove
    get px() {
      return this.X;
    }
    get py() {
      return this.X;
    }
    get pz() {
      return this.Z;
    }
    toRawBytes(isCompressed = true) {
      return this.toBytes(isCompressed);
    }
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    static normalizeZ(points) {
      return normalizeZ(Point, points);
    }
    static msm(points, scalars) {
      return pippenger(Point, Fn2, points, scalars);
    }
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(_normFnElement(Fn2, privateKey));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp4.ONE);
  Point.ZERO = new Point(Fp4.ZERO, Fp4.ONE, Fp4.ZERO);
  Point.Fp = Fp4;
  Point.Fn = Fn2;
  const bits = Fn2.BITS;
  const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point.BASE.precompute(8);
  return Point;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function SWUFpSqrtRatio(Fp4, Z2) {
  const q2 = Fp4.ORDER;
  let l = _0n4;
  for (let o2 = q2 - _1n4; o2 % _2n2 === _0n4; o2 /= _2n2)
    l += _1n4;
  const c1 = l;
  const _2n_pow_c1_1 = _2n2 << c1 - _1n4 - _1n4;
  const _2n_pow_c1 = _2n_pow_c1_1 * _2n2;
  const c2 = (q2 - _1n4) / _2n_pow_c1;
  const c3 = (c2 - _1n4) / _2n2;
  const c4 = _2n_pow_c1 - _1n4;
  const c5 = _2n_pow_c1_1;
  const c6 = Fp4.pow(Z2, c2);
  const c7 = Fp4.pow(Z2, (c2 + _1n4) / _2n2);
  let sqrtRatio = (u, v2) => {
    let tv1 = c6;
    let tv2 = Fp4.pow(v2, c4);
    let tv3 = Fp4.sqr(tv2);
    tv3 = Fp4.mul(tv3, v2);
    let tv5 = Fp4.mul(u, tv3);
    tv5 = Fp4.pow(tv5, c3);
    tv5 = Fp4.mul(tv5, tv2);
    tv2 = Fp4.mul(tv5, v2);
    tv3 = Fp4.mul(tv5, u);
    let tv4 = Fp4.mul(tv3, tv2);
    tv5 = Fp4.pow(tv4, c5);
    let isQR = Fp4.eql(tv5, Fp4.ONE);
    tv2 = Fp4.mul(tv3, c7);
    tv5 = Fp4.mul(tv4, tv1);
    tv3 = Fp4.cmov(tv2, tv3, isQR);
    tv4 = Fp4.cmov(tv5, tv4, isQR);
    for (let i = c1; i > _1n4; i--) {
      let tv52 = i - _2n2;
      tv52 = _2n2 << tv52 - _1n4;
      let tvv5 = Fp4.pow(tv4, tv52);
      const e1 = Fp4.eql(tvv5, Fp4.ONE);
      tv2 = Fp4.mul(tv3, tv1);
      tv1 = Fp4.mul(tv1, tv1);
      tvv5 = Fp4.mul(tv4, tv1);
      tv3 = Fp4.cmov(tv2, tv3, e1);
      tv4 = Fp4.cmov(tvv5, tv4, e1);
    }
    return { isValid: isQR, value: tv3 };
  };
  if (Fp4.ORDER % _4n2 === _3n2) {
    const c12 = (Fp4.ORDER - _3n2) / _4n2;
    const c22 = Fp4.sqrt(Fp4.neg(Z2));
    sqrtRatio = (u, v2) => {
      let tv1 = Fp4.sqr(v2);
      const tv2 = Fp4.mul(u, v2);
      tv1 = Fp4.mul(tv1, tv2);
      let y1 = Fp4.pow(tv1, c12);
      y1 = Fp4.mul(y1, tv2);
      const y2 = Fp4.mul(y1, c22);
      const tv3 = Fp4.mul(Fp4.sqr(y1), v2);
      const isQR = Fp4.eql(tv3, u);
      let y3 = Fp4.cmov(y2, y1, isQR);
      return { isValid: isQR, value: y3 };
    };
  }
  return sqrtRatio;
}
function mapToCurveSimpleSWU(Fp4, opts) {
  validateField(Fp4);
  const { A: A2, B: B2, Z: Z2 } = opts;
  if (!Fp4.isValid(A2) || !Fp4.isValid(B2) || !Fp4.isValid(Z2))
    throw new Error("mapToCurveSimpleSWU: invalid opts");
  const sqrtRatio = SWUFpSqrtRatio(Fp4, Z2);
  if (!Fp4.isOdd)
    throw new Error("Field does not have .isOdd()");
  return (u) => {
    let tv1, tv2, tv3, tv4, tv5, tv6, x2, y2;
    tv1 = Fp4.sqr(u);
    tv1 = Fp4.mul(tv1, Z2);
    tv2 = Fp4.sqr(tv1);
    tv2 = Fp4.add(tv2, tv1);
    tv3 = Fp4.add(tv2, Fp4.ONE);
    tv3 = Fp4.mul(tv3, B2);
    tv4 = Fp4.cmov(Z2, Fp4.neg(tv2), !Fp4.eql(tv2, Fp4.ZERO));
    tv4 = Fp4.mul(tv4, A2);
    tv2 = Fp4.sqr(tv3);
    tv6 = Fp4.sqr(tv4);
    tv5 = Fp4.mul(tv6, A2);
    tv2 = Fp4.add(tv2, tv5);
    tv2 = Fp4.mul(tv2, tv3);
    tv6 = Fp4.mul(tv6, tv4);
    tv5 = Fp4.mul(tv6, B2);
    tv2 = Fp4.add(tv2, tv5);
    x2 = Fp4.mul(tv1, tv3);
    const { isValid, value } = sqrtRatio(tv2, tv6);
    y2 = Fp4.mul(tv1, u);
    y2 = Fp4.mul(y2, value);
    x2 = Fp4.cmov(x2, tv3, isValid);
    y2 = Fp4.cmov(y2, value, isValid);
    const e1 = Fp4.isOdd(u) === Fp4.isOdd(y2);
    y2 = Fp4.cmov(Fp4.neg(y2), y2, e1);
    const tv4_inv = FpInvertBatch(Fp4, [tv4], true)[0];
    x2 = Fp4.mul(x2, tv4_inv);
    return { x: x2, y: y2 };
  };
}
function getWLengths(Fp4, Fn2) {
  return {
    secretKey: Fn2.BYTES,
    publicKey: 1 + Fp4.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp4.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn2.BYTES
  };
}
function weierstrassPoints(c2) {
  const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c2);
  const Point = weierstrassN(CURVE, curveOpts);
  return _weierstrass_new_output_to_legacy(c2, Point);
}
function _weierstrass_legacy_opts_to_new(c2) {
  const CURVE = {
    a: c2.a,
    b: c2.b,
    p: c2.Fp.ORDER,
    n: c2.n,
    h: c2.h,
    Gx: c2.Gx,
    Gy: c2.Gy
  };
  const Fp4 = c2.Fp;
  let allowedLengths = c2.allowedPrivateKeyLengths ? Array.from(new Set(c2.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
  const Fn2 = Field(CURVE.n, {
    BITS: c2.nBitLength,
    allowedLengths,
    modFromBytes: c2.wrapPrivateKey
  });
  const curveOpts = {
    Fp: Fp4,
    Fn: Fn2,
    allowInfinityPoint: c2.allowInfinityPoint,
    endo: c2.endo,
    isTorsionFree: c2.isTorsionFree,
    clearCofactor: c2.clearCofactor,
    fromBytes: c2.fromBytes,
    toBytes: c2.toBytes
  };
  return { CURVE, curveOpts };
}
function _legacyHelperEquat(Fp4, a2, b2) {
  function weierstrassEquation(x2) {
    const x22 = Fp4.sqr(x2);
    const x3 = Fp4.mul(x22, x2);
    return Fp4.add(Fp4.add(x3, Fp4.mul(x2, a2)), b2);
  }
  return weierstrassEquation;
}
function _weierstrass_new_output_to_legacy(c2, Point) {
  const { Fp: Fp4, Fn: Fn2 } = Point;
  function isWithinCurveOrder(num) {
    return inRange(num, _1n4, Fn2.ORDER);
  }
  const weierstrassEquation = _legacyHelperEquat(Fp4, c2.a, c2.b);
  return Object.assign({}, {
    CURVE: c2,
    Point,
    ProjectivePoint: Point,
    normPrivateKeyToScalar: (key) => _normFnElement(Fn2, key),
    weierstrassEquation,
    isWithinCurveOrder
  });
}

// node_modules/@noble/curves/esm/abstract/bls.js
var _0n5 = BigInt(0);
var _1n5 = BigInt(1);
var _2n3 = BigInt(2);
var _3n3 = BigInt(3);
function NAfDecomposition(a2) {
  const res = [];
  for (; a2 > _1n5; a2 >>= _1n5) {
    if ((a2 & _1n5) === _0n5)
      res.unshift(0);
    else if ((a2 & _3n3) === _3n3) {
      res.unshift(-1);
      a2 += _1n5;
    } else
      res.unshift(1);
  }
  return res;
}
function aNonEmpty(arr) {
  if (!Array.isArray(arr) || arr.length === 0)
    throw new Error("expected non-empty array");
}
function createBlsPairing(fields, G1, G2, params) {
  const { Fp2: Fp22, Fp12: Fp122 } = fields;
  const { twistType, ateLoopSize, xNegative, postPrecompute } = params;
  let lineFunction;
  if (twistType === "multiplicative") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul014(f, c0, Fp22.mul(c1, Px), Fp22.mul(c2, Py));
  } else if (twistType === "divisive") {
    lineFunction = (c0, c1, c2, f, Px, Py) => Fp122.mul034(f, Fp22.mul(c2, Py), Fp22.mul(c1, Px), c0);
  } else
    throw new Error("bls: unknown twist type");
  const Fp2div2 = Fp22.div(Fp22.ONE, Fp22.mul(Fp22.ONE, _2n3));
  function pointDouble(ell, Rx, Ry, Rz) {
    const t0 = Fp22.sqr(Ry);
    const t1 = Fp22.sqr(Rz);
    const t2 = Fp22.mulByB(Fp22.mul(t1, _3n3));
    const t3 = Fp22.mul(t2, _3n3);
    const t4 = Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(Ry, Rz)), t1), t0);
    const c0 = Fp22.sub(t2, t0);
    const c1 = Fp22.mul(Fp22.sqr(Rx), _3n3);
    const c2 = Fp22.neg(t4);
    ell.push([c0, c1, c2]);
    Rx = Fp22.mul(Fp22.mul(Fp22.mul(Fp22.sub(t0, t3), Rx), Ry), Fp2div2);
    Ry = Fp22.sub(Fp22.sqr(Fp22.mul(Fp22.add(t0, t3), Fp2div2)), Fp22.mul(Fp22.sqr(t2), _3n3));
    Rz = Fp22.mul(t0, t4);
    return { Rx, Ry, Rz };
  }
  function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
    const t0 = Fp22.sub(Ry, Fp22.mul(Qy, Rz));
    const t1 = Fp22.sub(Rx, Fp22.mul(Qx, Rz));
    const c0 = Fp22.sub(Fp22.mul(t0, Qx), Fp22.mul(t1, Qy));
    const c1 = Fp22.neg(t0);
    const c2 = t1;
    ell.push([c0, c1, c2]);
    const t2 = Fp22.sqr(t1);
    const t3 = Fp22.mul(t2, t1);
    const t4 = Fp22.mul(t2, Rx);
    const t5 = Fp22.add(Fp22.sub(t3, Fp22.mul(t4, _2n3)), Fp22.mul(Fp22.sqr(t0), Rz));
    Rx = Fp22.mul(t1, t5);
    Ry = Fp22.sub(Fp22.mul(Fp22.sub(t4, t5), t0), Fp22.mul(t3, Ry));
    Rz = Fp22.mul(Rz, t3);
    return { Rx, Ry, Rz };
  }
  const ATE_NAF = NAfDecomposition(ateLoopSize);
  const calcPairingPrecomputes = memoized((point) => {
    const p2 = point;
    const { x: x2, y: y2 } = p2.toAffine();
    const Qx = x2, Qy = y2, negQy = Fp22.neg(y2);
    let Rx = Qx, Ry = Qy, Rz = Fp22.ONE;
    const ell = [];
    for (const bit of ATE_NAF) {
      const cur = [];
      ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
      if (bit)
        ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
      ell.push(cur);
    }
    if (postPrecompute) {
      const last = ell[ell.length - 1];
      postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
    }
    return ell;
  });
  function millerLoopBatch(pairs, withFinalExponent = false) {
    let f12 = Fp122.ONE;
    if (pairs.length) {
      const ellLen = pairs[0][0].length;
      for (let i = 0; i < ellLen; i++) {
        f12 = Fp122.sqr(f12);
        for (const [ell, Px, Py] of pairs) {
          for (const [c0, c1, c2] of ell[i])
            f12 = lineFunction(c0, c1, c2, f12, Px, Py);
        }
      }
    }
    if (xNegative)
      f12 = Fp122.conjugate(f12);
    return withFinalExponent ? Fp122.finalExponentiate(f12) : f12;
  }
  function pairingBatch(pairs, withFinalExponent = true) {
    const res = [];
    normalizeZ(G1, pairs.map(({ g1 }) => g1));
    normalizeZ(G2, pairs.map(({ g2 }) => g2));
    for (const { g1, g2 } of pairs) {
      if (g1.is0() || g2.is0())
        throw new Error("pairing is not available for ZERO point");
      g1.assertValidity();
      g2.assertValidity();
      const Qa = g1.toAffine();
      res.push([calcPairingPrecomputes(g2), Qa.x, Qa.y]);
    }
    return millerLoopBatch(res, withFinalExponent);
  }
  function pairing(Q2, P2, withFinalExponent = true) {
    return pairingBatch([{ g1: Q2, g2: P2 }], withFinalExponent);
  }
  return {
    Fp12: Fp122,
    // NOTE: we re-export Fp12 here because pairing results are Fp12!
    millerLoopBatch,
    pairing,
    pairingBatch,
    calcPairingPrecomputes
  };
}
function createBlsSig(blsPairing, PubCurve, SigCurve, SignatureCoder, isSigG1) {
  const { Fp12: Fp122, pairingBatch } = blsPairing;
  function normPub(point) {
    return point instanceof PubCurve.Point ? point : PubCurve.Point.fromHex(point);
  }
  function normSig(point) {
    return point instanceof SigCurve.Point ? point : SigCurve.Point.fromHex(point);
  }
  function amsg(m2) {
    if (!(m2 instanceof SigCurve.Point))
      throw new Error(`expected valid message hashed to ${!isSigG1 ? "G2" : "G1"} curve`);
    return m2;
  }
  const pair = !isSigG1 ? (a2, b2) => ({ g1: a2, g2: b2 }) : (a2, b2) => ({ g1: b2, g2: a2 });
  return {
    // P = pk x G
    getPublicKey(secretKey) {
      const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
      return PubCurve.Point.BASE.multiply(sec);
    },
    // S = pk x H(m)
    sign(message, secretKey, unusedArg) {
      if (unusedArg != null)
        throw new Error("sign() expects 2 arguments");
      const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
      amsg(message).assertValidity();
      return message.multiply(sec);
    },
    // Checks if pairing of public key & hash is equal to pairing of generator & signature.
    // e(P, H(m)) == e(G, S)
    // e(S, G) == e(H(m), P)
    verify(signature, message, publicKey, unusedArg) {
      if (unusedArg != null)
        throw new Error("verify() expects 3 arguments");
      signature = normSig(signature);
      publicKey = normPub(publicKey);
      const P2 = publicKey.negate();
      const G2 = PubCurve.Point.BASE;
      const Hm = amsg(message);
      const S2 = signature;
      const exp = pairingBatch([pair(P2, Hm), pair(G2, S2)]);
      return Fp122.eql(exp, Fp122.ONE);
    },
    // https://ethresear.ch/t/fast-verification-of-multiple-bls-signatures/5407
    // e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))
    // TODO: maybe `{message: G2Hex, publicKey: G1Hex}[]` instead?
    verifyBatch(signature, messages, publicKeys) {
      aNonEmpty(messages);
      if (publicKeys.length !== messages.length)
        throw new Error("amount of public keys and messages should be equal");
      const sig = normSig(signature);
      const nMessages = messages;
      const nPublicKeys = publicKeys.map(normPub);
      const messagePubKeyMap = /* @__PURE__ */ new Map();
      for (let i = 0; i < nPublicKeys.length; i++) {
        const pub = nPublicKeys[i];
        const msg = nMessages[i];
        let keys = messagePubKeyMap.get(msg);
        if (keys === void 0) {
          keys = [];
          messagePubKeyMap.set(msg, keys);
        }
        keys.push(pub);
      }
      const paired = [];
      const G2 = PubCurve.Point.BASE;
      try {
        for (const [msg, keys] of messagePubKeyMap) {
          const groupPublicKey = keys.reduce((acc, msg2) => acc.add(msg2));
          paired.push(pair(groupPublicKey, msg));
        }
        paired.push(pair(G2.negate(), sig));
        return Fp122.eql(pairingBatch(paired), Fp122.ONE);
      } catch {
        return false;
      }
    },
    // Adds a bunch of public key points together.
    // pk1 + pk2 + pk3 = pkA
    aggregatePublicKeys(publicKeys) {
      aNonEmpty(publicKeys);
      publicKeys = publicKeys.map((pub) => normPub(pub));
      const agg = publicKeys.reduce((sum, p2) => sum.add(p2), PubCurve.Point.ZERO);
      agg.assertValidity();
      return agg;
    },
    // Adds a bunch of signature points together.
    // pk1 + pk2 + pk3 = pkA
    aggregateSignatures(signatures) {
      aNonEmpty(signatures);
      signatures = signatures.map((sig) => normSig(sig));
      const agg = signatures.reduce((sum, s2) => sum.add(s2), SigCurve.Point.ZERO);
      agg.assertValidity();
      return agg;
    },
    hash(messageBytes, DST) {
      abytes(messageBytes);
      const opts = DST ? { DST } : void 0;
      return SigCurve.hashToCurve(messageBytes, opts);
    },
    Signature: SignatureCoder
  };
}
function bls(CURVE) {
  const { Fp: Fp4, Fr, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 } = CURVE.fields;
  const G1_ = weierstrassPoints(CURVE.G1);
  const G1 = Object.assign(G1_, createHasher(G1_.Point, CURVE.G1.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G1.htfDefaults
  }));
  const G2_ = weierstrassPoints(CURVE.G2);
  const G2 = Object.assign(G2_, createHasher(G2_.Point, CURVE.G2.mapToCurve, {
    ...CURVE.htfDefaults,
    ...CURVE.G2.htfDefaults
  }));
  const pairingRes = createBlsPairing(CURVE.fields, G1.Point, G2.Point, {
    ...CURVE.params,
    postPrecompute: CURVE.postPrecompute
  });
  const { millerLoopBatch, pairing, pairingBatch, calcPairingPrecomputes } = pairingRes;
  const longSignatures = createBlsSig(pairingRes, G1, G2, CURVE.G2.Signature, false);
  const shortSignatures = createBlsSig(pairingRes, G2, G1, CURVE.G1.ShortSignature, true);
  const rand = CURVE.randomBytes || randomBytes;
  const randomSecretKey = () => {
    const length = getMinHashLength(Fr.ORDER);
    return mapHashToField(rand(length), Fr.ORDER);
  };
  const utils = {
    randomSecretKey,
    randomPrivateKey: randomSecretKey,
    calcPairingPrecomputes
  };
  const { ShortSignature } = CURVE.G1;
  const { Signature } = CURVE.G2;
  function normP1Hash(point, htfOpts) {
    return point instanceof G1.Point ? point : shortSignatures.hash(ensureBytes("point", point), htfOpts == null ? void 0 : htfOpts.DST);
  }
  function normP2Hash(point, htfOpts) {
    return point instanceof G2.Point ? point : longSignatures.hash(ensureBytes("point", point), htfOpts == null ? void 0 : htfOpts.DST);
  }
  function getPublicKey(privateKey) {
    return longSignatures.getPublicKey(privateKey).toBytes(true);
  }
  function getPublicKeyForShortSignatures(privateKey) {
    return shortSignatures.getPublicKey(privateKey).toBytes(true);
  }
  function sign(message, privateKey, htfOpts) {
    const Hm = normP2Hash(message, htfOpts);
    const S2 = longSignatures.sign(Hm, privateKey);
    return message instanceof G2.Point ? S2 : Signature.toBytes(S2);
  }
  function signShortSignature(message, privateKey, htfOpts) {
    const Hm = normP1Hash(message, htfOpts);
    const S2 = shortSignatures.sign(Hm, privateKey);
    return message instanceof G1.Point ? S2 : ShortSignature.toBytes(S2);
  }
  function verify2(signature, message, publicKey, htfOpts) {
    const Hm = normP2Hash(message, htfOpts);
    return longSignatures.verify(signature, Hm, publicKey);
  }
  function verifyShortSignature(signature, message, publicKey, htfOpts) {
    const Hm = normP1Hash(message, htfOpts);
    return shortSignatures.verify(signature, Hm, publicKey);
  }
  function aggregatePublicKeys(publicKeys) {
    const agg = longSignatures.aggregatePublicKeys(publicKeys);
    return publicKeys[0] instanceof G1.Point ? agg : agg.toBytes(true);
  }
  function aggregateSignatures(signatures) {
    const agg = longSignatures.aggregateSignatures(signatures);
    return signatures[0] instanceof G2.Point ? agg : Signature.toBytes(agg);
  }
  function aggregateShortSignatures(signatures) {
    const agg = shortSignatures.aggregateSignatures(signatures);
    return signatures[0] instanceof G1.Point ? agg : ShortSignature.toBytes(agg);
  }
  function verifyBatch(signature, messages, publicKeys, htfOpts) {
    const Hm = messages.map((m2) => normP2Hash(m2, htfOpts));
    return longSignatures.verifyBatch(signature, Hm, publicKeys);
  }
  G1.Point.BASE.precompute(4);
  return {
    longSignatures,
    shortSignatures,
    millerLoopBatch,
    pairing,
    pairingBatch,
    verifyBatch,
    fields: {
      Fr,
      Fp: Fp4,
      Fp2: Fp22,
      Fp6: Fp62,
      Fp12: Fp122
    },
    params: {
      ateLoopSize: CURVE.params.ateLoopSize,
      twistType: CURVE.params.twistType,
      // deprecated
      r: CURVE.params.r,
      G1b: CURVE.G1.b,
      G2b: CURVE.G2.b
    },
    utils,
    // deprecated
    getPublicKey,
    getPublicKeyForShortSignatures,
    sign,
    signShortSignature,
    verify: verify2,
    verifyShortSignature,
    aggregatePublicKeys,
    aggregateSignatures,
    aggregateShortSignatures,
    G1,
    G2,
    Signature,
    ShortSignature
  };
}

// node_modules/@noble/curves/esm/abstract/tower.js
var import_dist55 = __toESM(require_dist(), 1);
var import_dist56 = __toESM(require_dist2(), 1);
var import_dist57 = __toESM(require_dist3(), 1);
var _0n6 = BigInt(0);
var _1n6 = BigInt(1);
var _2n4 = BigInt(2);
var _3n4 = BigInt(3);
function calcFrobeniusCoefficients(Fp4, nonResidue, modulus, degree, num = 1, divisor) {
  const _divisor = BigInt(divisor === void 0 ? degree : divisor);
  const towerModulus = modulus ** BigInt(degree);
  const res = [];
  for (let i = 0; i < num; i++) {
    const a2 = BigInt(i + 1);
    const powers = [];
    for (let j2 = 0, qPower = _1n6; j2 < degree; j2++) {
      const power = (a2 * qPower - a2) / _divisor % towerModulus;
      powers.push(Fp4.pow(nonResidue, power));
      qPower *= modulus;
    }
    res.push(powers);
  }
  return res;
}
function psiFrobenius(Fp4, Fp22, base) {
  const PSI_X = Fp22.pow(base, (Fp4.ORDER - _1n6) / _3n4);
  const PSI_Y = Fp22.pow(base, (Fp4.ORDER - _1n6) / _2n4);
  function psi(x2, y2) {
    const x22 = Fp22.mul(Fp22.frobeniusMap(x2, 1), PSI_X);
    const y22 = Fp22.mul(Fp22.frobeniusMap(y2, 1), PSI_Y);
    return [x22, y22];
  }
  const PSI2_X = Fp22.pow(base, (Fp4.ORDER ** _2n4 - _1n6) / _3n4);
  const PSI2_Y = Fp22.pow(base, (Fp4.ORDER ** _2n4 - _1n6) / _2n4);
  if (!Fp22.eql(PSI2_Y, Fp22.neg(Fp22.ONE)))
    throw new Error("psiFrobenius: PSI2_Y!==-1");
  function psi2(x2, y2) {
    return [Fp22.mul(x2, PSI2_X), Fp22.neg(y2)];
  }
  const mapAffine = (fn) => (c2, P2) => {
    const affine = P2.toAffine();
    const p2 = fn(affine.x, affine.y);
    return c2.fromAffine({ x: p2[0], y: p2[1] });
  };
  const G2psi3 = mapAffine(psi);
  const G2psi22 = mapAffine(psi2);
  return { psi, psi2, G2psi: G2psi3, G2psi2: G2psi22, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
}
var Fp2fromBigTuple = (Fp4, tuple) => {
  if (tuple.length !== 2)
    throw new Error("invalid tuple");
  const fps = tuple.map((n) => Fp4.create(n));
  return { c0: fps[0], c1: fps[1] };
};
var _Field2 = class {
  constructor(Fp4, opts = {}) {
    this.MASK = _1n6;
    const ORDER = Fp4.ORDER;
    const FP2_ORDER = ORDER * ORDER;
    this.Fp = Fp4;
    this.ORDER = FP2_ORDER;
    this.BITS = bitLen(FP2_ORDER);
    this.BYTES = Math.ceil(bitLen(FP2_ORDER) / 8);
    this.isLE = Fp4.isLE;
    this.ZERO = { c0: Fp4.ZERO, c1: Fp4.ZERO };
    this.ONE = { c0: Fp4.ONE, c1: Fp4.ZERO };
    this.Fp_NONRESIDUE = Fp4.create(opts.NONRESIDUE || BigInt(-1));
    this.Fp_div2 = Fp4.div(Fp4.ONE, _2n4);
    this.NONRESIDUE = Fp2fromBigTuple(Fp4, opts.FP2_NONRESIDUE);
    this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp4, this.Fp_NONRESIDUE, Fp4.ORDER, 2)[0];
    this.mulByB = opts.Fp2mulByB;
    Object.seal(this);
  }
  fromBigTuple(tuple) {
    return Fp2fromBigTuple(this.Fp, tuple);
  }
  create(num) {
    return num;
  }
  isValid({ c0, c1 }) {
    function isValidC(num, ORDER) {
      return typeof num === "bigint" && _0n6 <= num && num < ORDER;
    }
    return isValidC(c0, this.ORDER) && isValidC(c1, this.ORDER);
  }
  is0({ c0, c1 }) {
    return this.Fp.is0(c0) && this.Fp.is0(c1);
  }
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  eql({ c0, c1 }, { c0: r0, c1: r1 }) {
    return this.Fp.eql(c0, r0) && this.Fp.eql(c1, r1);
  }
  neg({ c0, c1 }) {
    return { c0: this.Fp.neg(c0), c1: this.Fp.neg(c1) };
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  invertBatch(nums) {
    return FpInvertBatch(this, nums);
  }
  // Normalized
  add(f1, f2) {
    const { c0, c1 } = f1;
    const { c0: r0, c1: r1 } = f2;
    return {
      c0: this.Fp.add(c0, r0),
      c1: this.Fp.add(c1, r1)
    };
  }
  sub({ c0, c1 }, { c0: r0, c1: r1 }) {
    return {
      c0: this.Fp.sub(c0, r0),
      c1: this.Fp.sub(c1, r1)
    };
  }
  mul({ c0, c1 }, rhs) {
    const { Fp: Fp4 } = this;
    if (typeof rhs === "bigint")
      return { c0: Fp4.mul(c0, rhs), c1: Fp4.mul(c1, rhs) };
    const { c0: r0, c1: r1 } = rhs;
    let t1 = Fp4.mul(c0, r0);
    let t2 = Fp4.mul(c1, r1);
    const o0 = Fp4.sub(t1, t2);
    const o1 = Fp4.sub(Fp4.mul(Fp4.add(c0, c1), Fp4.add(r0, r1)), Fp4.add(t1, t2));
    return { c0: o0, c1: o1 };
  }
  sqr({ c0, c1 }) {
    const { Fp: Fp4 } = this;
    const a2 = Fp4.add(c0, c1);
    const b2 = Fp4.sub(c0, c1);
    const c2 = Fp4.add(c0, c0);
    return { c0: Fp4.mul(a2, b2), c1: Fp4.mul(c2, c1) };
  }
  // NonNormalized stuff
  addN(a2, b2) {
    return this.add(a2, b2);
  }
  subN(a2, b2) {
    return this.sub(a2, b2);
  }
  mulN(a2, b2) {
    return this.mul(a2, b2);
  }
  sqrN(a2) {
    return this.sqr(a2);
  }
  // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
  div(lhs, rhs) {
    const { Fp: Fp4 } = this;
    return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
  }
  inv({ c0: a2, c1: b2 }) {
    const { Fp: Fp4 } = this;
    const factor = Fp4.inv(Fp4.create(a2 * a2 + b2 * b2));
    return { c0: Fp4.mul(factor, Fp4.create(a2)), c1: Fp4.mul(factor, Fp4.create(-b2)) };
  }
  sqrt(num) {
    const { Fp: Fp4 } = this;
    const Fp22 = this;
    const { c0, c1 } = num;
    if (Fp4.is0(c1)) {
      if (FpLegendre(Fp4, c0) === 1)
        return Fp22.create({ c0: Fp4.sqrt(c0), c1: Fp4.ZERO });
      else
        return Fp22.create({ c0: Fp4.ZERO, c1: Fp4.sqrt(Fp4.div(c0, this.Fp_NONRESIDUE)) });
    }
    const a2 = Fp4.sqrt(Fp4.sub(Fp4.sqr(c0), Fp4.mul(Fp4.sqr(c1), this.Fp_NONRESIDUE)));
    let d2 = Fp4.mul(Fp4.add(a2, c0), this.Fp_div2);
    const legendre = FpLegendre(Fp4, d2);
    if (legendre === -1)
      d2 = Fp4.sub(d2, a2);
    const a0 = Fp4.sqrt(d2);
    const candidateSqrt = Fp22.create({ c0: a0, c1: Fp4.div(Fp4.mul(c1, this.Fp_div2), a0) });
    if (!Fp22.eql(Fp22.sqr(candidateSqrt), num))
      throw new Error("Cannot find square root");
    const x1 = candidateSqrt;
    const x2 = Fp22.neg(x1);
    const { re: re1, im: im1 } = Fp22.reim(x1);
    const { re: re2, im: im2 } = Fp22.reim(x2);
    if (im1 > im2 || im1 === im2 && re1 > re2)
      return x1;
    return x2;
  }
  // Same as sgn0_m_eq_2 in RFC 9380
  isOdd(x2) {
    const { re: x0, im: x1 } = this.reim(x2);
    const sign_0 = x0 % _2n4;
    const zero_0 = x0 === _0n6;
    const sign_1 = x1 % _2n4;
    return BigInt(sign_0 || zero_0 && sign_1) == _1n6;
  }
  // Bytes util
  fromBytes(b2) {
    const { Fp: Fp4 } = this;
    if (b2.length !== this.BYTES)
      throw new Error("fromBytes invalid length=" + b2.length);
    return { c0: Fp4.fromBytes(b2.subarray(0, Fp4.BYTES)), c1: Fp4.fromBytes(b2.subarray(Fp4.BYTES)) };
  }
  toBytes({ c0, c1 }) {
    return concatBytes(this.Fp.toBytes(c0), this.Fp.toBytes(c1));
  }
  cmov({ c0, c1 }, { c0: r0, c1: r1 }, c2) {
    return {
      c0: this.Fp.cmov(c0, r0, c2),
      c1: this.Fp.cmov(c1, r1, c2)
    };
  }
  reim({ c0, c1 }) {
    return { re: c0, im: c1 };
  }
  Fp4Square(a2, b2) {
    const Fp22 = this;
    const a22 = Fp22.sqr(a2);
    const b22 = Fp22.sqr(b2);
    return {
      first: Fp22.add(Fp22.mulByNonresidue(b22), a22),
      // b² * Nonresidue + a²
      second: Fp22.sub(Fp22.sub(Fp22.sqr(Fp22.add(a2, b2)), a22), b22)
      // (a + b)² - a² - b²
    };
  }
  // multiply by u + 1
  mulByNonresidue({ c0, c1 }) {
    return this.mul({ c0, c1 }, this.NONRESIDUE);
  }
  frobeniusMap({ c0, c1 }, power) {
    return {
      c0,
      c1: this.Fp.mul(c1, this.FROBENIUS_COEFFICIENTS[power % 2])
    };
  }
};
var _Field6 = class {
  constructor(Fp22) {
    this.MASK = _1n6;
    this.Fp2 = Fp22;
    this.ORDER = Fp22.ORDER;
    this.BITS = 3 * Fp22.BITS;
    this.BYTES = 3 * Fp22.BYTES;
    this.isLE = Fp22.isLE;
    this.ZERO = { c0: Fp22.ZERO, c1: Fp22.ZERO, c2: Fp22.ZERO };
    this.ONE = { c0: Fp22.ONE, c1: Fp22.ZERO, c2: Fp22.ZERO };
    const { Fp: Fp4 } = Fp22;
    const frob = calcFrobeniusCoefficients(Fp22, Fp22.NONRESIDUE, Fp4.ORDER, 6, 2, 3);
    this.FROBENIUS_COEFFICIENTS_1 = frob[0];
    this.FROBENIUS_COEFFICIENTS_2 = frob[1];
    Object.seal(this);
  }
  add({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.add(c0, r0),
      c1: Fp22.add(c1, r1),
      c2: Fp22.add(c2, r2)
    };
  }
  sub({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.sub(c0, r0),
      c1: Fp22.sub(c1, r1),
      c2: Fp22.sub(c2, r2)
    };
  }
  mul({ c0, c1, c2 }, rhs) {
    const { Fp2: Fp22 } = this;
    if (typeof rhs === "bigint") {
      return {
        c0: Fp22.mul(c0, rhs),
        c1: Fp22.mul(c1, rhs),
        c2: Fp22.mul(c2, rhs)
      };
    }
    const { c0: r0, c1: r1, c2: r2 } = rhs;
    const t0 = Fp22.mul(c0, r0);
    const t1 = Fp22.mul(c1, r1);
    const t2 = Fp22.mul(c2, r2);
    return {
      // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
      c0: Fp22.add(t0, Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), Fp22.add(r1, r2)), Fp22.add(t1, t2)))),
      // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
      c1: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c1), Fp22.add(r0, r1)), Fp22.add(t0, t1)), Fp22.mulByNonresidue(t2)),
      // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
      c2: Fp22.sub(Fp22.add(t1, Fp22.mul(Fp22.add(c0, c2), Fp22.add(r0, r2))), Fp22.add(t0, t2))
    };
  }
  sqr({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    let t0 = Fp22.sqr(c0);
    let t1 = Fp22.mul(Fp22.mul(c0, c1), _2n4);
    let t3 = Fp22.mul(Fp22.mul(c1, c2), _2n4);
    let t4 = Fp22.sqr(c2);
    return {
      c0: Fp22.add(Fp22.mulByNonresidue(t3), t0),
      // T3 * (u + 1) + T0
      c1: Fp22.add(Fp22.mulByNonresidue(t4), t1),
      // T4 * (u + 1) + T1
      // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
      c2: Fp22.sub(Fp22.sub(Fp22.add(Fp22.add(t1, Fp22.sqr(Fp22.add(Fp22.sub(c0, c1), c2))), t3), t0), t4)
    };
  }
  addN(a2, b2) {
    return this.add(a2, b2);
  }
  subN(a2, b2) {
    return this.sub(a2, b2);
  }
  mulN(a2, b2) {
    return this.mul(a2, b2);
  }
  sqrN(a2) {
    return this.sqr(a2);
  }
  create(num) {
    return num;
  }
  isValid({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    return Fp22.isValid(c0) && Fp22.isValid(c1) && Fp22.isValid(c2);
  }
  is0({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    return Fp22.is0(c0) && Fp22.is0(c1) && Fp22.is0(c2);
  }
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  neg({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    return { c0: Fp22.neg(c0), c1: Fp22.neg(c1), c2: Fp22.neg(c2) };
  }
  eql({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
    const { Fp2: Fp22 } = this;
    return Fp22.eql(c0, r0) && Fp22.eql(c1, r1) && Fp22.eql(c2, r2);
  }
  sqrt(_2) {
    return notImplemented();
  }
  // Do we need division by bigint at all? Should be done via order:
  div(lhs, rhs) {
    const { Fp2: Fp22 } = this;
    const { Fp: Fp4 } = Fp22;
    return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  invertBatch(nums) {
    return FpInvertBatch(this, nums);
  }
  inv({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    let t0 = Fp22.sub(Fp22.sqr(c0), Fp22.mulByNonresidue(Fp22.mul(c2, c1)));
    let t1 = Fp22.sub(Fp22.mulByNonresidue(Fp22.sqr(c2)), Fp22.mul(c0, c1));
    let t2 = Fp22.sub(Fp22.sqr(c1), Fp22.mul(c0, c2));
    let t4 = Fp22.inv(Fp22.add(Fp22.mulByNonresidue(Fp22.add(Fp22.mul(c2, t1), Fp22.mul(c1, t2))), Fp22.mul(c0, t0)));
    return { c0: Fp22.mul(t4, t0), c1: Fp22.mul(t4, t1), c2: Fp22.mul(t4, t2) };
  }
  // Bytes utils
  fromBytes(b2) {
    const { Fp2: Fp22 } = this;
    if (b2.length !== this.BYTES)
      throw new Error("fromBytes invalid length=" + b2.length);
    const B2 = Fp22.BYTES;
    return {
      c0: Fp22.fromBytes(b2.subarray(0, B2)),
      c1: Fp22.fromBytes(b2.subarray(B2, B2 * 2)),
      c2: Fp22.fromBytes(b2.subarray(2 * B2))
    };
  }
  toBytes({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    return concatBytes(Fp22.toBytes(c0), Fp22.toBytes(c1), Fp22.toBytes(c2));
  }
  cmov({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c3) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.cmov(c0, r0, c3),
      c1: Fp22.cmov(c1, r1, c3),
      c2: Fp22.cmov(c2, r2, c3)
    };
  }
  fromBigSix(t) {
    const { Fp2: Fp22 } = this;
    if (!Array.isArray(t) || t.length !== 6)
      throw new Error("invalid Fp6 usage");
    return {
      c0: Fp22.fromBigTuple(t.slice(0, 2)),
      c1: Fp22.fromBigTuple(t.slice(2, 4)),
      c2: Fp22.fromBigTuple(t.slice(4, 6))
    };
  }
  frobeniusMap({ c0, c1, c2 }, power) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.frobeniusMap(c0, power),
      c1: Fp22.mul(Fp22.frobeniusMap(c1, power), this.FROBENIUS_COEFFICIENTS_1[power % 6]),
      c2: Fp22.mul(Fp22.frobeniusMap(c2, power), this.FROBENIUS_COEFFICIENTS_2[power % 6])
    };
  }
  mulByFp2({ c0, c1, c2 }, rhs) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.mul(c0, rhs),
      c1: Fp22.mul(c1, rhs),
      c2: Fp22.mul(c2, rhs)
    };
  }
  mulByNonresidue({ c0, c1, c2 }) {
    const { Fp2: Fp22 } = this;
    return { c0: Fp22.mulByNonresidue(c2), c1: c0, c2: c1 };
  }
  // Sparse multiplication
  mul1({ c0, c1, c2 }, b1) {
    const { Fp2: Fp22 } = this;
    return {
      c0: Fp22.mulByNonresidue(Fp22.mul(c2, b1)),
      c1: Fp22.mul(c0, b1),
      c2: Fp22.mul(c1, b1)
    };
  }
  // Sparse multiplication
  mul01({ c0, c1, c2 }, b0, b1) {
    const { Fp2: Fp22 } = this;
    let t0 = Fp22.mul(c0, b0);
    let t1 = Fp22.mul(c1, b1);
    return {
      // ((c1 + c2) * b1 - T1) * (u + 1) + T0
      c0: Fp22.add(Fp22.mulByNonresidue(Fp22.sub(Fp22.mul(Fp22.add(c1, c2), b1), t1)), t0),
      // (b0 + b1) * (c0 + c1) - T0 - T1
      c1: Fp22.sub(Fp22.sub(Fp22.mul(Fp22.add(b0, b1), Fp22.add(c0, c1)), t0), t1),
      // (c0 + c2) * b0 - T0 + T1
      c2: Fp22.add(Fp22.sub(Fp22.mul(Fp22.add(c0, c2), b0), t0), t1)
    };
  }
};
var _Field12 = class {
  constructor(Fp62, opts) {
    this.MASK = _1n6;
    const { Fp2: Fp22 } = Fp62;
    const { Fp: Fp4 } = Fp22;
    this.Fp6 = Fp62;
    this.ORDER = Fp22.ORDER;
    this.BITS = 2 * Fp62.BITS;
    this.BYTES = 2 * Fp62.BYTES;
    this.isLE = Fp62.isLE;
    this.ZERO = { c0: Fp62.ZERO, c1: Fp62.ZERO };
    this.ONE = { c0: Fp62.ONE, c1: Fp62.ZERO };
    this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp22, Fp22.NONRESIDUE, Fp4.ORDER, 12, 1, 6)[0];
    this.X_LEN = opts.X_LEN;
    this.finalExponentiate = opts.Fp12finalExponentiate;
  }
  create(num) {
    return num;
  }
  isValid({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    return Fp62.isValid(c0) && Fp62.isValid(c1);
  }
  is0({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    return Fp62.is0(c0) && Fp62.is0(c1);
  }
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  neg({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    return { c0: Fp62.neg(c0), c1: Fp62.neg(c1) };
  }
  eql({ c0, c1 }, { c0: r0, c1: r1 }) {
    const { Fp6: Fp62 } = this;
    return Fp62.eql(c0, r0) && Fp62.eql(c1, r1);
  }
  sqrt(_2) {
    notImplemented();
  }
  inv({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    let t = Fp62.inv(Fp62.sub(Fp62.sqr(c0), Fp62.mulByNonresidue(Fp62.sqr(c1))));
    return { c0: Fp62.mul(c0, t), c1: Fp62.neg(Fp62.mul(c1, t)) };
  }
  div(lhs, rhs) {
    const { Fp6: Fp62 } = this;
    const { Fp2: Fp22 } = Fp62;
    const { Fp: Fp4 } = Fp22;
    return this.mul(lhs, typeof rhs === "bigint" ? Fp4.inv(Fp4.create(rhs)) : this.inv(rhs));
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  invertBatch(nums) {
    return FpInvertBatch(this, nums);
  }
  // Normalized
  add({ c0, c1 }, { c0: r0, c1: r1 }) {
    const { Fp6: Fp62 } = this;
    return {
      c0: Fp62.add(c0, r0),
      c1: Fp62.add(c1, r1)
    };
  }
  sub({ c0, c1 }, { c0: r0, c1: r1 }) {
    const { Fp6: Fp62 } = this;
    return {
      c0: Fp62.sub(c0, r0),
      c1: Fp62.sub(c1, r1)
    };
  }
  mul({ c0, c1 }, rhs) {
    const { Fp6: Fp62 } = this;
    if (typeof rhs === "bigint")
      return { c0: Fp62.mul(c0, rhs), c1: Fp62.mul(c1, rhs) };
    let { c0: r0, c1: r1 } = rhs;
    let t1 = Fp62.mul(c0, r0);
    let t2 = Fp62.mul(c1, r1);
    return {
      c0: Fp62.add(t1, Fp62.mulByNonresidue(t2)),
      // T1 + T2 * v
      // (c0 + c1) * (r0 + r1) - (T1 + T2)
      c1: Fp62.sub(Fp62.mul(Fp62.add(c0, c1), Fp62.add(r0, r1)), Fp62.add(t1, t2))
    };
  }
  sqr({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    let ab = Fp62.mul(c0, c1);
    return {
      // (c1 * v + c0) * (c0 + c1) - AB - AB * v
      c0: Fp62.sub(Fp62.sub(Fp62.mul(Fp62.add(Fp62.mulByNonresidue(c1), c0), Fp62.add(c0, c1)), ab), Fp62.mulByNonresidue(ab)),
      c1: Fp62.add(ab, ab)
    };
  }
  // NonNormalized stuff
  addN(a2, b2) {
    return this.add(a2, b2);
  }
  subN(a2, b2) {
    return this.sub(a2, b2);
  }
  mulN(a2, b2) {
    return this.mul(a2, b2);
  }
  sqrN(a2) {
    return this.sqr(a2);
  }
  // Bytes utils
  fromBytes(b2) {
    const { Fp6: Fp62 } = this;
    if (b2.length !== this.BYTES)
      throw new Error("fromBytes invalid length=" + b2.length);
    return {
      c0: Fp62.fromBytes(b2.subarray(0, Fp62.BYTES)),
      c1: Fp62.fromBytes(b2.subarray(Fp62.BYTES))
    };
  }
  toBytes({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    return concatBytes(Fp62.toBytes(c0), Fp62.toBytes(c1));
  }
  cmov({ c0, c1 }, { c0: r0, c1: r1 }, c2) {
    const { Fp6: Fp62 } = this;
    return {
      c0: Fp62.cmov(c0, r0, c2),
      c1: Fp62.cmov(c1, r1, c2)
    };
  }
  // Utils
  // toString() {
  //   return '' + 'Fp12(' + this.c0 + this.c1 + '* w');
  // },
  // fromTuple(c: [Fp6, Fp6]) {
  //   return new Fp12(...c);
  // }
  fromBigTwelve(t) {
    const { Fp6: Fp62 } = this;
    return {
      c0: Fp62.fromBigSix(t.slice(0, 6)),
      c1: Fp62.fromBigSix(t.slice(6, 12))
    };
  }
  // Raises to q**i -th power
  frobeniusMap(lhs, power) {
    const { Fp6: Fp62 } = this;
    const { Fp2: Fp22 } = Fp62;
    const { c0, c1, c2 } = Fp62.frobeniusMap(lhs.c1, power);
    const coeff = this.FROBENIUS_COEFFICIENTS[power % 12];
    return {
      c0: Fp62.frobeniusMap(lhs.c0, power),
      c1: Fp62.create({
        c0: Fp22.mul(c0, coeff),
        c1: Fp22.mul(c1, coeff),
        c2: Fp22.mul(c2, coeff)
      })
    };
  }
  mulByFp2({ c0, c1 }, rhs) {
    const { Fp6: Fp62 } = this;
    return {
      c0: Fp62.mulByFp2(c0, rhs),
      c1: Fp62.mulByFp2(c1, rhs)
    };
  }
  conjugate({ c0, c1 }) {
    return { c0, c1: this.Fp6.neg(c1) };
  }
  // Sparse multiplication
  mul014({ c0, c1 }, o0, o1, o4) {
    const { Fp6: Fp62 } = this;
    const { Fp2: Fp22 } = Fp62;
    let t0 = Fp62.mul01(c0, o0, o1);
    let t1 = Fp62.mul1(c1, o4);
    return {
      c0: Fp62.add(Fp62.mulByNonresidue(t1), t0),
      // T1 * v + T0
      // (c1 + c0) * [o0, o1+o4] - T0 - T1
      c1: Fp62.sub(Fp62.sub(Fp62.mul01(Fp62.add(c1, c0), o0, Fp22.add(o1, o4)), t0), t1)
    };
  }
  mul034({ c0, c1 }, o0, o3, o4) {
    const { Fp6: Fp62 } = this;
    const { Fp2: Fp22 } = Fp62;
    const a2 = Fp62.create({
      c0: Fp22.mul(c0.c0, o0),
      c1: Fp22.mul(c0.c1, o0),
      c2: Fp22.mul(c0.c2, o0)
    });
    const b2 = Fp62.mul01(c1, o3, o4);
    const e = Fp62.mul01(Fp62.add(c0, c1), Fp22.add(o0, o3), o4);
    return {
      c0: Fp62.add(Fp62.mulByNonresidue(b2), a2),
      c1: Fp62.sub(e, Fp62.add(a2, b2))
    };
  }
  // A cyclotomic group is a subgroup of Fp^n defined by
  //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
  // The result of any pairing is in a cyclotomic subgroup
  // https://eprint.iacr.org/2009/565.pdf
  // https://eprint.iacr.org/2010/354.pdf
  _cyclotomicSquare({ c0, c1 }) {
    const { Fp6: Fp62 } = this;
    const { Fp2: Fp22 } = Fp62;
    const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
    const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
    const { first: t3, second: t4 } = Fp22.Fp4Square(c0c0, c1c1);
    const { first: t5, second: t6 } = Fp22.Fp4Square(c1c0, c0c2);
    const { first: t7, second: t8 } = Fp22.Fp4Square(c0c1, c1c2);
    const t9 = Fp22.mulByNonresidue(t8);
    return {
      c0: Fp62.create({
        c0: Fp22.add(Fp22.mul(Fp22.sub(t3, c0c0), _2n4), t3),
        // 2 * (T3 - c0c0)  + T3
        c1: Fp22.add(Fp22.mul(Fp22.sub(t5, c0c1), _2n4), t5),
        // 2 * (T5 - c0c1)  + T5
        c2: Fp22.add(Fp22.mul(Fp22.sub(t7, c0c2), _2n4), t7)
      }),
      // 2 * (T7 - c0c2)  + T7
      c1: Fp62.create({
        c0: Fp22.add(Fp22.mul(Fp22.add(t9, c1c0), _2n4), t9),
        // 2 * (T9 + c1c0) + T9
        c1: Fp22.add(Fp22.mul(Fp22.add(t4, c1c1), _2n4), t4),
        // 2 * (T4 + c1c1) + T4
        c2: Fp22.add(Fp22.mul(Fp22.add(t6, c1c2), _2n4), t6)
      })
    };
  }
  // https://eprint.iacr.org/2009/565.pdf
  _cyclotomicExp(num, n) {
    let z2 = this.ONE;
    for (let i = this.X_LEN - 1; i >= 0; i--) {
      z2 = this._cyclotomicSquare(z2);
      if (bitGet(n, i))
        z2 = this.mul(z2, num);
    }
    return z2;
  }
};
function tower12(opts) {
  const Fp4 = Field(opts.ORDER);
  const Fp22 = new _Field2(Fp4, opts);
  const Fp62 = new _Field6(Fp22);
  const Fp122 = new _Field12(Fp62, opts);
  return { Fp: Fp4, Fp2: Fp22, Fp6: Fp62, Fp12: Fp122 };
}

// node_modules/@noble/curves/esm/bls12-381.js
var _0n7 = BigInt(0);
var _1n7 = BigInt(1);
var _2n5 = BigInt(2);
var _3n5 = BigInt(3);
var _4n3 = BigInt(4);
var BLS_X = BigInt("0xd201000000010000");
var BLS_X_LEN = bitLen(BLS_X);
var bls12_381_CURVE_G1 = {
  p: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
  n: BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"),
  h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
  a: _0n7,
  b: _4n3,
  Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
  Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1")
};
var bls12_381_Fr = Field(bls12_381_CURVE_G1.n, {
  modFromBytes: true,
  isLE: true
});
var { Fp, Fp2, Fp6, Fp12 } = tower12({
  ORDER: bls12_381_CURVE_G1.p,
  X_LEN: BLS_X_LEN,
  // Finite extension field over irreducible polynominal.
  // Fp(u) / (u² - β) where β = -1
  FP2_NONRESIDUE: [_1n7, _1n7],
  Fp2mulByB: ({ c0, c1 }) => {
    const t0 = Fp.mul(c0, _4n3);
    const t1 = Fp.mul(c1, _4n3);
    return { c0: Fp.sub(t0, t1), c1: Fp.add(t0, t1) };
  },
  Fp12finalExponentiate: (num) => {
    const x2 = BLS_X;
    const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
    const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
    const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x2));
    const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
    const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x2));
    const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x2));
    const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x2)), Fp12._cyclotomicSquare(t2));
    const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x2));
    const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
    const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
    const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
    const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
    return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
  }
});
var { G2psi, G2psi2 } = psiFrobenius(Fp, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
var htfDefaults = Object.freeze({
  DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
  p: Fp.ORDER,
  m: 2,
  k: 128,
  expand: "xmd",
  hash: sha256
});
var bls12_381_CURVE_G2 = {
  p: Fp2.ORDER,
  n: bls12_381_CURVE_G1.n,
  h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
  a: Fp2.ZERO,
  b: Fp2.fromBigTuple([_4n3, _4n3]),
  Gx: Fp2.fromBigTuple([
    BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"),
    BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")
  ]),
  Gy: Fp2.fromBigTuple([
    BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"),
    BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")
  ])
};
var COMPZERO = setMask(Fp.toBytes(_0n7), { infinity: true, compressed: true });
function parseMask(bytes) {
  bytes = bytes.slice();
  const mask = bytes[0] & 224;
  const compressed = !!(mask >> 7 & 1);
  const infinity = !!(mask >> 6 & 1);
  const sort = !!(mask >> 5 & 1);
  bytes[0] &= 31;
  return { compressed, infinity, sort, value: bytes };
}
function setMask(bytes, mask) {
  if (bytes[0] & 224)
    throw new Error("setMask: non-empty mask");
  if (mask.compressed)
    bytes[0] |= 128;
  if (mask.infinity)
    bytes[0] |= 64;
  if (mask.sort)
    bytes[0] |= 32;
  return bytes;
}
function pointG1ToBytes(_c, point, isComp) {
  const { BYTES: L2, ORDER: P2 } = Fp;
  const is0 = point.is0();
  const { x: x2, y: y2 } = point.toAffine();
  if (isComp) {
    if (is0)
      return COMPZERO.slice();
    const sort = Boolean(y2 * _2n5 / P2);
    return setMask(numberToBytesBE(x2, L2), { compressed: true, sort });
  } else {
    if (is0) {
      return concatBytes(Uint8Array.of(64), new Uint8Array(2 * L2 - 1));
    } else {
      return concatBytes(numberToBytesBE(x2, L2), numberToBytesBE(y2, L2));
    }
  }
}
function signatureG1ToBytes(point) {
  point.assertValidity();
  const { BYTES: L2, ORDER: P2 } = Fp;
  const { x: x2, y: y2 } = point.toAffine();
  if (point.is0())
    return COMPZERO.slice();
  const sort = Boolean(y2 * _2n5 / P2);
  return setMask(numberToBytesBE(x2, L2), { compressed: true, sort });
}
function pointG1FromBytes(bytes) {
  const { compressed, infinity, sort, value } = parseMask(bytes);
  const { BYTES: L2, ORDER: P2 } = Fp;
  if (value.length === 48 && compressed) {
    const compressedValue = bytesToNumberBE(value);
    const x2 = Fp.create(compressedValue & bitMask(Fp.BITS));
    if (infinity) {
      if (x2 !== _0n7)
        throw new Error("invalid G1 point: non-empty, at infinity, with compression");
      return { x: _0n7, y: _0n7 };
    }
    const right = Fp.add(Fp.pow(x2, _3n5), Fp.create(bls12_381_CURVE_G1.b));
    let y2 = Fp.sqrt(right);
    if (!y2)
      throw new Error("invalid G1 point: compressed point");
    if (y2 * _2n5 / P2 !== BigInt(sort))
      y2 = Fp.neg(y2);
    return { x: Fp.create(x2), y: Fp.create(y2) };
  } else if (value.length === 96 && !compressed) {
    const x2 = bytesToNumberBE(value.subarray(0, L2));
    const y2 = bytesToNumberBE(value.subarray(L2));
    if (infinity) {
      if (x2 !== _0n7 || y2 !== _0n7)
        throw new Error("G1: non-empty point at infinity");
      return bls12_381.G1.Point.ZERO.toAffine();
    }
    return { x: Fp.create(x2), y: Fp.create(y2) };
  } else {
    throw new Error("invalid G1 point: expected 48/96 bytes");
  }
}
function signatureG1FromBytes(hex) {
  const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex, 48));
  const P2 = Fp.ORDER;
  const Point = bls12_381.G1.Point;
  const compressedValue = bytesToNumberBE(value);
  if (infinity)
    return Point.ZERO;
  const x2 = Fp.create(compressedValue & bitMask(Fp.BITS));
  const right = Fp.add(Fp.pow(x2, _3n5), Fp.create(bls12_381_CURVE_G1.b));
  let y2 = Fp.sqrt(right);
  if (!y2)
    throw new Error("invalid G1 point: compressed");
  const aflag = BigInt(sort);
  if (y2 * _2n5 / P2 !== aflag)
    y2 = Fp.neg(y2);
  const point = Point.fromAffine({ x: x2, y: y2 });
  point.assertValidity();
  return point;
}
function pointG2ToBytes(_c, point, isComp) {
  const { BYTES: L2, ORDER: P2 } = Fp;
  const is0 = point.is0();
  const { x: x2, y: y2 } = point.toAffine();
  if (isComp) {
    if (is0)
      return concatBytes(COMPZERO, numberToBytesBE(_0n7, L2));
    const flag = Boolean(y2.c1 === _0n7 ? y2.c0 * _2n5 / P2 : y2.c1 * _2n5 / P2);
    return concatBytes(setMask(numberToBytesBE(x2.c1, L2), { compressed: true, sort: flag }), numberToBytesBE(x2.c0, L2));
  } else {
    if (is0)
      return concatBytes(Uint8Array.of(64), new Uint8Array(4 * L2 - 1));
    const { re: x0, im: x1 } = Fp2.reim(x2);
    const { re: y0, im: y1 } = Fp2.reim(y2);
    return concatBytes(numberToBytesBE(x1, L2), numberToBytesBE(x0, L2), numberToBytesBE(y1, L2), numberToBytesBE(y0, L2));
  }
}
function signatureG2ToBytes(point) {
  point.assertValidity();
  const { BYTES: L2 } = Fp;
  if (point.is0())
    return concatBytes(COMPZERO, numberToBytesBE(_0n7, L2));
  const { x: x2, y: y2 } = point.toAffine();
  const { re: x0, im: x1 } = Fp2.reim(x2);
  const { re: y0, im: y1 } = Fp2.reim(y2);
  const tmp = y1 > _0n7 ? y1 * _2n5 : y0 * _2n5;
  const sort = Boolean(tmp / Fp.ORDER & _1n7);
  const z2 = x0;
  return concatBytes(setMask(numberToBytesBE(x1, L2), { sort, compressed: true }), numberToBytesBE(z2, L2));
}
function pointG2FromBytes(bytes) {
  const { BYTES: L2, ORDER: P2 } = Fp;
  const { compressed, infinity, sort, value } = parseMask(bytes);
  if (!compressed && !infinity && sort || // 00100000
  !compressed && infinity && sort || // 01100000
  sort && infinity && compressed) {
    throw new Error("invalid encoding flag: " + (bytes[0] & 224));
  }
  const slc = (b2, from, to) => bytesToNumberBE(b2.slice(from, to));
  if (value.length === 96 && compressed) {
    if (infinity) {
      if (value.reduce((p2, c2) => p2 !== 0 ? c2 + 1 : c2, 0) > 0) {
        throw new Error("invalid G2 point: compressed");
      }
      return { x: Fp2.ZERO, y: Fp2.ZERO };
    }
    const x_1 = slc(value, 0, L2);
    const x_0 = slc(value, L2, 2 * L2);
    const x2 = Fp2.create({ c0: Fp.create(x_0), c1: Fp.create(x_1) });
    const right = Fp2.add(Fp2.pow(x2, _3n5), bls12_381_CURVE_G2.b);
    let y2 = Fp2.sqrt(right);
    const Y_bit = y2.c1 === _0n7 ? y2.c0 * _2n5 / P2 : y2.c1 * _2n5 / P2 ? _1n7 : _0n7;
    y2 = sort && Y_bit > 0 ? y2 : Fp2.neg(y2);
    return { x: x2, y: y2 };
  } else if (value.length === 192 && !compressed) {
    if (infinity) {
      if (value.reduce((p2, c2) => p2 !== 0 ? c2 + 1 : c2, 0) > 0) {
        throw new Error("invalid G2 point: uncompressed");
      }
      return { x: Fp2.ZERO, y: Fp2.ZERO };
    }
    const x1 = slc(value, 0 * L2, 1 * L2);
    const x0 = slc(value, 1 * L2, 2 * L2);
    const y1 = slc(value, 2 * L2, 3 * L2);
    const y0 = slc(value, 3 * L2, 4 * L2);
    return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
  } else {
    throw new Error("invalid G2 point: expected 96/192 bytes");
  }
}
function signatureG2FromBytes(hex) {
  const { ORDER: P2 } = Fp;
  const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex));
  const Point = bls12_381.G2.Point;
  const half = value.length / 2;
  if (half !== 48 && half !== 96)
    throw new Error("invalid compressed signature length, expected 96/192 bytes");
  const z1 = bytesToNumberBE(value.slice(0, half));
  const z2 = bytesToNumberBE(value.slice(half));
  if (infinity)
    return Point.ZERO;
  const x1 = Fp.create(z1 & bitMask(Fp.BITS));
  const x2 = Fp.create(z2);
  const x3 = Fp2.create({ c0: x2, c1: x1 });
  const y2 = Fp2.add(Fp2.pow(x3, _3n5), bls12_381_CURVE_G2.b);
  let y3 = Fp2.sqrt(y2);
  if (!y3)
    throw new Error("Failed to find a square root");
  const { re: y0, im: y1 } = Fp2.reim(y3);
  const aflag1 = BigInt(sort);
  const isGreater = y1 > _0n7 && y1 * _2n5 / P2 !== aflag1;
  const is0 = y1 === _0n7 && y0 * _2n5 / P2 !== aflag1;
  if (isGreater || is0)
    y3 = Fp2.neg(y3);
  const point = Point.fromAffine({ x: x3, y: y3 });
  point.assertValidity();
  return point;
}
var bls12_381 = bls({
  // Fields
  fields: {
    Fp,
    Fp2,
    Fp6,
    Fp12,
    Fr: bls12_381_Fr
  },
  // G1: y² = x³ + 4
  G1: {
    ...bls12_381_CURVE_G1,
    Fp,
    htfDefaults: { ...htfDefaults, m: 1, DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_" },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    isTorsionFree: (c2, point) => {
      const beta = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
      const phi = new c2(Fp.mul(point.X, beta), point.Y, point.Z);
      const xP = point.multiplyUnsafe(BLS_X).negate();
      const u2P = xP.multiplyUnsafe(BLS_X);
      return u2P.equals(phi);
    },
    // Clear cofactor of G1
    // https://eprint.iacr.org/2019/403
    clearCofactor: (_c, point) => {
      return point.multiplyUnsafe(BLS_X).add(point);
    },
    mapToCurve: mapToG1,
    fromBytes: pointG1FromBytes,
    toBytes: pointG1ToBytes,
    ShortSignature: {
      fromBytes(bytes) {
        abytes(bytes);
        return signatureG1FromBytes(bytes);
      },
      fromHex(hex) {
        return signatureG1FromBytes(hex);
      },
      toBytes(point) {
        return signatureG1ToBytes(point);
      },
      toRawBytes(point) {
        return signatureG1ToBytes(point);
      },
      toHex(point) {
        return bytesToHex(signatureG1ToBytes(point));
      }
    }
  },
  G2: {
    ...bls12_381_CURVE_G2,
    Fp: Fp2,
    // https://datatracker.ietf.org/doc/html/rfc9380#name-clearing-the-cofactor
    // https://datatracker.ietf.org/doc/html/rfc9380#name-cofactor-clearing-for-bls12
    hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
    htfDefaults: { ...htfDefaults },
    wrapPrivateKey: true,
    allowInfinityPoint: true,
    mapToCurve: mapToG2,
    // Checks is the point resides in prime-order subgroup.
    // point.isTorsionFree() should return true for valid points
    // It returns false for shitty points.
    // https://eprint.iacr.org/2021/1130.pdf
    // Older version: https://eprint.iacr.org/2019/814.pdf
    isTorsionFree: (c2, P2) => {
      return P2.multiplyUnsafe(BLS_X).negate().equals(G2psi(c2, P2));
    },
    // Maps the point into the prime-order subgroup G2.
    // clear_cofactor_bls12381_g2 from RFC 9380.
    // https://eprint.iacr.org/2017/419.pdf
    // prettier-ignore
    clearCofactor: (c2, P2) => {
      const x2 = BLS_X;
      let t1 = P2.multiplyUnsafe(x2).negate();
      let t2 = G2psi(c2, P2);
      let t3 = P2.double();
      t3 = G2psi2(c2, t3);
      t3 = t3.subtract(t2);
      t2 = t1.add(t2);
      t2 = t2.multiplyUnsafe(x2).negate();
      t3 = t3.add(t2);
      t3 = t3.subtract(t1);
      const Q2 = t3.subtract(P2);
      return Q2;
    },
    fromBytes: pointG2FromBytes,
    toBytes: pointG2ToBytes,
    Signature: {
      fromBytes(bytes) {
        abytes(bytes);
        return signatureG2FromBytes(bytes);
      },
      fromHex(hex) {
        return signatureG2FromBytes(hex);
      },
      toBytes(point) {
        return signatureG2ToBytes(point);
      },
      toRawBytes(point) {
        return signatureG2ToBytes(point);
      },
      toHex(point) {
        return bytesToHex(signatureG2ToBytes(point));
      }
    }
  },
  params: {
    ateLoopSize: BLS_X,
    // The BLS parameter x for BLS12-381
    r: bls12_381_CURVE_G1.n,
    // order; z⁴ − z² + 1; CURVE.n from other curves
    xNegative: true,
    twistType: "multiplicative"
  },
  htfDefaults,
  hash: sha256
});
var isogenyMapG2 = isogenyMap(Fp2, [
  // xNum
  [
    [
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"
    ],
    [
      "0x0",
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"
    ],
    [
      "0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1",
      "0x0"
    ]
  ],
  // xDen
  [
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"
    ],
    [
      "0xc",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ],
  // yNum
  [
    [
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706",
      "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"
    ],
    [
      "0x0",
      "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"
    ],
    [
      "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c",
      "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"
    ],
    [
      "0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10",
      "0x0"
    ]
  ],
  // yDen
  [
    [
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"
    ],
    [
      "0x0",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"
    ],
    [
      "0x12",
      "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"
    ],
    ["0x1", "0x0"]
    // LAST 1
  ]
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
var isogenyMapG1 = isogenyMap(Fp, [
  // xNum
  [
    "0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
    "0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
    "0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
    "0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
    "0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
    "0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
    "0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
    "0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
    "0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
    "0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
    "0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
    "0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
  ],
  // xDen
  [
    "0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
    "0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
    "0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
    "0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
    "0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
    "0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
    "0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
    "0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
    "0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
    "0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ],
  // yNum
  [
    "0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
    "0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
    "0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
    "0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
    "0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
    "0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
    "0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
    "0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
    "0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
    "0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
    "0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
    "0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
    "0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
    "0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
    "0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
    "0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
  ],
  // yDen
  [
    "0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
    "0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
    "0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
    "0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
    "0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
    "0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
    "0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
    "0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
    "0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
    "0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
    "0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
    "0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
    "0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
    "0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
    "0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
    "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
    // LAST 1
  ]
].map((i) => i.map((j2) => BigInt(j2))));
var G1_SWU = mapToCurveSimpleSWU(Fp, {
  A: Fp.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
  B: Fp.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
  Z: Fp.create(BigInt(11))
});
var G2_SWU = mapToCurveSimpleSWU(Fp2, {
  A: Fp2.create({ c0: Fp.create(_0n7), c1: Fp.create(BigInt(240)) }),
  // A' = 240 * I
  B: Fp2.create({ c0: Fp.create(BigInt(1012)), c1: Fp.create(BigInt(1012)) }),
  // B' = 1012 * (1 + I)
  Z: Fp2.create({ c0: Fp.create(BigInt(-2)), c1: Fp.create(BigInt(-1)) })
  // Z: -(2 + I)
});
function mapToG1(scalars) {
  const { x: x2, y: y2 } = G1_SWU(Fp.create(scalars[0]));
  return isogenyMapG1(x2, y2);
}
function mapToG2(scalars) {
  const { x: x2, y: y2 } = G2_SWU(Fp2.fromBigTuple(scalars));
  return isogenyMapG2(x2, y2);
}

// node_modules/@dfinity/agent/lib/esm/utils/bls.js
var verify;
function blsVerify(pk, sig, msg) {
  const primaryKey = typeof pk === "string" ? pk : bytesToHex(pk);
  const signature = typeof sig === "string" ? sig : bytesToHex(sig);
  const message = typeof msg === "string" ? msg : bytesToHex(msg);
  return bls12_381.verifyShortSignature(signature, message, primaryKey);
}

// node_modules/@dfinity/agent/lib/esm/utils/leb.js
var import_dist64 = __toESM(require_dist(), 1);
var import_dist65 = __toESM(require_dist2(), 1);
var import_dist66 = __toESM(require_dist3(), 1);
var MILLISECOND_TO_NANOSECONDS = BigInt(1e6);
var decodeLeb128 = (buf) => {
  return lebDecode(new PipeArrayBuffer(buf));
};
var decodeTime = (buf) => {
  const timestampNs = decodeLeb128(buf);
  const timestampMs = timestampNs / MILLISECOND_TO_NANOSECONDS;
  return new Date(Number(timestampMs));
};

// node_modules/@dfinity/agent/lib/esm/certificate.js
var MINUTES_TO_MSEC = 60 * 1e3;
var HOURS_TO_MINUTES = 60;
var DAYS_TO_HOURS = 24;
var DAYS_TO_MINUTES = DAYS_TO_HOURS * HOURS_TO_MINUTES;
var DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES = 5;
var DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE = 5;
var DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES = 30 * DAYS_TO_MINUTES;
var NodeType;
(function(NodeType2) {
  NodeType2[NodeType2["Empty"] = 0] = "Empty";
  NodeType2[NodeType2["Fork"] = 1] = "Fork";
  NodeType2[NodeType2["Labeled"] = 2] = "Labeled";
  NodeType2[NodeType2["Leaf"] = 3] = "Leaf";
  NodeType2[NodeType2["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
function hashTreeToString(tree) {
  const indent = (s2) => s2.split("\n").map((x2) => "  " + x2).join("\n");
  function labelToString(label) {
    const decoder = new TextDecoder(void 0, { fatal: true });
    try {
      return JSON.stringify(decoder.decode(label));
    } catch (e) {
      return `data(...${label.byteLength} bytes)`;
    }
  }
  switch (tree[0]) {
    case NodeType.Empty:
      return "()";
    case NodeType.Fork: {
      if (tree[1] instanceof Array && tree[2] instanceof Uint8Array) {
        const left = hashTreeToString(tree[1]);
        const right = hashTreeToString(tree[2]);
        return `sub(
 left:
${indent(left)}
---
 right:
${indent(right)}
)`;
      } else {
        throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for fork"));
      }
    }
    case NodeType.Labeled: {
      if (tree[1] instanceof Uint8Array && tree[2] instanceof Uint8Array) {
        const label = labelToString(tree[1]);
        const sub = hashTreeToString(tree[2]);
        return `label(
 label:
${indent(label)}
 sub:
${indent(sub)}
)`;
      } else {
        throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for labeled"));
      }
    }
    case NodeType.Leaf: {
      if (!tree[1]) {
        throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for leaf"));
      } else if (Array.isArray(tree[1])) {
        return JSON.stringify(tree[1]);
      }
      return `leaf(...${tree[1].byteLength} bytes)`;
    }
    case NodeType.Pruned: {
      if (!tree[1]) {
        throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for pruned"));
      } else if (Array.isArray(tree[1])) {
        return JSON.stringify(tree[1]);
      }
      return `pruned(${bytesToHex(new Uint8Array(tree[1]))}`;
    }
    default: {
      return `unknown(${JSON.stringify(tree[0])})`;
    }
  }
}
function isBufferGreaterThan(a2, b2) {
  for (let i = 0; i < a2.length; i++) {
    if (a2[i] > b2[i]) {
      return true;
    }
  }
  return false;
}
var _disableTimeVerification, _agent;
var _Certificate = class _Certificate {
  constructor(certificate, _rootKey, _canisterId, _blsVerify, _maxAgeInMinutes = DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES, disableTimeVerification = false, agent) {
    __privateAdd(this, _disableTimeVerification, false);
    __privateAdd(this, _agent, void 0);
    this._rootKey = _rootKey;
    this._canisterId = _canisterId;
    this._blsVerify = _blsVerify;
    this._maxAgeInMinutes = _maxAgeInMinutes;
    __privateSet(this, _disableTimeVerification, disableTimeVerification);
    this.cert = decode(certificate);
    if (agent && "getTimeDiffMsecs" in agent && "hasSyncedTime" in agent && "syncTime" in agent) {
      __privateSet(this, _agent, agent);
    }
  }
  /**
   * Create a new instance of a certificate, automatically verifying it.
   * @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
   * @throws if the verification of the certificate fails
   */
  static async create(options) {
    const cert = _Certificate.createUnverified(options);
    await cert.verify();
    return cert;
  }
  static createUnverified(options) {
    return new _Certificate(options.certificate, options.rootKey, options.canisterId, options.blsVerify ?? blsVerify, options.maxAgeInMinutes, options.disableTimeVerification, options.agent);
  }
  /**
   * Lookup a path in the certificate tree, using {@link lookup_path}.
   * @param path The path to lookup.
   * @returns The result of the lookup.
   */
  lookup_path(path) {
    return lookup_path(path, this.cert.tree);
  }
  /**
   * Lookup a subtree in the certificate tree, using {@link lookup_subtree}.
   * @param path The path to lookup.
   * @returns The result of the lookup.
   */
  lookup_subtree(path) {
    return lookup_subtree(path, this.cert.tree);
  }
  async verify() {
    var _a2, _b2;
    const rootHash = await reconstruct(this.cert.tree);
    const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
    const sig = this.cert.signature;
    const key = extractDER(derKey);
    const msg = concatBytes(domain_sep("ic-state-root"), rootHash);
    const lookupTime = lookupResultToBuffer(this.lookup_path(["time"]));
    if (!lookupTime) {
      throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Certificate does not contain a time"));
    }
    if (!__privateGet(this, _disableTimeVerification)) {
      const timeDiffMsecs = ((_a2 = __privateGet(this, _agent)) == null ? void 0 : _a2.getTimeDiffMsecs()) ?? 0;
      const maxAgeInMsec = this._maxAgeInMinutes * MINUTES_TO_MSEC;
      const now = /* @__PURE__ */ new Date();
      const adjustedNow = now.getTime() + timeDiffMsecs;
      const earliestCertificateTime = adjustedNow - maxAgeInMsec;
      const latestCertificateTime = adjustedNow + DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE * MINUTES_TO_MSEC;
      const certTime = decodeTime(lookupTime);
      const isCertificateTimePast = certTime.getTime() < earliestCertificateTime;
      const isCertificateTimeFuture = certTime.getTime() > latestCertificateTime;
      if ((isCertificateTimePast || isCertificateTimeFuture) && __privateGet(this, _agent) && !__privateGet(this, _agent).hasSyncedTime()) {
        await __privateGet(this, _agent).syncTime(this._canisterId);
        return await this.verify();
      }
      if (isCertificateTimePast) {
        throw TrustError.fromCode(new CertificateTimeErrorCode(this._maxAgeInMinutes, certTime, now, timeDiffMsecs, "past"));
      } else if (isCertificateTimeFuture) {
        if ((_b2 = __privateGet(this, _agent)) == null ? void 0 : _b2.hasSyncedTime()) {
          throw UnknownError.fromCode(new UnexpectedErrorCode("System time has been synced with the IC network, but certificate is still too far in the future."));
        }
        throw TrustError.fromCode(new CertificateTimeErrorCode(5, certTime, now, timeDiffMsecs, "future"));
      }
    }
    try {
      const sigVer = await this._blsVerify(key, sig, msg);
      if (!sigVer) {
        throw TrustError.fromCode(new CertificateVerificationErrorCode("Invalid signature"));
      }
    } catch (err) {
      throw TrustError.fromCode(new CertificateVerificationErrorCode("Signature verification failed", err));
    }
  }
  async _checkDelegationAndGetKey(d2) {
    if (!d2) {
      return this._rootKey;
    }
    const cert = _Certificate.createUnverified({
      certificate: d2.certificate,
      rootKey: this._rootKey,
      canisterId: this._canisterId,
      blsVerify: this._blsVerify,
      disableTimeVerification: __privateGet(this, _disableTimeVerification),
      maxAgeInMinutes: DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES,
      agent: __privateGet(this, _agent)
    });
    if (cert.cert.delegation) {
      throw ProtocolError.fromCode(new CertificateHasTooManyDelegationsErrorCode());
    }
    await cert.verify();
    const subnetIdBytes = d2.subnet_id;
    const subnetId = Principal.fromUint8Array(subnetIdBytes);
    const canisterInRange = check_canister_ranges({
      canisterId: this._canisterId,
      subnetId,
      tree: cert.cert.tree
    });
    if (!canisterInRange) {
      throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(this._canisterId, subnetId));
    }
    const publicKeyLookup = lookupResultToBuffer(cert.lookup_path(["subnet", subnetIdBytes, "public_key"]));
    if (!publicKeyLookup) {
      throw TrustError.fromCode(new MissingLookupValueErrorCode(`Could not find subnet key for subnet ID ${subnetId.toText()}`));
    }
    return publicKeyLookup;
  }
};
_disableTimeVerification = new WeakMap();
_agent = new WeakMap();
var Certificate = _Certificate;
var DER_PREFIX = hexToBytes("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
var KEY_LENGTH = 96;
function extractDER(buf) {
  const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
  if (buf.byteLength !== expectedLength) {
    throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(expectedLength, buf.byteLength));
  }
  const prefix = buf.slice(0, DER_PREFIX.byteLength);
  if (!uint8Equals(prefix, DER_PREFIX)) {
    throw ProtocolError.fromCode(new DerPrefixMismatchErrorCode(DER_PREFIX, prefix));
  }
  return buf.slice(DER_PREFIX.byteLength);
}
function lookupResultToBuffer(result) {
  if (result.status !== LookupPathStatus.Found) {
    return void 0;
  }
  if (result.value instanceof Uint8Array) {
    return result.value;
  }
  return void 0;
}
async function reconstruct(t) {
  switch (t[0]) {
    case NodeType.Empty:
      return sha256(domain_sep("ic-hashtree-empty"));
    case NodeType.Pruned:
      return t[1];
    case NodeType.Leaf:
      return sha256(concatBytes(domain_sep("ic-hashtree-leaf"), t[1]));
    case NodeType.Labeled:
      return sha256(concatBytes(domain_sep("ic-hashtree-labeled"), t[1], await reconstruct(t[2])));
    case NodeType.Fork:
      return sha256(concatBytes(domain_sep("ic-hashtree-fork"), await reconstruct(t[1]), await reconstruct(t[2])));
    default:
      throw UNREACHABLE_ERROR;
  }
}
function domain_sep(s2) {
  const len = new Uint8Array([s2.length]);
  const str = new TextEncoder().encode(s2);
  return concatBytes(len, str);
}
function pathToLabel(path) {
  return typeof path[0] === "string" ? utf8ToBytes(path[0]) : path[0];
}
var LookupPathStatus;
(function(LookupPathStatus2) {
  LookupPathStatus2["Unknown"] = "Unknown";
  LookupPathStatus2["Absent"] = "Absent";
  LookupPathStatus2["Found"] = "Found";
  LookupPathStatus2["Error"] = "Error";
})(LookupPathStatus || (LookupPathStatus = {}));
var LookupSubtreeStatus;
(function(LookupSubtreeStatus2) {
  LookupSubtreeStatus2["Absent"] = "Absent";
  LookupSubtreeStatus2["Unknown"] = "Unknown";
  LookupSubtreeStatus2["Found"] = "Found";
})(LookupSubtreeStatus || (LookupSubtreeStatus = {}));
var LookupLabelStatus;
(function(LookupLabelStatus2) {
  LookupLabelStatus2["Absent"] = "Absent";
  LookupLabelStatus2["Unknown"] = "Unknown";
  LookupLabelStatus2["Found"] = "Found";
  LookupLabelStatus2["Less"] = "Less";
  LookupLabelStatus2["Greater"] = "Greater";
})(LookupLabelStatus || (LookupLabelStatus = {}));
function lookup_path(path, tree) {
  if (path.length === 0) {
    switch (tree[0]) {
      case NodeType.Empty: {
        return {
          status: LookupPathStatus.Absent
        };
      }
      case NodeType.Leaf: {
        if (!tree[1]) {
          throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for leaf"));
        }
        if (tree[1] instanceof Uint8Array) {
          return {
            status: LookupPathStatus.Found,
            value: tree[1].slice(tree[1].byteOffset, tree[1].byteLength + tree[1].byteOffset)
          };
        }
        throw UNREACHABLE_ERROR;
      }
      case NodeType.Pruned: {
        return {
          status: LookupPathStatus.Unknown
        };
      }
      case NodeType.Labeled:
      case NodeType.Fork: {
        return {
          status: LookupPathStatus.Error
        };
      }
      default: {
        throw UNREACHABLE_ERROR;
      }
    }
  }
  const label = pathToLabel(path);
  const lookupResult = find_label(label, tree);
  switch (lookupResult.status) {
    case LookupLabelStatus.Found: {
      return lookup_path(path.slice(1), lookupResult.value);
    }
    case LookupLabelStatus.Absent:
    case LookupLabelStatus.Greater:
    case LookupLabelStatus.Less: {
      return {
        status: LookupPathStatus.Absent
      };
    }
    case LookupLabelStatus.Unknown: {
      return {
        status: LookupPathStatus.Unknown
      };
    }
    default: {
      throw UNREACHABLE_ERROR;
    }
  }
}
function lookup_subtree(path, tree) {
  if (path.length === 0) {
    return {
      status: LookupSubtreeStatus.Found,
      value: tree
    };
  }
  const label = pathToLabel(path);
  const lookupResult = find_label(label, tree);
  switch (lookupResult.status) {
    case LookupLabelStatus.Found: {
      return lookup_subtree(path.slice(1), lookupResult.value);
    }
    case LookupLabelStatus.Unknown: {
      return {
        status: LookupSubtreeStatus.Unknown
      };
    }
    case LookupLabelStatus.Absent:
    case LookupLabelStatus.Greater:
    case LookupLabelStatus.Less: {
      return {
        status: LookupSubtreeStatus.Absent
      };
    }
    default: {
      throw UNREACHABLE_ERROR;
    }
  }
}
function flatten_forks(t) {
  switch (t[0]) {
    case NodeType.Empty:
      return [];
    case NodeType.Fork:
      return flatten_forks(t[1]).concat(flatten_forks(t[2]));
    default:
      return [t];
  }
}
function find_label(label, tree) {
  switch (tree[0]) {
    case NodeType.Labeled:
      if (isBufferGreaterThan(label, tree[1])) {
        return {
          status: LookupLabelStatus.Greater
        };
      }
      if (uint8Equals(label, tree[1])) {
        return {
          status: LookupLabelStatus.Found,
          value: tree[2]
        };
      }
      return {
        status: LookupLabelStatus.Less
      };
    case NodeType.Fork: {
      const leftLookupResult = find_label(label, tree[1]);
      switch (leftLookupResult.status) {
        case LookupLabelStatus.Greater: {
          const rightLookupResult = find_label(label, tree[2]);
          if (rightLookupResult.status === LookupLabelStatus.Less) {
            return {
              status: LookupLabelStatus.Absent
            };
          }
          return rightLookupResult;
        }
        case LookupLabelStatus.Unknown: {
          const rightLookupResult = find_label(label, tree[2]);
          if (rightLookupResult.status === LookupLabelStatus.Less) {
            return {
              status: LookupLabelStatus.Unknown
            };
          }
          return rightLookupResult;
        }
        default: {
          return leftLookupResult;
        }
      }
    }
    case NodeType.Pruned:
      return {
        status: LookupLabelStatus.Unknown
      };
    default:
      return {
        status: LookupLabelStatus.Absent
      };
  }
}
function check_canister_ranges(params) {
  const { canisterId, subnetId, tree } = params;
  const rangeLookup = lookup_path(["subnet", subnetId.toUint8Array(), "canister_ranges"], tree);
  if (rangeLookup.status !== LookupPathStatus.Found) {
    throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`, rangeLookup.status));
  }
  if (!(rangeLookup.value instanceof Uint8Array)) {
    throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`));
  }
  const ranges_arr = decode(rangeLookup.value);
  const ranges = ranges_arr.map((v2) => [
    Principal.fromUint8Array(v2[0]),
    Principal.fromUint8Array(v2[1])
  ]);
  const canisterInRange = ranges.some((r2) => r2[0].ltEq(canisterId) && r2[1].gtEq(canisterId));
  return canisterInRange;
}

// node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js
var CustomPath = class {
  constructor(key, path, decodeStrategy) {
    this.key = key;
    this.path = path;
    this.decodeStrategy = decodeStrategy;
  }
};
var request = async (options) => {
  const { agent, paths, disableCertificateTimeVerification = false } = options;
  const canisterId = Principal.from(options.canisterId);
  const uniquePaths = [...new Set(paths)];
  const status = /* @__PURE__ */ new Map();
  const promises = uniquePaths.map((path, index) => {
    const encodedPath = encodePath(path, canisterId);
    return (async () => {
      try {
        if (agent.rootKey === null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const rootKey = agent.rootKey;
        const response = await agent.readState(canisterId, {
          paths: [encodedPath]
        });
        const certificate = await Certificate.create({
          certificate: response.certificate,
          rootKey,
          canisterId,
          disableTimeVerification: disableCertificateTimeVerification,
          agent
        });
        const lookup = (cert, path3) => {
          if (path3 === "subnet") {
            const data2 = fetchNodeKeys(response.certificate, canisterId, rootKey);
            return {
              path: path3,
              data: data2
            };
          } else {
            return {
              path: path3,
              data: lookupResultToBuffer(cert.lookup_path(encodedPath))
            };
          }
        };
        const { path: path2, data } = lookup(certificate, uniquePaths[index]);
        if (!data) {
          console.warn(`Expected to find result for path ${path2}, but instead found nothing.`);
          if (typeof path2 === "string") {
            status.set(path2, null);
          } else {
            status.set(path2.key, null);
          }
        } else {
          switch (path2) {
            case "time": {
              status.set(path2, decodeTime(data));
              break;
            }
            case "controllers": {
              status.set(path2, decodeControllers(data));
              break;
            }
            case "module_hash": {
              status.set(path2, bytesToHex(data));
              break;
            }
            case "subnet": {
              status.set(path2, data);
              break;
            }
            case "candid": {
              status.set(path2, new TextDecoder().decode(data));
              break;
            }
            default: {
              if (typeof path2 !== "string" && "key" in path2 && "path" in path2) {
                switch (path2.decodeStrategy) {
                  case "raw":
                    status.set(path2.key, data);
                    break;
                  case "leb128": {
                    status.set(path2.key, decodeLeb128(data));
                    break;
                  }
                  case "cbor": {
                    status.set(path2.key, decode(data));
                    break;
                  }
                  case "hex": {
                    status.set(path2.key, bytesToHex(data));
                    break;
                  }
                  case "utf-8": {
                    status.set(path2.key, new TextDecoder().decode(data));
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) {
          throw error;
        }
        if (typeof path !== "string" && "key" in path && "path" in path) {
          status.set(path.key, null);
        } else {
          status.set(path, null);
        }
        console.group();
        console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
        console.warn(error);
        console.groupEnd();
      }
    })();
  });
  await Promise.all(promises);
  return status;
};
var fetchNodeKeys = (certificate, canisterId, root_key) => {
  if (!canisterId._isPrincipal) {
    throw InputError.fromCode(new UnexpectedErrorCode("Invalid canisterId"));
  }
  const cert = decode(certificate);
  const tree = cert.tree;
  let delegation = cert.delegation;
  let subnetId;
  if (delegation && delegation.subnet_id) {
    subnetId = Principal.fromUint8Array(new Uint8Array(delegation.subnet_id));
  } else if (!delegation && typeof root_key !== "undefined") {
    subnetId = Principal.selfAuthenticating(new Uint8Array(root_key));
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new Uint8Array(0)
    };
  } else {
    subnetId = Principal.selfAuthenticating(Principal.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe").toUint8Array());
    delegation = {
      subnet_id: subnetId.toUint8Array(),
      certificate: new Uint8Array(0)
    };
  }
  const canisterInRange = check_canister_ranges({ canisterId, subnetId, tree });
  if (!canisterInRange) {
    throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
  }
  const subnetLookupResult = lookup_subtree(["subnet", delegation.subnet_id, "node"], tree);
  if (subnetLookupResult.status !== LookupSubtreeStatus.Found) {
    throw ProtocolError.fromCode(new LookupErrorCode("Node not found", subnetLookupResult.status));
  }
  if (subnetLookupResult.value instanceof Uint8Array) {
    throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid node tree"));
  }
  const nodeForks = flatten_forks(subnetLookupResult.value);
  const nodeKeys = /* @__PURE__ */ new Map();
  nodeForks.forEach((fork) => {
    const node_id = Principal.from(fork[1]).toText();
    const publicKeyLookupResult = lookup_path(["public_key"], fork[2]);
    if (publicKeyLookupResult.status !== LookupPathStatus.Found) {
      throw ProtocolError.fromCode(new LookupErrorCode("Public key not found", publicKeyLookupResult.status));
    }
    const derEncodedPublicKey = publicKeyLookupResult.value;
    if (derEncodedPublicKey.byteLength !== 44) {
      throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(44, derEncodedPublicKey.byteLength));
    } else {
      nodeKeys.set(node_id, derEncodedPublicKey);
    }
  });
  return {
    subnetId: Principal.fromUint8Array(new Uint8Array(delegation.subnet_id)).toText(),
    nodeKeys
  };
};
var encodePath = (path, canisterId) => {
  const canisterUint8Array = canisterId.toUint8Array();
  switch (path) {
    case "time":
      return [utf8ToBytes("time")];
    case "controllers":
      return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("controllers")];
    case "module_hash":
      return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("module_hash")];
    case "subnet":
      return [utf8ToBytes("subnet")];
    case "candid":
      return [
        utf8ToBytes("canister"),
        canisterUint8Array,
        utf8ToBytes("metadata"),
        utf8ToBytes("candid:service")
      ];
    default: {
      if ("key" in path && "path" in path) {
        if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) {
          const metaPath = path.path;
          const encoded = typeof metaPath === "string" ? utf8ToBytes(metaPath) : metaPath;
          return [utf8ToBytes("canister"), canisterUint8Array, utf8ToBytes("metadata"), encoded];
        } else {
          return path["path"];
        }
      }
    }
  }
  throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for canister status. Please ensure that your path ${path} was formatted correctly.`));
};
var decodeControllers = (buf) => {
  const controllersRaw = decode(buf);
  return controllersRaw.map((buf2) => {
    return Principal.fromUint8Array(buf2);
  });
};

// node_modules/@noble/curves/esm/ed25519.js
var import_dist79 = __toESM(require_dist());
var import_dist80 = __toESM(require_dist2());
var import_dist81 = __toESM(require_dist3());

// node_modules/@noble/curves/esm/abstract/edwards.js
var import_dist73 = __toESM(require_dist(), 1);
var import_dist74 = __toESM(require_dist2(), 1);
var import_dist75 = __toESM(require_dist3(), 1);
var _0n8 = BigInt(0);
var _1n8 = BigInt(1);
var _2n6 = BigInt(2);
var _8n2 = BigInt(8);
function isEdValidXY(Fp4, CURVE, x2, y2) {
  const x22 = Fp4.sqr(x2);
  const y22 = Fp4.sqr(y2);
  const left = Fp4.add(Fp4.mul(CURVE.a, x22), y22);
  const right = Fp4.add(Fp4.ONE, Fp4.mul(CURVE.d, Fp4.mul(x22, y22)));
  return Fp4.eql(left, right);
}
function edwards(params, extraOpts = {}) {
  const validated = _createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
  const { Fp: Fp4, Fn: Fn2 } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor } = CURVE;
  _validateObject(extraOpts, {}, { uvRatio: "function" });
  const MASK = _2n6 << BigInt(Fn2.BYTES * 8) - _1n8;
  const modP = (n) => Fp4.create(n);
  const uvRatio2 = extraOpts.uvRatio || ((u, v2) => {
    try {
      return { isValid: true, value: Fp4.sqrt(Fp4.div(u, v2)) };
    } catch (e) {
      return { isValid: false, value: _0n8 };
    }
  });
  if (!isEdValidXY(Fp4, CURVE, CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  function acoord(title, n, banZero = false) {
    const min = banZero ? _1n8 : _0n8;
    aInRange("coordinate " + title, n, min, MASK);
    return n;
  }
  function aextpoint(other) {
    if (!(other instanceof Point))
      throw new Error("ExtendedPoint expected");
  }
  const toAffineMemo = memoized((p2, iz) => {
    const { X: X2, Y: Y2, Z: Z2 } = p2;
    const is0 = p2.is0();
    if (iz == null)
      iz = is0 ? _8n2 : Fp4.inv(Z2);
    const x2 = modP(X2 * iz);
    const y2 = modP(Y2 * iz);
    const zz = Fp4.mul(Z2, iz);
    if (is0)
      return { x: _0n8, y: _1n8 };
    if (zz !== _1n8)
      throw new Error("invZ was invalid");
    return { x: x2, y: y2 };
  });
  const assertValidMemo = memoized((p2) => {
    const { a: a2, d: d2 } = CURVE;
    if (p2.is0())
      throw new Error("bad point: ZERO");
    const { X: X2, Y: Y2, Z: Z2, T: T2 } = p2;
    const X22 = modP(X2 * X2);
    const Y22 = modP(Y2 * Y2);
    const Z22 = modP(Z2 * Z2);
    const Z4 = modP(Z22 * Z22);
    const aX2 = modP(X22 * a2);
    const left = modP(Z22 * modP(aX2 + Y22));
    const right = modP(Z4 + modP(d2 * modP(X22 * Y22)));
    if (left !== right)
      throw new Error("bad point: equation left != right (1)");
    const XY = modP(X2 * Y2);
    const ZT = modP(Z2 * T2);
    if (XY !== ZT)
      throw new Error("bad point: equation left != right (2)");
    return true;
  });
  class Point {
    constructor(X2, Y2, Z2, T2) {
      this.X = acoord("x", X2);
      this.Y = acoord("y", Y2);
      this.Z = acoord("z", Z2, true);
      this.T = acoord("t", T2);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    static fromAffine(p2) {
      if (p2 instanceof Point)
        throw new Error("extended point not allowed");
      const { x: x2, y: y2 } = p2 || {};
      acoord("x", x2);
      acoord("y", y2);
      return new Point(x2, y2, _1n8, modP(x2 * y2));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(bytes, zip215 = false) {
      const len = Fp4.BYTES;
      const { a: a2, d: d2 } = CURVE;
      bytes = copyBytes(_abytes2(bytes, len, "point"));
      _abool2(zip215, "zip215");
      const normed = copyBytes(bytes);
      const lastByte = bytes[len - 1];
      normed[len - 1] = lastByte & ~128;
      const y2 = bytesToNumberLE(normed);
      const max = zip215 ? MASK : Fp4.ORDER;
      aInRange("point.y", y2, _0n8, max);
      const y22 = modP(y2 * y2);
      const u = modP(y22 - _1n8);
      const v2 = modP(d2 * y22 - a2);
      let { isValid, value: x2 } = uvRatio2(u, v2);
      if (!isValid)
        throw new Error("bad point: invalid y coordinate");
      const isXOdd = (x2 & _1n8) === _1n8;
      const isLastByteOdd = (lastByte & 128) !== 0;
      if (!zip215 && x2 === _0n8 && isLastByteOdd)
        throw new Error("bad point: x=0 and x_0=1");
      if (isLastByteOdd !== isXOdd)
        x2 = modP(-x2);
      return Point.fromAffine({ x: x2, y: y2 });
    }
    static fromHex(bytes, zip215 = false) {
      return Point.fromBytes(ensureBytes("point", bytes), zip215);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy)
        this.multiply(_2n6);
      return this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      assertValidMemo(this);
    }
    // Compare one point to another.
    equals(other) {
      aextpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const X1Z2 = modP(X1 * Z2);
      const X2Z1 = modP(X2 * Z1);
      const Y1Z2 = modP(Y1 * Z2);
      const Y2Z1 = modP(Y2 * Z1);
      return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    negate() {
      return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a: a2 } = CURVE;
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const A2 = modP(X1 * X1);
      const B2 = modP(Y1 * Y1);
      const C2 = modP(_2n6 * modP(Z1 * Z1));
      const D = modP(a2 * A2);
      const x1y1 = X1 + Y1;
      const E2 = modP(modP(x1y1 * x1y1) - A2 - B2);
      const G2 = D + B2;
      const F2 = G2 - C2;
      const H2 = D - B2;
      const X3 = modP(E2 * F2);
      const Y3 = modP(G2 * H2);
      const T3 = modP(E2 * H2);
      const Z3 = modP(F2 * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(other) {
      aextpoint(other);
      const { a: a2, d: d2 } = CURVE;
      const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
      const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
      const A2 = modP(X1 * X2);
      const B2 = modP(Y1 * Y2);
      const C2 = modP(T1 * d2 * T2);
      const D = modP(Z1 * Z2);
      const E2 = modP((X1 + Y1) * (X2 + Y2) - A2 - B2);
      const F2 = D - C2;
      const G2 = D + C2;
      const H2 = modP(B2 - a2 * A2);
      const X3 = modP(E2 * F2);
      const Y3 = modP(G2 * H2);
      const T3 = modP(E2 * H2);
      const Z3 = modP(F2 * G2);
      return new Point(X3, Y3, Z3, T3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    // Constant-time multiplication.
    multiply(scalar) {
      if (!Fn2.isValidNot0(scalar))
        throw new Error("invalid scalar: expected 1 <= sc < curve.n");
      const { p: p2, f } = wnaf.cached(this, scalar, (p3) => normalizeZ(Point, p3));
      return normalizeZ(Point, [p2, f])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Does NOT allow scalars higher than CURVE.n.
    // Accepts optional accumulator to merge with multiply (important for sparse scalars)
    multiplyUnsafe(scalar, acc = Point.ZERO) {
      if (!Fn2.isValid(scalar))
        throw new Error("invalid scalar: expected 0 <= sc < curve.n");
      if (scalar === _0n8)
        return Point.ZERO;
      if (this.is0() || scalar === _1n8)
        return this;
      return wnaf.unsafe(this, scalar, (p2) => normalizeZ(Point, p2), acc);
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Multiplies point by cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return wnaf.unsafe(this, CURVE.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    clearCofactor() {
      if (cofactor === _1n8)
        return this;
      return this.multiplyUnsafe(cofactor);
    }
    toBytes() {
      const { x: x2, y: y2 } = this.toAffine();
      const bytes = Fp4.toBytes(y2);
      bytes[bytes.length - 1] |= x2 & _1n8 ? 128 : 0;
      return bytes;
    }
    toHex() {
      return bytesToHex(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
    // TODO: remove
    get ex() {
      return this.X;
    }
    get ey() {
      return this.Y;
    }
    get ez() {
      return this.Z;
    }
    get et() {
      return this.T;
    }
    static normalizeZ(points) {
      return normalizeZ(Point, points);
    }
    static msm(points, scalars) {
      return pippenger(Point, Fn2, points, scalars);
    }
    _setWindowSize(windowSize) {
      this.precompute(windowSize);
    }
    toRawBytes() {
      return this.toBytes();
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n8, modP(CURVE.Gx * CURVE.Gy));
  Point.ZERO = new Point(_0n8, _1n8, _1n8, _0n8);
  Point.Fp = Fp4;
  Point.Fn = Fn2;
  const wnaf = new wNAF(Point, Fn2.BITS);
  Point.BASE.precompute(8);
  return Point;
}
var PrimeEdwardsPoint = class {
  constructor(ep) {
    this.ep = ep;
  }
  // Static methods that must be implemented by subclasses
  static fromBytes(_bytes) {
    notImplemented();
  }
  static fromHex(_hex) {
    notImplemented();
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  // Common implementations
  clearCofactor() {
    return this;
  }
  assertValidity() {
    this.ep.assertValidity();
  }
  toAffine(invertedZ) {
    return this.ep.toAffine(invertedZ);
  }
  toHex() {
    return bytesToHex(this.toBytes());
  }
  toString() {
    return this.toHex();
  }
  isTorsionFree() {
    return true;
  }
  isSmallOrder() {
    return false;
  }
  add(other) {
    this.assertSame(other);
    return this.init(this.ep.add(other.ep));
  }
  subtract(other) {
    this.assertSame(other);
    return this.init(this.ep.subtract(other.ep));
  }
  multiply(scalar) {
    return this.init(this.ep.multiply(scalar));
  }
  multiplyUnsafe(scalar) {
    return this.init(this.ep.multiplyUnsafe(scalar));
  }
  double() {
    return this.init(this.ep.double());
  }
  negate() {
    return this.init(this.ep.negate());
  }
  precompute(windowSize, isLazy) {
    return this.init(this.ep.precompute(windowSize, isLazy));
  }
  /** @deprecated use `toBytes` */
  toRawBytes() {
    return this.toBytes();
  }
};
function eddsa(Point, cHash, eddsaOpts = {}) {
  if (typeof cHash !== "function")
    throw new Error('"hash" function param is required');
  _validateObject(eddsaOpts, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    mapToCurve: "function"
  });
  const { prehash } = eddsaOpts;
  const { BASE, Fp: Fp4, Fn: Fn2 } = Point;
  const randomBytes2 = eddsaOpts.randomBytes || randomBytes;
  const adjustScalarBytes2 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
  const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
    _abool2(phflag, "phflag");
    if (ctx.length || phflag)
      throw new Error("Contexts/pre-hash are not supported");
    return data;
  });
  function modN_LE(hash) {
    return Fn2.create(bytesToNumberLE(hash));
  }
  function getPrivateScalar(key) {
    const len = lengths.secretKey;
    key = ensureBytes("private key", key, len);
    const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
    const head = adjustScalarBytes2(hashed.slice(0, len));
    const prefix = hashed.slice(len, 2 * len);
    const scalar = modN_LE(head);
    return { head, prefix, scalar };
  }
  function getExtendedPublicKey(secretKey) {
    const { head, prefix, scalar } = getPrivateScalar(secretKey);
    const point = BASE.multiply(scalar);
    const pointBytes = point.toBytes();
    return { head, prefix, scalar, point, pointBytes };
  }
  function getPublicKey(secretKey) {
    return getExtendedPublicKey(secretKey).pointBytes;
  }
  function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
    const msg = concatBytes(...msgs);
    return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
  }
  function sign(msg, secretKey, options = {}) {
    msg = ensureBytes("message", msg);
    if (prehash)
      msg = prehash(msg);
    const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
    const r2 = hashDomainToScalar(options.context, prefix, msg);
    const R2 = BASE.multiply(r2).toBytes();
    const k2 = hashDomainToScalar(options.context, R2, pointBytes, msg);
    const s2 = Fn2.create(r2 + k2 * scalar);
    if (!Fn2.isValid(s2))
      throw new Error("sign failed: invalid s");
    const rs = concatBytes(R2, Fn2.toBytes(s2));
    return _abytes2(rs, lengths.signature, "result");
  }
  const verifyOpts = { zip215: true };
  function verify2(sig, msg, publicKey, options = verifyOpts) {
    const { context, zip215 } = options;
    const len = lengths.signature;
    sig = ensureBytes("signature", sig, len);
    msg = ensureBytes("message", msg);
    publicKey = ensureBytes("publicKey", publicKey, lengths.publicKey);
    if (zip215 !== void 0)
      _abool2(zip215, "zip215");
    if (prehash)
      msg = prehash(msg);
    const mid = len / 2;
    const r2 = sig.subarray(0, mid);
    const s2 = bytesToNumberLE(sig.subarray(mid, len));
    let A2, R2, SB;
    try {
      A2 = Point.fromBytes(publicKey, zip215);
      R2 = Point.fromBytes(r2, zip215);
      SB = BASE.multiplyUnsafe(s2);
    } catch (error) {
      return false;
    }
    if (!zip215 && A2.isSmallOrder())
      return false;
    const k2 = hashDomainToScalar(context, R2.toBytes(), A2.toBytes(), msg);
    const RkA = R2.add(A2.multiplyUnsafe(k2));
    return RkA.subtract(SB).clearCofactor().is0();
  }
  const _size = Fp4.BYTES;
  const lengths = {
    secretKey: _size,
    publicKey: _size,
    signature: 2 * _size,
    seed: _size
  };
  function randomSecretKey(seed = randomBytes2(lengths.seed)) {
    return _abytes2(seed, lengths.seed, "seed");
  }
  function keygen(seed) {
    const secretKey = utils.randomSecretKey(seed);
    return { secretKey, publicKey: getPublicKey(secretKey) };
  }
  function isValidSecretKey(key) {
    return isBytes(key) && key.length === Fn2.BYTES;
  }
  function isValidPublicKey(key, zip215) {
    try {
      return !!Point.fromBytes(key, zip215);
    } catch (error) {
      return false;
    }
  }
  const utils = {
    getExtendedPublicKey,
    randomSecretKey,
    isValidSecretKey,
    isValidPublicKey,
    /**
     * Converts ed public key to x public key. Uses formula:
     * - ed25519:
     *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
     *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
     * - ed448:
     *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
     *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
     */
    toMontgomery(publicKey) {
      const { y: y2 } = Point.fromBytes(publicKey);
      const size = lengths.publicKey;
      const is25519 = size === 32;
      if (!is25519 && size !== 57)
        throw new Error("only defined for 25519 and 448");
      const u = is25519 ? Fp4.div(_1n8 + y2, _1n8 - y2) : Fp4.div(y2 - _1n8, y2 + _1n8);
      return Fp4.toBytes(u);
    },
    toMontgomerySecret(secretKey) {
      const size = lengths.secretKey;
      _abytes2(secretKey, size);
      const hashed = cHash(secretKey.subarray(0, size));
      return adjustScalarBytes2(hashed).subarray(0, size);
    },
    /** @deprecated */
    randomPrivateKey: randomSecretKey,
    /** @deprecated */
    precompute(windowSize = 8, point = Point.BASE) {
      return point.precompute(windowSize, false);
    }
  };
  return Object.freeze({
    keygen,
    getPublicKey,
    sign,
    verify: verify2,
    utils,
    Point,
    lengths
  });
}
function _eddsa_legacy_opts_to_new(c2) {
  const CURVE = {
    a: c2.a,
    d: c2.d,
    p: c2.Fp.ORDER,
    n: c2.n,
    h: c2.h,
    Gx: c2.Gx,
    Gy: c2.Gy
  };
  const Fp4 = c2.Fp;
  const Fn2 = Field(CURVE.n, c2.nBitLength, true);
  const curveOpts = { Fp: Fp4, Fn: Fn2, uvRatio: c2.uvRatio };
  const eddsaOpts = {
    randomBytes: c2.randomBytes,
    adjustScalarBytes: c2.adjustScalarBytes,
    domain: c2.domain,
    prehash: c2.prehash,
    mapToCurve: c2.mapToCurve
  };
  return { CURVE, curveOpts, hash: c2.hash, eddsaOpts };
}
function _eddsa_new_output_to_legacy(c2, eddsa2) {
  const Point = eddsa2.Point;
  const legacy = Object.assign({}, eddsa2, {
    ExtendedPoint: Point,
    CURVE: c2,
    nBitLength: Point.Fn.BITS,
    nByteLength: Point.Fn.BYTES
  });
  return legacy;
}
function twistedEdwards(c2) {
  const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c2);
  const Point = edwards(CURVE, curveOpts);
  const EDDSA = eddsa(Point, hash, eddsaOpts);
  return _eddsa_new_output_to_legacy(c2, EDDSA);
}

// node_modules/@noble/curves/esm/abstract/montgomery.js
var import_dist76 = __toESM(require_dist(), 1);
var import_dist77 = __toESM(require_dist2(), 1);
var import_dist78 = __toESM(require_dist3(), 1);
var _0n9 = BigInt(0);
var _1n9 = BigInt(1);
var _2n7 = BigInt(2);
function validateOpts(curve) {
  _validateObject(curve, {
    adjustScalarBytes: "function",
    powPminus2: "function"
  });
  return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { P: P2, type, adjustScalarBytes: adjustScalarBytes2, powPminus2, randomBytes: rand } = CURVE;
  const is25519 = type === "x25519";
  if (!is25519 && type !== "x448")
    throw new Error("invalid type");
  const randomBytes_ = rand || randomBytes;
  const montgomeryBits = is25519 ? 255 : 448;
  const fieldLen = is25519 ? 32 : 56;
  const Gu = is25519 ? BigInt(9) : BigInt(5);
  const a24 = is25519 ? BigInt(121665) : BigInt(39081);
  const minScalar = is25519 ? _2n7 ** BigInt(254) : _2n7 ** BigInt(447);
  const maxAdded = is25519 ? BigInt(8) * _2n7 ** BigInt(251) - _1n9 : BigInt(4) * _2n7 ** BigInt(445) - _1n9;
  const maxScalar = minScalar + maxAdded + _1n9;
  const modP = (n) => mod(n, P2);
  const GuBytes = encodeU(Gu);
  function encodeU(u) {
    return numberToBytesLE(modP(u), fieldLen);
  }
  function decodeU(u) {
    const _u = ensureBytes("u coordinate", u, fieldLen);
    if (is25519)
      _u[31] &= 127;
    return modP(bytesToNumberLE(_u));
  }
  function decodeScalar(scalar) {
    return bytesToNumberLE(adjustScalarBytes2(ensureBytes("scalar", scalar, fieldLen)));
  }
  function scalarMult(scalar, u) {
    const pu = montgomeryLadder(decodeU(u), decodeScalar(scalar));
    if (pu === _0n9)
      throw new Error("invalid private or public key received");
    return encodeU(pu);
  }
  function scalarMultBase(scalar) {
    return scalarMult(scalar, GuBytes);
  }
  function cswap(swap, x_2, x_3) {
    const dummy = modP(swap * (x_2 - x_3));
    x_2 = modP(x_2 - dummy);
    x_3 = modP(x_3 + dummy);
    return { x_2, x_3 };
  }
  function montgomeryLadder(u, scalar) {
    aInRange("u", u, _0n9, P2);
    aInRange("scalar", scalar, minScalar, maxScalar);
    const k2 = scalar;
    const x_1 = u;
    let x_2 = _1n9;
    let z_2 = _0n9;
    let x_3 = u;
    let z_3 = _1n9;
    let swap = _0n9;
    for (let t = BigInt(montgomeryBits - 1); t >= _0n9; t--) {
      const k_t = k2 >> t & _1n9;
      swap ^= k_t;
      ({ x_2, x_3 } = cswap(swap, x_2, x_3));
      ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
      swap = k_t;
      const A2 = x_2 + z_2;
      const AA = modP(A2 * A2);
      const B2 = x_2 - z_2;
      const BB = modP(B2 * B2);
      const E2 = AA - BB;
      const C2 = x_3 + z_3;
      const D = x_3 - z_3;
      const DA = modP(D * A2);
      const CB = modP(C2 * B2);
      const dacb = DA + CB;
      const da_cb = DA - CB;
      x_3 = modP(dacb * dacb);
      z_3 = modP(x_1 * modP(da_cb * da_cb));
      x_2 = modP(AA * BB);
      z_2 = modP(E2 * (AA + modP(a24 * E2)));
    }
    ({ x_2, x_3 } = cswap(swap, x_2, x_3));
    ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
    const z2 = powPminus2(z_2);
    return modP(x_2 * z2);
  }
  const lengths = {
    secretKey: fieldLen,
    publicKey: fieldLen,
    seed: fieldLen
  };
  const randomSecretKey = (seed = randomBytes_(fieldLen)) => {
    abytes(seed, lengths.seed);
    return seed;
  };
  function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return { secretKey, publicKey: scalarMultBase(secretKey) };
  }
  const utils = {
    randomSecretKey,
    randomPrivateKey: randomSecretKey
  };
  return {
    keygen,
    getSharedSecret: (secretKey, publicKey) => scalarMult(secretKey, publicKey),
    getPublicKey: (secretKey) => scalarMultBase(secretKey),
    scalarMult,
    scalarMultBase,
    utils,
    GuBytes: GuBytes.slice(),
    lengths
  };
}

// node_modules/@noble/curves/esm/ed25519.js
var _0n10 = BigInt(0);
var _1n10 = BigInt(1);
var _2n8 = BigInt(2);
var _3n6 = BigInt(3);
var _5n2 = BigInt(5);
var _8n3 = BigInt(8);
var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = (() => ({
  p: ed25519_CURVE_p,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: _8n3,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x2) {
  const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
  const P2 = ed25519_CURVE_p;
  const x22 = x2 * x2 % P2;
  const b2 = x22 * x2 % P2;
  const b4 = pow2(b2, _2n8, P2) * b2 % P2;
  const b5 = pow2(b4, _1n10, P2) * x2 % P2;
  const b10 = pow2(b5, _5n2, P2) * b5 % P2;
  const b20 = pow2(b10, _10n, P2) * b10 % P2;
  const b40 = pow2(b20, _20n, P2) * b20 % P2;
  const b80 = pow2(b40, _40n, P2) * b40 % P2;
  const b160 = pow2(b80, _80n, P2) * b80 % P2;
  const b240 = pow2(b160, _80n, P2) * b80 % P2;
  const b250 = pow2(b240, _10n, P2) * b10 % P2;
  const pow_p_5_8 = pow2(b250, _2n8, P2) * x2 % P2;
  return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes) {
  bytes[0] &= 248;
  bytes[31] &= 127;
  bytes[31] |= 64;
  return bytes;
}
var ED25519_SQRT_M1 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v2) {
  const P2 = ed25519_CURVE_p;
  const v3 = mod(v2 * v2 * v2, P2);
  const v7 = mod(v3 * v3 * v2, P2);
  const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
  let x2 = mod(u * v3 * pow, P2);
  const vx2 = mod(v2 * x2 * x2, P2);
  const root1 = x2;
  const root2 = mod(x2 * ED25519_SQRT_M1, P2);
  const useRoot1 = vx2 === u;
  const useRoot2 = vx2 === mod(-u, P2);
  const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P2);
  if (useRoot1)
    x2 = root1;
  if (useRoot2 || noRoot)
    x2 = root2;
  if (isNegativeLE(x2, P2))
    x2 = mod(-x2, P2);
  return { isValid: useRoot1 || useRoot2, value: x2 };
}
var Fp3 = (() => Field(ed25519_CURVE.p, { isLE: true }))();
var Fn = (() => Field(ed25519_CURVE.n, { isLE: true }))();
var ed25519Defaults = (() => ({
  ...ed25519_CURVE,
  Fp: Fp3,
  hash: sha512,
  adjustScalarBytes,
  // dom2
  // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
  // Constant-time, u/√v
  uvRatio
}))();
var ed25519 = (() => twistedEdwards(ed25519Defaults))();
function ed25519_domain(data, ctx, phflag) {
  if (ctx.length > 255)
    throw new Error("Context is too big");
  return concatBytes(utf8ToBytes("SigEd25519 no Ed25519 collisions"), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
}
var ed25519ctx = (() => twistedEdwards({
  ...ed25519Defaults,
  domain: ed25519_domain
}))();
var ed25519ph = (() => twistedEdwards(Object.assign({}, ed25519Defaults, {
  domain: ed25519_domain,
  prehash: sha512
})))();
var x25519 = (() => {
  const P2 = Fp3.ORDER;
  return montgomery({
    P: P2,
    type: "x25519",
    powPminus2: (x2) => {
      const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x2);
      return mod(pow2(pow_p_5_8, _3n6, P2) * b2, P2);
    },
    adjustScalarBytes
  });
})();
var ELL2_C1 = (() => (ed25519_CURVE_p + _3n6) / _8n3)();
var ELL2_C2 = (() => Fp3.pow(_2n8, ELL2_C1))();
var ELL2_C3 = (() => Fp3.sqrt(Fp3.neg(Fp3.ONE)))();
function map_to_curve_elligator2_curve25519(u) {
  const ELL2_C4 = (ed25519_CURVE_p - _5n2) / _8n3;
  const ELL2_J = BigInt(486662);
  let tv1 = Fp3.sqr(u);
  tv1 = Fp3.mul(tv1, _2n8);
  let xd = Fp3.add(tv1, Fp3.ONE);
  let x1n = Fp3.neg(ELL2_J);
  let tv2 = Fp3.sqr(xd);
  let gxd = Fp3.mul(tv2, xd);
  let gx1 = Fp3.mul(tv1, ELL2_J);
  gx1 = Fp3.mul(gx1, x1n);
  gx1 = Fp3.add(gx1, tv2);
  gx1 = Fp3.mul(gx1, x1n);
  let tv3 = Fp3.sqr(gxd);
  tv2 = Fp3.sqr(tv3);
  tv3 = Fp3.mul(tv3, gxd);
  tv3 = Fp3.mul(tv3, gx1);
  tv2 = Fp3.mul(tv2, tv3);
  let y11 = Fp3.pow(tv2, ELL2_C4);
  y11 = Fp3.mul(y11, tv3);
  let y12 = Fp3.mul(y11, ELL2_C3);
  tv2 = Fp3.sqr(y11);
  tv2 = Fp3.mul(tv2, gxd);
  let e1 = Fp3.eql(tv2, gx1);
  let y1 = Fp3.cmov(y12, y11, e1);
  let x2n = Fp3.mul(x1n, tv1);
  let y21 = Fp3.mul(y11, u);
  y21 = Fp3.mul(y21, ELL2_C2);
  let y22 = Fp3.mul(y21, ELL2_C3);
  let gx2 = Fp3.mul(gx1, tv1);
  tv2 = Fp3.sqr(y21);
  tv2 = Fp3.mul(tv2, gxd);
  let e2 = Fp3.eql(tv2, gx2);
  let y2 = Fp3.cmov(y22, y21, e2);
  tv2 = Fp3.sqr(y1);
  tv2 = Fp3.mul(tv2, gxd);
  let e3 = Fp3.eql(tv2, gx1);
  let xn = Fp3.cmov(x2n, x1n, e3);
  let y3 = Fp3.cmov(y2, y1, e3);
  let e4 = Fp3.isOdd(y3);
  y3 = Fp3.cmov(y3, Fp3.neg(y3), e3 !== e4);
  return { xMn: xn, xMd: xd, yMn: y3, yMd: _1n10 };
}
var ELL2_C1_EDWARDS = (() => FpSqrtEven(Fp3, Fp3.neg(BigInt(486664))))();
function map_to_curve_elligator2_edwards25519(u) {
  const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u);
  let xn = Fp3.mul(xMn, yMd);
  xn = Fp3.mul(xn, ELL2_C1_EDWARDS);
  let xd = Fp3.mul(xMd, yMn);
  let yn = Fp3.sub(xMn, xMd);
  let yd = Fp3.add(xMn, xMd);
  let tv1 = Fp3.mul(xd, yd);
  let e = Fp3.eql(tv1, Fp3.ZERO);
  xn = Fp3.cmov(xn, Fp3.ZERO, e);
  xd = Fp3.cmov(xd, Fp3.ONE, e);
  yn = Fp3.cmov(yn, Fp3.ONE, e);
  yd = Fp3.cmov(yd, Fp3.ONE, e);
  const [xd_inv, yd_inv] = FpInvertBatch(Fp3, [xd, yd], true);
  return { x: Fp3.mul(xn, xd_inv), y: Fp3.mul(yn, yd_inv) };
}
var ed25519_hasher = (() => createHasher(ed25519.Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
  DST: "edwards25519_XMD:SHA-512_ELL2_RO_",
  encodeDST: "edwards25519_XMD:SHA-512_ELL2_NU_",
  p: ed25519_CURVE_p,
  m: 1,
  k: 128,
  expand: "xmd",
  hash: sha512
}))();
var SQRT_M1 = ED25519_SQRT_M1;
var SQRT_AD_MINUS_ONE = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var invertSqrt = (number) => uvRatio(_1n10, number);
var MAX_255B = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var bytes255ToNumberLE = (bytes) => ed25519.Point.Fp.create(bytesToNumberLE(bytes) & MAX_255B);
function calcElligatorRistrettoMap(r0) {
  const { d: d2 } = ed25519_CURVE;
  const P2 = ed25519_CURVE_p;
  const mod2 = (n) => Fp3.create(n);
  const r2 = mod2(SQRT_M1 * r0 * r0);
  const Ns = mod2((r2 + _1n10) * ONE_MINUS_D_SQ);
  let c2 = BigInt(-1);
  const D = mod2((c2 - d2 * r2) * mod2(r2 + d2));
  let { isValid: Ns_D_is_sq, value: s2 } = uvRatio(Ns, D);
  let s_ = mod2(s2 * r0);
  if (!isNegativeLE(s_, P2))
    s_ = mod2(-s_);
  if (!Ns_D_is_sq)
    s2 = s_;
  if (!Ns_D_is_sq)
    c2 = r2;
  const Nt = mod2(c2 * (r2 - _1n10) * D_MINUS_ONE_SQ - D);
  const s22 = s2 * s2;
  const W0 = mod2((s2 + s2) * D);
  const W1 = mod2(Nt * SQRT_AD_MINUS_ONE);
  const W2 = mod2(_1n10 - s22);
  const W3 = mod2(_1n10 + s22);
  return new ed25519.Point(mod2(W0 * W3), mod2(W2 * W1), mod2(W1 * W3), mod2(W0 * W2));
}
function ristretto255_map(bytes) {
  abytes(bytes, 64);
  const r1 = bytes255ToNumberLE(bytes.subarray(0, 32));
  const R1 = calcElligatorRistrettoMap(r1);
  const r2 = bytes255ToNumberLE(bytes.subarray(32, 64));
  const R2 = calcElligatorRistrettoMap(r2);
  return new _RistrettoPoint(R1.add(R2));
}
var _RistrettoPoint = class __RistrettoPoint extends PrimeEdwardsPoint {
  constructor(ep) {
    super(ep);
  }
  static fromAffine(ap) {
    return new __RistrettoPoint(ed25519.Point.fromAffine(ap));
  }
  assertSame(other) {
    if (!(other instanceof __RistrettoPoint))
      throw new Error("RistrettoPoint expected");
  }
  init(ep) {
    return new __RistrettoPoint(ep);
  }
  /** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
  static hashToCurve(hex) {
    return ristretto255_map(ensureBytes("ristrettoHash", hex, 64));
  }
  static fromBytes(bytes) {
    abytes(bytes, 32);
    const { a: a2, d: d2 } = ed25519_CURVE;
    const P2 = ed25519_CURVE_p;
    const mod2 = (n) => Fp3.create(n);
    const s2 = bytes255ToNumberLE(bytes);
    if (!equalBytes(Fp3.toBytes(s2), bytes) || isNegativeLE(s2, P2))
      throw new Error("invalid ristretto255 encoding 1");
    const s22 = mod2(s2 * s2);
    const u1 = mod2(_1n10 + a2 * s22);
    const u2 = mod2(_1n10 - a2 * s22);
    const u1_2 = mod2(u1 * u1);
    const u2_2 = mod2(u2 * u2);
    const v2 = mod2(a2 * d2 * u1_2 - u2_2);
    const { isValid, value: I2 } = invertSqrt(mod2(v2 * u2_2));
    const Dx = mod2(I2 * u2);
    const Dy = mod2(I2 * Dx * v2);
    let x2 = mod2((s2 + s2) * Dx);
    if (isNegativeLE(x2, P2))
      x2 = mod2(-x2);
    const y2 = mod2(u1 * Dy);
    const t = mod2(x2 * y2);
    if (!isValid || isNegativeLE(t, P2) || y2 === _0n10)
      throw new Error("invalid ristretto255 encoding 2");
    return new __RistrettoPoint(new ed25519.Point(x2, y2, _1n10, t));
  }
  /**
   * Converts ristretto-encoded string to ristretto point.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
   * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
   */
  static fromHex(hex) {
    return __RistrettoPoint.fromBytes(ensureBytes("ristrettoHex", hex, 32));
  }
  static msm(points, scalars) {
    return pippenger(__RistrettoPoint, ed25519.Point.Fn, points, scalars);
  }
  /**
   * Encodes ristretto point to Uint8Array.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
   */
  toBytes() {
    let { X: X2, Y: Y2, Z: Z2, T: T2 } = this.ep;
    const P2 = ed25519_CURVE_p;
    const mod2 = (n) => Fp3.create(n);
    const u1 = mod2(mod2(Z2 + Y2) * mod2(Z2 - Y2));
    const u2 = mod2(X2 * Y2);
    const u2sq = mod2(u2 * u2);
    const { value: invsqrt } = invertSqrt(mod2(u1 * u2sq));
    const D1 = mod2(invsqrt * u1);
    const D2 = mod2(invsqrt * u2);
    const zInv = mod2(D1 * D2 * T2);
    let D;
    if (isNegativeLE(T2 * zInv, P2)) {
      let _x = mod2(Y2 * SQRT_M1);
      let _y = mod2(X2 * SQRT_M1);
      X2 = _x;
      Y2 = _y;
      D = mod2(D1 * INVSQRT_A_MINUS_D);
    } else {
      D = D2;
    }
    if (isNegativeLE(X2 * zInv, P2))
      Y2 = mod2(-Y2);
    let s2 = mod2((Z2 - Y2) * D);
    if (isNegativeLE(s2, P2))
      s2 = mod2(-s2);
    return Fp3.toBytes(s2);
  }
  /**
   * Compares two Ristretto points.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
   */
  equals(other) {
    this.assertSame(other);
    const { X: X1, Y: Y1 } = this.ep;
    const { X: X2, Y: Y2 } = other.ep;
    const mod2 = (n) => Fp3.create(n);
    const one = mod2(X1 * Y2) === mod2(Y1 * X2);
    const two = mod2(Y1 * Y2) === mod2(X1 * X2);
    return one || two;
  }
  is0() {
    return this.equals(__RistrettoPoint.ZERO);
  }
};
_RistrettoPoint.BASE = (() => new _RistrettoPoint(ed25519.Point.BASE))();
_RistrettoPoint.ZERO = (() => new _RistrettoPoint(ed25519.Point.ZERO))();
_RistrettoPoint.Fp = (() => Fp3)();
_RistrettoPoint.Fn = (() => Fn)();
var ristretto255_hasher = {
  hashToCurve(msg, options) {
    const DST = (options == null ? void 0 : options.DST) || "ristretto255_XMD:SHA-512_R255MAP_RO_";
    const xmd = expand_message_xmd(msg, DST, 64, sha512);
    return ristretto255_map(xmd);
  },
  hashToScalar(msg, options = { DST: _DST_scalar }) {
    const xmd = expand_message_xmd(msg, options.DST, 64, sha512);
    return Fn.create(bytesToNumberLE(xmd));
  }
};
var hashToCurve = (() => ed25519_hasher.hashToCurve)();
var encodeToCurve = (() => ed25519_hasher.encodeToCurve)();
var hashToRistretto255 = (() => ristretto255_hasher.hashToCurve)();
var hash_to_ristretto255 = (() => ristretto255_hasher.hashToCurve)();

// node_modules/@dfinity/agent/lib/esm/utils/expirableMap.js
var import_dist82 = __toESM(require_dist(), 1);
var import_dist83 = __toESM(require_dist2(), 1);
var import_dist84 = __toESM(require_dist3(), 1);
var _a;
var _b;
var _inner, _expirationTime;
var ExpirableMap = class {
  /**
   * Create a new ExpirableMap.
   * @param {ExpirableMapOptions<any, any>} options - options for the map.
   * @param {Iterable<[any, any]>} options.source - an optional source of entries to initialize the map with.
   * @param {number} options.expirationTime - the time in milliseconds after which entries will expire.
   */
  constructor(options = {}) {
    // Internals
    __privateAdd(this, _inner, void 0);
    __privateAdd(this, _expirationTime, void 0);
    this[_a] = this.entries.bind(this);
    this[_b] = "ExpirableMap";
    const { source = [], expirationTime = 10 * 60 * 1e3 } = options;
    const currentTime = Date.now();
    __privateSet(this, _inner, new Map([...source].map(([key, value]) => [key, { value, timestamp: currentTime }])));
    __privateSet(this, _expirationTime, expirationTime);
  }
  /**
   * Prune removes all expired entries.
   */
  prune() {
    const currentTime = Date.now();
    for (const [key, entry] of __privateGet(this, _inner).entries()) {
      if (currentTime - entry.timestamp > __privateGet(this, _expirationTime)) {
        __privateGet(this, _inner).delete(key);
      }
    }
    return this;
  }
  // Implementing the Map interface
  /**
   * Set the value for the given key. Prunes expired entries.
   * @param key for the entry
   * @param value of the entry
   * @returns this
   */
  set(key, value) {
    this.prune();
    const entry = {
      value,
      timestamp: Date.now()
    };
    __privateGet(this, _inner).set(key, entry);
    return this;
  }
  /**
   * Get the value associated with the key, if it exists and has not expired.
   * @param key K
   * @returns the value associated with the key, or undefined if the key is not present or has expired.
   */
  get(key) {
    const entry = __privateGet(this, _inner).get(key);
    if (entry === void 0) {
      return void 0;
    }
    if (Date.now() - entry.timestamp > __privateGet(this, _expirationTime)) {
      __privateGet(this, _inner).delete(key);
      return void 0;
    }
    return entry.value;
  }
  /**
   * Clear all entries.
   */
  clear() {
    __privateGet(this, _inner).clear();
  }
  /**
   * Entries returns the entries of the map, without the expiration time.
   * @returns an iterator over the entries of the map.
   */
  entries() {
    const iterator = __privateGet(this, _inner).entries();
    const generator = function* () {
      for (const [key, value] of iterator) {
        yield [key, value.value];
      }
      return void 0;
    };
    return generator();
  }
  /**
   * Values returns the values of the map, without the expiration time.
   * @returns an iterator over the values of the map.
   */
  values() {
    const iterator = __privateGet(this, _inner).values();
    const generator = function* () {
      for (const value of iterator) {
        yield value.value;
      }
      return void 0;
    };
    return generator();
  }
  /**
   * Keys returns the keys of the map
   * @returns an iterator over the keys of the map.
   */
  keys() {
    return __privateGet(this, _inner).keys();
  }
  /**
   * forEach calls the callbackfn on each entry of the map.
   * @param callbackfn to call on each entry
   * @param thisArg to use as this when calling the callbackfn
   */
  forEach(callbackfn, thisArg) {
    for (const [key, value] of __privateGet(this, _inner).entries()) {
      callbackfn.call(thisArg, value.value, key, this);
    }
  }
  /**
   * has returns true if the key exists and has not expired.
   * @param key K
   * @returns true if the key exists and has not expired.
   */
  has(key) {
    return __privateGet(this, _inner).has(key);
  }
  /**
   * delete the entry for the given key.
   * @param key K
   * @returns true if the key existed and has been deleted.
   */
  delete(key) {
    return __privateGet(this, _inner).delete(key);
  }
  /**
   * get size of the map.
   * @returns the size of the map.
   */
  get size() {
    return __privateGet(this, _inner).size;
  }
};
_inner = new WeakMap();
_expirationTime = new WeakMap();
_a = Symbol.iterator, _b = Symbol.toStringTag;

// node_modules/@dfinity/agent/lib/esm/public_key.js
var import_dist88 = __toESM(require_dist(), 1);
var import_dist89 = __toESM(require_dist2(), 1);
var import_dist90 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/der.js
var import_dist85 = __toESM(require_dist(), 1);
var import_dist86 = __toESM(require_dist2(), 1);
var import_dist87 = __toESM(require_dist3(), 1);
var encodeLenBytes = (len) => {
  if (len <= 127) {
    return 1;
  } else if (len <= 255) {
    return 2;
  } else if (len <= 65535) {
    return 3;
  } else if (len <= 16777215) {
    return 4;
  } else {
    throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
  }
};
var encodeLen = (buf, offset, len) => {
  if (len <= 127) {
    buf[offset] = len;
    return 1;
  } else if (len <= 255) {
    buf[offset] = 129;
    buf[offset + 1] = len;
    return 2;
  } else if (len <= 65535) {
    buf[offset] = 130;
    buf[offset + 1] = len >> 8;
    buf[offset + 2] = len;
    return 3;
  } else if (len <= 16777215) {
    buf[offset] = 131;
    buf[offset + 1] = len >> 16;
    buf[offset + 2] = len >> 8;
    buf[offset + 3] = len;
    return 4;
  } else {
    throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
  }
};
var decodeLenBytes = (buf, offset) => {
  if (buf[offset] < 128)
    return 1;
  if (buf[offset] === 128)
    throw InputError.fromCode(new DerDecodeErrorCode("Invalid length 0"));
  if (buf[offset] === 129)
    return 2;
  if (buf[offset] === 130)
    return 3;
  if (buf[offset] === 131)
    return 4;
  throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLen = (buf, offset) => {
  const lenBytes = decodeLenBytes(buf, offset);
  if (lenBytes === 1)
    return buf[offset];
  else if (lenBytes === 2)
    return buf[offset + 1];
  else if (lenBytes === 3)
    return (buf[offset + 1] << 8) + buf[offset + 2];
  else if (lenBytes === 4)
    return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
  throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
var DER_COSE_OID = Uint8Array.from([
  ...[48, 12],
  // SEQUENCE
  ...[6, 10],
  // OID with 10 bytes
  ...[43, 6, 1, 4, 1, 131, 184, 67, 1, 1]
  // DER encoded COSE
]);
var ED25519_OID = Uint8Array.from([
  ...[48, 5],
  // SEQUENCE
  ...[6, 3],
  // OID with 3 bytes
  ...[43, 101, 112]
  // id-Ed25519 OID
]);
var SECP256K1_OID = Uint8Array.from([
  ...[48, 16],
  // SEQUENCE
  ...[6, 7],
  // OID with 7 bytes
  ...[42, 134, 72, 206, 61, 2, 1],
  // OID ECDSA
  ...[6, 5],
  // OID with 5 bytes
  ...[43, 129, 4, 0, 10]
  // OID secp256k1
]);
var BLS12_381_G2_OID = Uint8Array.from([
  ...[48, 29],
  // SEQUENCE, length 29 bytes
  // Algorithm OID
  ...[6, 13],
  ...[43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 1, 2, 1],
  // Curve OID
  ...[6, 12],
  ...[43, 6, 1, 4, 1, 130, 220, 124, 5, 3, 2, 1]
]);
function wrapDER(payload, oid) {
  const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
  const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
  let offset = 0;
  const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
  buf[offset++] = 48;
  offset += encodeLen(buf, offset, len);
  buf.set(oid, offset);
  offset += oid.byteLength;
  buf[offset++] = 3;
  offset += encodeLen(buf, offset, payload.byteLength + 1);
  buf[offset++] = 0;
  buf.set(new Uint8Array(payload), offset);
  return buf;
}
var unwrapDER = (derEncoded, oid) => {
  let offset = 0;
  const expect = (n, msg) => {
    if (buf[offset++] !== n) {
      throw InputError.fromCode(new DerDecodeErrorCode(`Expected ${msg} at offset ${offset}`));
    }
  };
  const buf = new Uint8Array(derEncoded);
  expect(48, "sequence");
  offset += decodeLenBytes(buf, offset);
  if (!uint8Equals(buf.slice(offset, offset + oid.byteLength), oid)) {
    throw InputError.fromCode(new DerDecodeErrorCode("Not the expected OID."));
  }
  offset += oid.byteLength;
  expect(3, "bit string");
  const payloadLen = decodeLen(buf, offset) - 1;
  offset += decodeLenBytes(buf, offset);
  expect(0, "0 padding");
  const result = buf.slice(offset);
  if (payloadLen !== result.length) {
    throw InputError.fromCode(new DerDecodeLengthMismatchErrorCode(payloadLen, result.length));
  }
  return result;
};

// node_modules/@dfinity/agent/lib/esm/public_key.js
var _rawKey, _derKey;
var _Ed25519PublicKey = class _Ed25519PublicKey {
  // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
  constructor(key) {
    __privateAdd(this, _rawKey, void 0);
    __privateAdd(this, _derKey, void 0);
    if (key.byteLength !== _Ed25519PublicKey.RAW_KEY_LENGTH) {
      throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
    }
    __privateSet(this, _rawKey, key);
    __privateSet(this, _derKey, _Ed25519PublicKey.derEncode(key));
  }
  static from(key) {
    return this.fromDer(key.toDer());
  }
  static fromRaw(rawKey) {
    return new _Ed25519PublicKey(rawKey);
  }
  static fromDer(derKey) {
    return new _Ed25519PublicKey(this.derDecode(derKey));
  }
  static derEncode(publicKey) {
    return wrapDER(publicKey, ED25519_OID);
  }
  static derDecode(key) {
    const unwrapped = unwrapDER(key, ED25519_OID);
    if (unwrapped.length !== this.RAW_KEY_LENGTH) {
      throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
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

// node_modules/@dfinity/agent/lib/esm/observable.js
var import_dist91 = __toESM(require_dist(), 1);
var import_dist92 = __toESM(require_dist2(), 1);
var import_dist93 = __toESM(require_dist3(), 1);
var Observable = class {
  constructor() {
    this.observers = [];
  }
  subscribe(func) {
    this.observers.push(func);
  }
  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }
  notify(data, ...rest) {
    this.observers.forEach((observer) => observer(data, ...rest));
  }
};
var ObservableLog = class extends Observable {
  constructor() {
    super();
  }
  print(message, ...rest) {
    this.notify({ message, level: "info" }, ...rest);
  }
  warn(message, ...rest) {
    this.notify({ message, level: "warn" }, ...rest);
  }
  error(message, error, ...rest) {
    this.notify({ message, level: "error", error }, ...rest);
  }
};

// node_modules/@dfinity/agent/lib/esm/polling/backoff.js
var import_dist94 = __toESM(require_dist(), 1);
var import_dist95 = __toESM(require_dist2(), 1);
var import_dist96 = __toESM(require_dist3(), 1);
var RANDOMIZATION_FACTOR = 0.5;
var MULTIPLIER = 1.5;
var INITIAL_INTERVAL_MSEC = 500;
var MAX_INTERVAL_MSEC = 6e4;
var MAX_ELAPSED_TIME_MSEC = 9e5;
var MAX_ITERATIONS = 10;
var _currentInterval, _randomizationFactor, _multiplier, _maxInterval, _startTime, _maxElapsedTime, _maxIterations, _date, _count;
var _ExponentialBackoff = class _ExponentialBackoff {
  constructor(options = _ExponentialBackoff.default) {
    __privateAdd(this, _currentInterval, void 0);
    __privateAdd(this, _randomizationFactor, void 0);
    __privateAdd(this, _multiplier, void 0);
    __privateAdd(this, _maxInterval, void 0);
    __privateAdd(this, _startTime, void 0);
    __privateAdd(this, _maxElapsedTime, void 0);
    __privateAdd(this, _maxIterations, void 0);
    __privateAdd(this, _date, void 0);
    __privateAdd(this, _count, 0);
    const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date } = options;
    __privateSet(this, _currentInterval, initialInterval);
    __privateSet(this, _randomizationFactor, randomizationFactor);
    __privateSet(this, _multiplier, multiplier);
    __privateSet(this, _maxInterval, maxInterval);
    __privateSet(this, _date, date);
    __privateSet(this, _startTime, date.now());
    __privateSet(this, _maxElapsedTime, maxElapsedTime);
    __privateSet(this, _maxIterations, maxIterations);
  }
  get ellapsedTimeInMsec() {
    return __privateGet(this, _date).now() - __privateGet(this, _startTime);
  }
  get currentInterval() {
    return __privateGet(this, _currentInterval);
  }
  get count() {
    return __privateGet(this, _count);
  }
  get randomValueFromInterval() {
    const delta = __privateGet(this, _randomizationFactor) * __privateGet(this, _currentInterval);
    const min = __privateGet(this, _currentInterval) - delta;
    const max = __privateGet(this, _currentInterval) + delta;
    return Math.random() * (max - min) + min;
  }
  incrementCurrentInterval() {
    __privateSet(this, _currentInterval, Math.min(__privateGet(this, _currentInterval) * __privateGet(this, _multiplier), __privateGet(this, _maxInterval)));
    __privateWrapper(this, _count)._++;
    return __privateGet(this, _currentInterval);
  }
  next() {
    if (this.ellapsedTimeInMsec >= __privateGet(this, _maxElapsedTime) || __privateGet(this, _count) >= __privateGet(this, _maxIterations)) {
      return null;
    } else {
      this.incrementCurrentInterval();
      return this.randomValueFromInterval;
    }
  }
};
_currentInterval = new WeakMap();
_randomizationFactor = new WeakMap();
_multiplier = new WeakMap();
_maxInterval = new WeakMap();
_startTime = new WeakMap();
_maxElapsedTime = new WeakMap();
_maxIterations = new WeakMap();
_date = new WeakMap();
_count = new WeakMap();
_ExponentialBackoff.default = {
  initialInterval: INITIAL_INTERVAL_MSEC,
  randomizationFactor: RANDOMIZATION_FACTOR,
  multiplier: MULTIPLIER,
  maxInterval: MAX_INTERVAL_MSEC,
  // 1 minute
  maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
  maxIterations: MAX_ITERATIONS,
  date: Date
};
var ExponentialBackoff = _ExponentialBackoff;

// node_modules/@dfinity/agent/lib/esm/agent/http/index.js
var RequestStatusResponseStatus;
(function(RequestStatusResponseStatus2) {
  RequestStatusResponseStatus2["Received"] = "received";
  RequestStatusResponseStatus2["Processing"] = "processing";
  RequestStatusResponseStatus2["Replied"] = "replied";
  RequestStatusResponseStatus2["Rejected"] = "rejected";
  RequestStatusResponseStatus2["Unknown"] = "unknown";
  RequestStatusResponseStatus2["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
var MINUTE_TO_MSECS = 60 * 1e3;
var MSECS_TO_NANOSECONDS = 1e6;
var DEFAULT_TIME_DIFF_MSECS = 0;
var IC_ROOT_KEY = "308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d9685f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484b01291091c5f87b98883463f98091a0baaae";
var MANAGEMENT_CANISTER_ID = "aaaaa-aa";
var IC0_DOMAIN = "ic0.app";
var IC0_SUB_DOMAIN = ".ic0.app";
var ICP0_DOMAIN = "icp0.io";
var ICP0_SUB_DOMAIN = ".icp0.io";
var ICP_API_DOMAIN = "icp-api.io";
var ICP_API_SUB_DOMAIN = ".icp-api.io";
var HTTP_STATUS_OK = 200;
var HTTP_STATUS_ACCEPTED = 202;
var HTTP_STATUS_NOT_FOUND = 404;
function getDefaultFetch() {
  let defaultFetch;
  if (typeof window !== "undefined") {
    if (window.fetch) {
      defaultFetch = window.fetch.bind(window);
    } else {
      throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present."));
    }
  } else if (typeof global !== "undefined") {
    if (global.fetch) {
      defaultFetch = global.fetch.bind(global);
    } else {
      throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available."));
    }
  } else if (typeof self !== "undefined") {
    if (self.fetch) {
      defaultFetch = self.fetch.bind(self);
    }
  }
  if (defaultFetch) {
    return defaultFetch;
  }
  throw ExternalError.fromCode(new HttpDefaultFetchErrorCode("Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context."));
}
function determineHost(configuredHost) {
  let host;
  if (configuredHost !== void 0) {
    if (!configuredHost.match(/^[a-z]+:/) && typeof window !== "undefined") {
      host = new URL(window.location.protocol + "//" + configuredHost);
    } else {
      host = new URL(configuredHost);
    }
  } else {
    const knownHosts = ["ic0.app", "icp0.io", "127.0.0.1", "localhost"];
    const remoteHosts = [".github.dev", ".gitpod.io"];
    const location = typeof window !== "undefined" ? window.location : void 0;
    const hostname = location == null ? void 0 : location.hostname;
    let knownHost;
    if (hostname && typeof hostname === "string") {
      if (remoteHosts.some((host2) => hostname.endsWith(host2))) {
        knownHost = hostname;
      } else {
        knownHost = knownHosts.find((host2) => hostname.endsWith(host2));
      }
    }
    if (location && knownHost) {
      host = new URL(`${location.protocol}//${knownHost}${location.port ? ":" + location.port : ""}`);
    } else {
      host = new URL("https://icp-api.io");
    }
  }
  return host.toString();
}
var _rootKeyPromise, _shouldFetchRootKey, _timeDiffMsecs, _hasSyncedTime, _syncTimePromise, _shouldSyncTime, _identity, _fetch, _fetchOptions, _callOptions, _credentials, _retryTimes, _backoffStrategy, _maxIngressExpiryInMinutes, _maxIngressExpiryInMs, maxIngressExpiryInMs_get, _queryPipeline, _updatePipeline, _subnetKeys, _verifyQuerySignatures, _requestAndRetryQuery, requestAndRetryQuery_fn, _requestAndRetry, requestAndRetry_fn, _verifyQueryResponse, _asyncGuard, asyncGuard_fn, _rootKeyGuard, rootKeyGuard_fn, _syncTimeGuard, syncTimeGuard_fn;
var _HttpAgent = class _HttpAgent {
  /**
   * @param options - Options for the HttpAgent
   * @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
   */
  constructor(options = {}) {
    __privateAdd(this, _maxIngressExpiryInMs);
    __privateAdd(this, _requestAndRetryQuery);
    /**
     * Makes a request and retries if it fails.
     * @param args - The arguments for the request.
     * @param args.requestFn - A function that returns a Promise resolving to a Response.
     * @param args.backoff - The backoff strategy to use for retries.
     * @param args.tries - The number of retry attempts made so far.
     * @returns The response from the request, if the status is 200 or 202.
     * See the https://internetcomputer.org/docs/references/ic-interface-spec#http-interface for details on the response statuses.
     * @throws {ProtocolError} if the response status is not 200 or 202, and the retry limit has been reached.
     * @throws {TransportError} if the request fails, and the retry limit has been reached.
     */
    __privateAdd(this, _requestAndRetry);
    __privateAdd(this, _asyncGuard);
    __privateAdd(this, _rootKeyGuard);
    __privateAdd(this, _syncTimeGuard);
    __privateAdd(this, _rootKeyPromise, void 0);
    __privateAdd(this, _shouldFetchRootKey, void 0);
    __privateAdd(this, _timeDiffMsecs, void 0);
    __privateAdd(this, _hasSyncedTime, void 0);
    __privateAdd(this, _syncTimePromise, void 0);
    __privateAdd(this, _shouldSyncTime, void 0);
    __privateAdd(this, _identity, void 0);
    __privateAdd(this, _fetch, void 0);
    __privateAdd(this, _fetchOptions, void 0);
    __privateAdd(this, _callOptions, void 0);
    __privateAdd(this, _credentials, void 0);
    __privateAdd(this, _retryTimes, void 0);
    // Retry requests N times before erroring by default
    __privateAdd(this, _backoffStrategy, void 0);
    __privateAdd(this, _maxIngressExpiryInMinutes, void 0);
    __privateAdd(this, _queryPipeline, void 0);
    __privateAdd(this, _updatePipeline, void 0);
    __privateAdd(this, _subnetKeys, void 0);
    __privateAdd(this, _verifyQuerySignatures, void 0);
    /**
     * See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
     * @param queryResponse - The response from the query
     * @param subnetStatus - The subnet status, including all node keys
     * @returns ApiQueryResponse
     */
    __privateAdd(this, _verifyQueryResponse, void 0);
    __privateSet(this, _rootKeyPromise, null);
    __privateSet(this, _shouldFetchRootKey, false);
    __privateSet(this, _timeDiffMsecs, DEFAULT_TIME_DIFF_MSECS);
    __privateSet(this, _hasSyncedTime, false);
    __privateSet(this, _syncTimePromise, null);
    __privateSet(this, _shouldSyncTime, false);
    this._isAgent = true;
    this.config = {};
    this.log = new ObservableLog();
    __privateSet(this, _queryPipeline, []);
    __privateSet(this, _updatePipeline, []);
    __privateSet(this, _subnetKeys, new ExpirableMap({
      expirationTime: 5 * MINUTE_TO_MSECS
    }));
    __privateSet(this, _verifyQuerySignatures, true);
    __privateSet(this, _verifyQueryResponse, (queryResponse, subnetStatus) => {
      if (__privateGet(this, _verifyQuerySignatures) === false) {
        return queryResponse;
      }
      const { status, signatures = [], requestId } = queryResponse;
      for (const sig of signatures) {
        const { timestamp, identity } = sig;
        const nodeId = Principal.fromUint8Array(identity).toText();
        let hash;
        if (status === QueryResponseStatus.Replied) {
          const { reply } = queryResponse;
          hash = hashOfMap({
            status,
            reply,
            timestamp: BigInt(timestamp),
            request_id: requestId
          });
        } else if (status === QueryResponseStatus.Rejected) {
          const { reject_code, reject_message, error_code } = queryResponse;
          hash = hashOfMap({
            status,
            reject_code,
            reject_message,
            error_code,
            timestamp: BigInt(timestamp),
            request_id: requestId
          });
        } else {
          throw UnknownError.fromCode(new UnexpectedErrorCode(`Unknown status: ${status}`));
        }
        const separatorWithHash = concatBytes(IC_RESPONSE_DOMAIN_SEPARATOR, hash);
        const pubKey = subnetStatus.nodeKeys.get(nodeId);
        if (!pubKey) {
          throw ProtocolError.fromCode(new MalformedPublicKeyErrorCode());
        }
        const rawKey = Ed25519PublicKey.fromDer(pubKey).rawKey;
        const valid = ed25519.verify(sig.signature, separatorWithHash, rawKey);
        if (valid)
          return queryResponse;
        throw TrustError.fromCode(new QuerySignatureVerificationFailedErrorCode(nodeId));
      }
      return queryResponse;
    });
    this.config = options;
    __privateSet(this, _fetch, options.fetch || getDefaultFetch() || fetch.bind(global));
    __privateSet(this, _fetchOptions, options.fetchOptions);
    __privateSet(this, _callOptions, options.callOptions);
    __privateSet(this, _shouldFetchRootKey, options.shouldFetchRootKey ?? false);
    __privateSet(this, _shouldSyncTime, options.shouldSyncTime ?? false);
    if (options.rootKey) {
      this.rootKey = options.rootKey;
    } else if (__privateGet(this, _shouldFetchRootKey)) {
      this.rootKey = null;
    } else {
      this.rootKey = hexToBytes(IC_ROOT_KEY);
    }
    const host = determineHost(options.host);
    this.host = new URL(host);
    if (options.verifyQuerySignatures !== void 0) {
      __privateSet(this, _verifyQuerySignatures, options.verifyQuerySignatures);
    }
    __privateSet(this, _retryTimes, options.retryTimes ?? 3);
    const defaultBackoffFactory = () => new ExponentialBackoff({
      maxIterations: __privateGet(this, _retryTimes)
    });
    __privateSet(this, _backoffStrategy, options.backoffStrategy || defaultBackoffFactory);
    if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) {
      this.host.hostname = IC0_DOMAIN;
    } else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) {
      this.host.hostname = ICP0_DOMAIN;
    } else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) {
      this.host.hostname = ICP_API_DOMAIN;
    }
    if (options.credentials) {
      const { name, password } = options.credentials;
      __privateSet(this, _credentials, `${name}${password ? ":" + password : ""}`);
    }
    __privateSet(this, _identity, Promise.resolve(options.identity || new AnonymousIdentity()));
    if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) {
      throw InputError.fromCode(new IngressExpiryInvalidErrorCode("The maximum ingress expiry time is 5 minutes.", options.ingressExpiryInMinutes));
    }
    if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) {
      throw InputError.fromCode(new IngressExpiryInvalidErrorCode("Ingress expiry time must be greater than 0.", options.ingressExpiryInMinutes));
    }
    __privateSet(this, _maxIngressExpiryInMinutes, options.ingressExpiryInMinutes || 5);
    this.addTransform("update", makeNonceTransform(makeNonce));
    if (options.useQueryNonces) {
      this.addTransform("query", makeNonceTransform(makeNonce));
    }
    if (options.logToConsole) {
      this.log.subscribe((log) => {
        if (log.level === "error") {
          console.error(log.message);
        } else if (log.level === "warn") {
          console.warn(log.message);
        } else {
          console.log(log.message);
        }
      });
    }
  }
  static createSync(options = {}) {
    return new this({ ...options });
  }
  static async create(options = {}) {
    var _a2;
    const agent = _HttpAgent.createSync(options);
    await __privateMethod(_a2 = agent, _asyncGuard, asyncGuard_fn).call(_a2);
    return agent;
  }
  static async from(agent) {
    try {
      if ("config" in agent) {
        return await _HttpAgent.create(agent.config);
      }
      return await _HttpAgent.create({
        fetch: agent._fetch,
        fetchOptions: agent._fetchOptions,
        callOptions: agent._callOptions,
        host: agent._host.toString(),
        identity: agent._identity ?? void 0
      });
    } catch {
      throw InputError.fromCode(new CreateHttpAgentErrorCode());
    }
  }
  isLocal() {
    const hostname = this.host.hostname;
    return hostname === "127.0.0.1" || hostname.endsWith("127.0.0.1");
  }
  addTransform(type, fn, priority = fn.priority || 0) {
    if (type === "update") {
      const i = __privateGet(this, _updatePipeline).findIndex((x2) => (x2.priority || 0) < priority);
      __privateGet(this, _updatePipeline).splice(i >= 0 ? i : __privateGet(this, _updatePipeline).length, 0, Object.assign(fn, { priority }));
    } else if (type === "query") {
      const i = __privateGet(this, _queryPipeline).findIndex((x2) => (x2.priority || 0) < priority);
      __privateGet(this, _queryPipeline).splice(i >= 0 ? i : __privateGet(this, _queryPipeline).length, 0, Object.assign(fn, { priority }));
    }
  }
  async getPrincipal() {
    if (!__privateGet(this, _identity)) {
      throw ExternalError.fromCode(new IdentityInvalidErrorCode());
    }
    return (await __privateGet(this, _identity)).getPrincipal();
  }
  /**
   * Makes a call to a canister method.
   * @param canisterId - The ID of the canister to call. Can be a Principal or a string.
   * @param options - Options for the call.
   * @param options.methodName - The name of the method to call.
   * @param options.arg - The argument to pass to the method, as a Uint8Array.
   * @param options.effectiveCanisterId - (Optional) The effective canister ID, if different from the target canister ID.
   * @param options.callSync - (Optional) Whether to use synchronous call mode. Defaults to true.
   * @param options.nonce - (Optional) A unique nonce for the request. If provided, it will override any nonce set by transforms.
   * @param identity - (Optional) The identity to use for the call. If not provided, the agent's current identity will be used.
   * @returns A promise that resolves to the response of the call, including the request ID and response details.
   */
  async call(canisterId, options, identity) {
    const callSync = options.callSync ?? true;
    const id = await (identity ?? __privateGet(this, _identity));
    if (!id) {
      throw ExternalError.fromCode(new IdentityInvalidErrorCode());
    }
    const canister = Principal.from(canisterId);
    const ecid = options.effectiveCanisterId ? Principal.from(options.effectiveCanisterId) : canister;
    await __privateMethod(this, _asyncGuard, asyncGuard_fn).call(this, ecid);
    const sender = id.getPrincipal();
    const ingress_expiry = calculateIngressExpiry(__privateGet(this, _maxIngressExpiryInMinutes), __privateGet(this, _timeDiffMsecs));
    const submit = {
      request_type: SubmitRequestType.Call,
      canister_id: canister,
      method_name: options.methodName,
      arg: options.arg,
      sender,
      ingress_expiry
    };
    let transformedRequest = await this._transform({
      request: {
        body: null,
        method: "POST",
        headers: {
          "Content-Type": "application/cbor",
          ...__privateGet(this, _credentials) ? { Authorization: "Basic " + btoa(__privateGet(this, _credentials)) } : {}
        }
      },
      endpoint: Endpoint.Call,
      body: submit
    });
    let nonce;
    if (options == null ? void 0 : options.nonce) {
      nonce = toNonce(options.nonce);
    } else if (transformedRequest.body.nonce) {
      nonce = toNonce(transformedRequest.body.nonce);
    } else {
      nonce = void 0;
    }
    submit.nonce = nonce;
    function toNonce(buf) {
      return Object.assign(buf, { __nonce__: void 0 });
    }
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = encode(transformedRequest.body);
    const backoff2 = __privateGet(this, _backoffStrategy).call(this);
    const requestId = requestIdOf(submit);
    try {
      const requestSync = () => {
        this.log.print(`fetching "/api/v3/canister/${ecid.toText()}/call" with request:`, transformedRequest);
        return __privateGet(this, _fetch).call(this, "" + new URL(`/api/v3/canister/${ecid.toText()}/call`, this.host), {
          ...__privateGet(this, _callOptions),
          ...transformedRequest.request,
          body
        });
      };
      const requestAsync = () => {
        this.log.print(`fetching "/api/v2/canister/${ecid.toText()}/call" with request:`, transformedRequest);
        return __privateGet(this, _fetch).call(this, "" + new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host), {
          ...__privateGet(this, _callOptions),
          ...transformedRequest.request,
          body
        });
      };
      const requestFn = callSync ? requestSync : requestAsync;
      const { responseBodyBytes, ...response } = await __privateMethod(this, _requestAndRetry, requestAndRetry_fn).call(this, {
        requestFn,
        backoff: backoff2,
        tries: 0
      });
      const responseBody = responseBodyBytes.byteLength > 0 ? decode(responseBodyBytes) : null;
      return {
        requestId,
        response: {
          ...response,
          body: responseBody
        },
        requestDetails: submit
      };
    } catch (error) {
      let callError;
      if (error instanceof AgentError) {
        if (error.hasCode(HttpV3ApiNotSupportedErrorCode)) {
          this.log.warn("v3 api not supported. Fall back to v2");
          return this.call(canisterId, {
            ...options,
            // disable v3 api
            callSync: false
          }, identity);
        } else if (error.hasCode(IngressExpiryInvalidErrorCode) && !__privateGet(this, _hasSyncedTime)) {
          await this.syncTime(canister);
          return this.call(canister, options, identity);
        } else {
          error.code.requestContext = {
            requestId,
            senderPubKey: transformedRequest.body.sender_pubkey,
            senderSignature: transformedRequest.body.sender_sig,
            ingressExpiry: transformedRequest.body.content.ingress_expiry
          };
          callError = error;
        }
      } else {
        callError = UnknownError.fromCode(new UnexpectedErrorCode(error));
      }
      this.log.error(`Error while making call: ${callError.message}`, callError);
      throw callError;
    }
  }
  async query(canisterId, fields, identity) {
    const backoff2 = __privateGet(this, _backoffStrategy).call(this);
    const ecid = fields.effectiveCanisterId ? Principal.from(fields.effectiveCanisterId) : Principal.from(canisterId);
    await __privateMethod(this, _asyncGuard, asyncGuard_fn).call(this, ecid);
    this.log.print(`ecid ${ecid.toString()}`);
    this.log.print(`canisterId ${canisterId.toString()}`);
    let transformedRequest;
    const id = await (identity ?? __privateGet(this, _identity));
    if (!id) {
      throw ExternalError.fromCode(new IdentityInvalidErrorCode());
    }
    const canister = Principal.from(canisterId);
    const sender = id.getPrincipal();
    const ingressExpiry = calculateIngressExpiry(__privateGet(this, _maxIngressExpiryInMinutes), __privateGet(this, _timeDiffMsecs));
    const request2 = {
      request_type: ReadRequestType.Query,
      canister_id: canister,
      method_name: fields.methodName,
      arg: fields.arg,
      sender,
      ingress_expiry: ingressExpiry
    };
    const requestId = requestIdOf(request2);
    transformedRequest = await this._transform({
      request: {
        method: "POST",
        headers: {
          "Content-Type": "application/cbor",
          ...__privateGet(this, _credentials) ? { Authorization: "Basic " + btoa(__privateGet(this, _credentials)) } : {}
        }
      },
      endpoint: Endpoint.Query,
      body: request2
    });
    transformedRequest = await id.transformRequest(transformedRequest);
    const body = encode(transformedRequest.body);
    const args = {
      canister: canister.toText(),
      ecid,
      transformedRequest,
      body,
      requestId,
      backoff: backoff2,
      tries: 0
    };
    const makeQuery = async () => {
      const query = await __privateMethod(this, _requestAndRetryQuery, requestAndRetryQuery_fn).call(this, args);
      return {
        requestDetails: request2,
        ...query
      };
    };
    const getSubnetStatus = async () => {
      const cachedSubnetStatus = __privateGet(this, _subnetKeys).get(ecid.toString());
      if (cachedSubnetStatus) {
        return cachedSubnetStatus;
      }
      await this.fetchSubnetKeys(ecid.toString());
      const subnetStatus = __privateGet(this, _subnetKeys).get(ecid.toString());
      if (!subnetStatus) {
        throw TrustError.fromCode(new MissingSignatureErrorCode());
      }
      return subnetStatus;
    };
    try {
      if (!__privateGet(this, _verifyQuerySignatures)) {
        return await makeQuery();
      }
      const [queryWithDetails, subnetStatus] = await Promise.all([makeQuery(), getSubnetStatus()]);
      try {
        return __privateGet(this, _verifyQueryResponse).call(this, queryWithDetails, subnetStatus);
      } catch {
        this.log.warn("Query response verification failed. Retrying with fresh subnet keys.");
        __privateGet(this, _subnetKeys).delete(ecid.toString());
        const updatedSubnetStatus = await getSubnetStatus();
        return __privateGet(this, _verifyQueryResponse).call(this, queryWithDetails, updatedSubnetStatus);
      }
    } catch (error) {
      let queryError;
      if (error instanceof AgentError) {
        error.code.requestContext = {
          requestId,
          senderPubKey: transformedRequest.body.sender_pubkey,
          senderSignature: transformedRequest.body.sender_sig,
          ingressExpiry: transformedRequest.body.content.ingress_expiry
        };
        queryError = error;
      } else {
        queryError = UnknownError.fromCode(new UnexpectedErrorCode(error));
      }
      this.log.error(`Error while making query: ${queryError.message}`, queryError);
      throw queryError;
    }
  }
  async createReadStateRequest(fields, identity) {
    await __privateMethod(this, _asyncGuard, asyncGuard_fn).call(this);
    const id = await (identity ?? __privateGet(this, _identity));
    if (!id) {
      throw ExternalError.fromCode(new IdentityInvalidErrorCode());
    }
    const sender = id.getPrincipal();
    const transformedRequest = await this._transform({
      request: {
        method: "POST",
        headers: {
          "Content-Type": "application/cbor",
          ...__privateGet(this, _credentials) ? { Authorization: "Basic " + btoa(__privateGet(this, _credentials)) } : {}
        }
      },
      endpoint: Endpoint.ReadState,
      body: {
        request_type: ReadRequestType.ReadState,
        paths: fields.paths,
        sender,
        ingress_expiry: calculateIngressExpiry(__privateGet(this, _maxIngressExpiryInMinutes), __privateGet(this, _timeDiffMsecs))
      }
    });
    return id.transformRequest(transformedRequest);
  }
  async readState(canisterId, fields, _identity2, request2) {
    await __privateMethod(this, _rootKeyGuard, rootKeyGuard_fn).call(this);
    const canister = Principal.from(canisterId);
    function getRequestId(options) {
      for (const path of options.paths) {
        const [pathName, value] = path;
        const request_status = new TextEncoder().encode("request_status");
        if (uint8Equals(pathName, request_status)) {
          return value;
        }
      }
    }
    let transformedRequest;
    let requestId;
    if (request2) {
      transformedRequest = request2;
      requestId = requestIdOf(transformedRequest);
    } else {
      requestId = getRequestId(fields);
      const identity = await __privateGet(this, _identity);
      if (!identity) {
        throw ExternalError.fromCode(new IdentityInvalidErrorCode());
      }
      transformedRequest = await this.createReadStateRequest(fields, identity);
    }
    this.log.print(`fetching "/api/v2/canister/${canister}/read_state" with request:`, transformedRequest);
    const backoff2 = __privateGet(this, _backoffStrategy).call(this);
    try {
      const { responseBodyBytes } = await __privateMethod(this, _requestAndRetry, requestAndRetry_fn).call(this, {
        requestFn: () => __privateGet(this, _fetch).call(this, "" + new URL(`/api/v2/canister/${canister.toString()}/read_state`, this.host), {
          ...__privateGet(this, _fetchOptions),
          ...transformedRequest.request,
          body: encode(transformedRequest.body)
        }),
        backoff: backoff2,
        tries: 0
      });
      const decodedResponse = decode(responseBodyBytes);
      this.log.print("Read state response:", decodedResponse);
      return decodedResponse;
    } catch (error) {
      let readStateError;
      if (error instanceof AgentError) {
        error.code.requestContext = {
          requestId,
          senderPubKey: transformedRequest.body.sender_pubkey,
          senderSignature: transformedRequest.body.sender_sig,
          ingressExpiry: transformedRequest.body.content.ingress_expiry
        };
        readStateError = error;
      } else {
        readStateError = UnknownError.fromCode(new UnexpectedErrorCode(error));
      }
      this.log.error(`Error while making read state: ${readStateError.message}`, readStateError);
      throw readStateError;
    }
  }
  parseTimeFromResponse(response) {
    let tree;
    if (response.certificate) {
      const decoded = decode(response.certificate);
      if (decoded && "tree" in decoded) {
        tree = decoded.tree;
      } else {
        throw ProtocolError.fromCode(new HashTreeDecodeErrorCode("Could not decode time from response"));
      }
      const timeLookup = lookup_path(["time"], tree);
      if (timeLookup.status !== LookupPathStatus.Found) {
        throw ProtocolError.fromCode(new LookupErrorCode("Time was not found in the response or was not in its expected format.", timeLookup.status));
      }
      if (!(timeLookup.value instanceof Uint8Array) && !ArrayBuffer.isView(timeLookup)) {
        throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode("Time was not in its expected format."));
      }
      const date = decodeTime(timeLookup.value);
      this.log.print("Time from response:", date);
      this.log.print("Time from response in milliseconds:", date.getTime());
      return date.getTime();
    } else {
      this.log.warn("No certificate found in response");
    }
    return 0;
  }
  /**
   * Allows agent to sync its time with the network. Can be called during intialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
   * @param {Principal} canisterIdOverride - Pass a canister ID if you need to sync the time with a particular subnet. Uses the ICP ledger canister by default.
   */
  async syncTime(canisterIdOverride) {
    __privateSet(this, _syncTimePromise, __privateGet(this, _syncTimePromise) ?? (async () => {
      await __privateMethod(this, _rootKeyGuard, rootKeyGuard_fn).call(this);
      const callTime = Date.now();
      try {
        if (!canisterIdOverride) {
          this.log.print("Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai");
        }
        const canisterId = canisterIdOverride ?? Principal.from("ryjl3-tyaaa-aaaaa-aaaba-cai");
        const anonymousAgent = _HttpAgent.createSync({
          identity: new AnonymousIdentity(),
          host: this.host.toString(),
          fetch: __privateGet(this, _fetch),
          retryTimes: 0,
          rootKey: this.rootKey ?? void 0,
          shouldSyncTime: false
        });
        const replicaTimes = await Promise.all(Array(3).fill(null).map(async () => {
          const status = await request({
            canisterId,
            agent: anonymousAgent,
            paths: ["time"],
            disableCertificateTimeVerification: true
            // avoid recursive calls to syncTime
          });
          const date = status.get("time");
          if (date instanceof Date) {
            return date.getTime();
          }
        }, []));
        const maxReplicaTime = replicaTimes.reduce((max, current) => {
          return typeof current === "number" && current > max ? current : max;
        }, 0);
        if (maxReplicaTime > 0) {
          __privateSet(this, _timeDiffMsecs, maxReplicaTime - callTime);
          __privateSet(this, _hasSyncedTime, true);
          this.log.notify({
            message: `Syncing time: offset of ${__privateGet(this, _timeDiffMsecs)}`,
            level: "info"
          });
        }
      } catch (error) {
        const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
        this.log.error("Caught exception while attempting to sync time", syncTimeError);
        throw syncTimeError;
      }
    })());
    await __privateGet(this, _syncTimePromise).finally(() => {
      __privateSet(this, _syncTimePromise, null);
    });
  }
  async status() {
    const headers = __privateGet(this, _credentials) ? {
      Authorization: "Basic " + btoa(__privateGet(this, _credentials))
    } : {};
    this.log.print(`fetching "/api/v2/status"`);
    const backoff2 = __privateGet(this, _backoffStrategy).call(this);
    const { responseBodyBytes } = await __privateMethod(this, _requestAndRetry, requestAndRetry_fn).call(this, {
      backoff: backoff2,
      requestFn: () => __privateGet(this, _fetch).call(this, "" + new URL(`/api/v2/status`, this.host), { headers, ...__privateGet(this, _fetchOptions) }),
      tries: 0
    });
    return decode(responseBodyBytes);
  }
  async fetchRootKey() {
    __privateSet(this, _rootKeyPromise, __privateGet(this, _rootKeyPromise) ?? (async () => {
      const value = await this.status();
      this.rootKey = value.root_key;
      return this.rootKey;
    })());
    return await __privateGet(this, _rootKeyPromise).finally(() => {
      __privateSet(this, _rootKeyPromise, null);
    });
  }
  invalidateIdentity() {
    __privateSet(this, _identity, null);
  }
  replaceIdentity(identity) {
    __privateSet(this, _identity, Promise.resolve(identity));
  }
  async fetchSubnetKeys(canisterId) {
    const effectiveCanisterId = Principal.from(canisterId);
    await __privateMethod(this, _asyncGuard, asyncGuard_fn).call(this, effectiveCanisterId);
    const response = await request({
      canisterId: effectiveCanisterId,
      paths: ["subnet"],
      agent: this
    });
    const subnetResponse = response.get("subnet");
    if (subnetResponse && typeof subnetResponse === "object" && "nodeKeys" in subnetResponse) {
      __privateGet(this, _subnetKeys).set(effectiveCanisterId.toText(), subnetResponse);
      return subnetResponse;
    }
    return void 0;
  }
  _transform(request2) {
    let p2 = Promise.resolve(request2);
    if (request2.endpoint === Endpoint.Call) {
      for (const fn of __privateGet(this, _updatePipeline)) {
        p2 = p2.then((r2) => fn(r2).then((r22) => r22 || r2));
      }
    } else {
      for (const fn of __privateGet(this, _queryPipeline)) {
        p2 = p2.then((r2) => fn(r2).then((r22) => r22 || r2));
      }
    }
    return p2;
  }
  /**
   * Returns the time difference in milliseconds between the IC network clock and the client's clock,
   * after the clock has been synced.
   *
   * If the time has not been synced, returns `0`.
   */
  getTimeDiffMsecs() {
    return __privateGet(this, _timeDiffMsecs);
  }
  /**
   * Returns `true` if the time has been synced at least once with the IC network, `false` otherwise.
   */
  hasSyncedTime() {
    return __privateGet(this, _hasSyncedTime);
  }
};
_rootKeyPromise = new WeakMap();
_shouldFetchRootKey = new WeakMap();
_timeDiffMsecs = new WeakMap();
_hasSyncedTime = new WeakMap();
_syncTimePromise = new WeakMap();
_shouldSyncTime = new WeakMap();
_identity = new WeakMap();
_fetch = new WeakMap();
_fetchOptions = new WeakMap();
_callOptions = new WeakMap();
_credentials = new WeakMap();
_retryTimes = new WeakMap();
_backoffStrategy = new WeakMap();
_maxIngressExpiryInMinutes = new WeakMap();
_maxIngressExpiryInMs = new WeakSet();
maxIngressExpiryInMs_get = function() {
  return __privateGet(this, _maxIngressExpiryInMinutes) * MINUTE_TO_MSECS;
};
_queryPipeline = new WeakMap();
_updatePipeline = new WeakMap();
_subnetKeys = new WeakMap();
_verifyQuerySignatures = new WeakMap();
_requestAndRetryQuery = new WeakSet();
requestAndRetryQuery_fn = async function(args) {
  var _a2, _b2;
  const { ecid, transformedRequest, body, requestId, backoff: backoff2, tries } = args;
  const delay = tries === 0 ? 0 : backoff2.next();
  this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with tries:`, {
    tries,
    backoff: backoff2,
    delay
  });
  if (delay === null) {
    throw UnknownError.fromCode(new TimeoutWaitingForResponseErrorCode(`Backoff strategy exhausted after ${tries} attempts.`, requestId));
  }
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  let response;
  try {
    this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with request:`, transformedRequest);
    const fetchResponse = await __privateGet(this, _fetch).call(this, "" + new URL(`/api/v2/canister/${ecid.toString()}/query`, this.host), {
      ...__privateGet(this, _fetchOptions),
      ...transformedRequest.request,
      body
    });
    if (fetchResponse.status === HTTP_STATUS_OK) {
      const queryResponse = decode(uint8FromBufLike(await fetchResponse.arrayBuffer()));
      response = {
        ...queryResponse,
        httpDetails: {
          ok: fetchResponse.ok,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: httpHeadersTransform(fetchResponse.headers)
        },
        requestId
      };
    } else {
      throw ProtocolError.fromCode(new HttpErrorCode(fetchResponse.status, fetchResponse.statusText, httpHeadersTransform(fetchResponse.headers), await fetchResponse.text()));
    }
  } catch (error) {
    if (tries < __privateGet(this, _retryTimes)) {
      this.log.warn(`Caught exception while attempting to make query:
  ${error}
  Retrying query.`);
      return await __privateMethod(this, _requestAndRetryQuery, requestAndRetryQuery_fn).call(this, { ...args, tries: tries + 1 });
    }
    if (error instanceof AgentError) {
      throw error;
    }
    throw TransportError.fromCode(new HttpFetchErrorCode(error));
  }
  if (!__privateGet(this, _verifyQuerySignatures)) {
    return response;
  }
  const signatureTimestampNs = (_b2 = (_a2 = response.signatures) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.timestamp;
  if (!signatureTimestampNs) {
    throw ProtocolError.fromCode(new MalformedSignatureErrorCode("Timestamp not found in query response. This suggests a malformed or malicious response."));
  }
  const signatureTimestampMs = Number(BigInt(signatureTimestampNs) / BigInt(MSECS_TO_NANOSECONDS));
  const currentTimestampInMs = Date.now() + __privateGet(this, _timeDiffMsecs);
  if (currentTimestampInMs - signatureTimestampMs > __privateGet(this, _maxIngressExpiryInMs, maxIngressExpiryInMs_get)) {
    if (tries < __privateGet(this, _retryTimes)) {
      this.log.warn("Timestamp is older than the max ingress expiry. Retrying query.", {
        requestId,
        signatureTimestampMs
      });
      return await __privateMethod(this, _requestAndRetryQuery, requestAndRetryQuery_fn).call(this, { ...args, tries: tries + 1 });
    }
    throw TrustError.fromCode(new CertificateOutdatedErrorCode(__privateGet(this, _maxIngressExpiryInMinutes), requestId, tries));
  }
  return response;
};
_requestAndRetry = new WeakSet();
requestAndRetry_fn = async function(args) {
  const { requestFn, backoff: backoff2, tries } = args;
  const delay = tries === 0 ? 0 : backoff2.next();
  if (delay === null) {
    throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Retry strategy exhausted after ${tries} attempts.`));
  }
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  let response;
  let responseBodyBytes = new Uint8Array();
  try {
    response = await requestFn();
    if (response.status === HTTP_STATUS_OK) {
      responseBodyBytes = uint8FromBufLike(await response.clone().arrayBuffer());
    }
  } catch (error) {
    if (tries < __privateGet(this, _retryTimes)) {
      this.log.warn(`Caught exception while attempting to make request:
  ${error}
  Retrying request.`);
      return await __privateMethod(this, _requestAndRetry, requestAndRetry_fn).call(this, { requestFn, backoff: backoff2, tries: tries + 1 });
    }
    throw TransportError.fromCode(new HttpFetchErrorCode(error));
  }
  const headers = httpHeadersTransform(response.headers);
  if (response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_ACCEPTED) {
    return {
      ok: response.ok,
      // should always be true
      status: response.status,
      statusText: response.statusText,
      responseBodyBytes,
      headers
    };
  }
  const responseText = await response.text();
  if (response.status === HTTP_STATUS_NOT_FOUND && response.url.includes("api/v3")) {
    throw ProtocolError.fromCode(new HttpV3ApiNotSupportedErrorCode());
  }
  if (responseText.startsWith("Invalid request expiry: ")) {
    throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, __privateGet(this, _maxIngressExpiryInMinutes)));
  }
  if (tries < __privateGet(this, _retryTimes)) {
    return await __privateMethod(this, _requestAndRetry, requestAndRetry_fn).call(this, { requestFn, backoff: backoff2, tries: tries + 1 });
  }
  throw ProtocolError.fromCode(new HttpErrorCode(response.status, response.statusText, headers, responseText));
};
_verifyQueryResponse = new WeakMap();
_asyncGuard = new WeakSet();
asyncGuard_fn = async function(canisterIdOverride) {
  await Promise.all([__privateMethod(this, _rootKeyGuard, rootKeyGuard_fn).call(this), __privateMethod(this, _syncTimeGuard, syncTimeGuard_fn).call(this, canisterIdOverride)]);
};
_rootKeyGuard = new WeakSet();
rootKeyGuard_fn = async function() {
  if (this.rootKey) {
    return;
  } else if (this.rootKey === null && this.host.toString() !== "https://icp-api.io" && __privateGet(this, _shouldFetchRootKey)) {
    await this.fetchRootKey();
  } else {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode(__privateGet(this, _shouldFetchRootKey)));
  }
};
_syncTimeGuard = new WeakSet();
syncTimeGuard_fn = async function(canisterIdOverride) {
  if (__privateGet(this, _shouldSyncTime) && !this.hasSyncedTime()) {
    await this.syncTime(canisterIdOverride);
  }
};
var HttpAgent = _HttpAgent;
function calculateIngressExpiry(maxIngressExpiryInMinutes, timeDiffMsecs) {
  const ingressExpiryMs = maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
  return Expiry.fromDeltaInMilliseconds(ingressExpiryMs, timeDiffMsecs);
}

// node_modules/@dfinity/agent/lib/esm/polling/index.js
var polling_exports = {};
__export(polling_exports, {
  DEFAULT_POLLING_OPTIONS: () => DEFAULT_POLLING_OPTIONS,
  constructRequest: () => constructRequest,
  defaultStrategy: () => defaultStrategy,
  pollForResponse: () => pollForResponse,
  strategy: () => strategy_exports
});
var import_dist106 = __toESM(require_dist(), 1);
var import_dist107 = __toESM(require_dist2(), 1);
var import_dist108 = __toESM(require_dist3(), 1);

// node_modules/@dfinity/agent/lib/esm/polling/strategy.js
var strategy_exports = {};
__export(strategy_exports, {
  backoff: () => backoff,
  chain: () => chain,
  conditionalDelay: () => conditionalDelay,
  defaultStrategy: () => defaultStrategy,
  maxAttempts: () => maxAttempts,
  once: () => once,
  throttle: () => throttle,
  timeout: () => timeout
});
var import_dist103 = __toESM(require_dist(), 1);
var import_dist104 = __toESM(require_dist2(), 1);
var import_dist105 = __toESM(require_dist3(), 1);
var FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function maxAttempts(count) {
  let attempts = count;
  return async (_canisterId, requestId, status) => {
    if (--attempts <= 0) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Failed to retrieve a reply for request after ${count} attempts`, requestId, status));
    }
  };
}
function throttle(throttleInMsec) {
  return () => new Promise((resolve) => setTimeout(resolve, throttleInMsec));
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a2 of strategies) {
      await a2(canisterId, requestId, status);
    }
  };
}

// node_modules/@dfinity/agent/lib/esm/polling/index.js
var DEFAULT_POLLING_OPTIONS = {
  strategy: defaultStrategy(),
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request2 = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request2)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request2));
  }
  return request2;
}

// node_modules/@dfinity/agent/lib/esm/actor.js
var metadataSymbol = Symbol.for("ic-agent-metadata");
var Actor = class _Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL: idl_exports });
    class CanisterActor extends _Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
};
function decodeReturnValue(types, msg) {
  const returnValues = idl_exports.decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
var DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
var ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
var ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify2) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = idl_exports.encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b2;
      options = {
        ...options,
        ...(_b2 = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b2.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = idl_exports.encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: Principal.from(canisterId),
          blsVerify: blsVerify2,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify: blsVerify2
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}

// node_modules/@dfinity/agent/lib/esm/fetch_candid.js
var import_dist112 = __toESM(require_dist(), 1);
var import_dist113 = __toESM(require_dist2(), 1);
var import_dist114 = __toESM(require_dist3(), 1);
async function fetchCandid(canisterId, agent) {
  if (!agent) {
    agent = await HttpAgent.create();
  }
  const status = await request({
    agent,
    canisterId: Principal.fromText(canisterId),
    paths: ["candid"]
  });
  const candid = status.get("candid");
  if (candid) {
    return candid;
  }
  const tmpHackInterface = ({ IDL }) => IDL.Service({
    __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ["query"])
  });
  const actor = Actor.createActor(tmpHackInterface, { agent, canisterId });
  return await actor.__get_candid_interface_tmp_hack();
}

export {
  ReplicaRejectCode,
  QueryResponseStatus,
  isV2ResponseBody,
  isV3ResponseBody,
  ErrorKindEnum,
  AgentError,
  TrustError,
  ProtocolError,
  RejectError,
  TransportError,
  ExternalError,
  LimitError,
  InputError,
  UnknownError,
  CertificateVerificationErrorCode,
  CertificateTimeErrorCode,
  CertificateHasTooManyDelegationsErrorCode,
  CertificateNotAuthorizedErrorCode,
  LookupErrorCode,
  MalformedLookupFoundValueErrorCode,
  MissingLookupValueErrorCode,
  DerKeyLengthMismatchErrorCode,
  DerPrefixMismatchErrorCode,
  DerDecodeLengthMismatchErrorCode,
  DerDecodeErrorCode,
  DerEncodeErrorCode,
  CborDecodeErrorCode,
  CborEncodeErrorCode,
  HexDecodeErrorCode,
  TimeoutWaitingForResponseErrorCode,
  CertificateOutdatedErrorCode,
  CertifiedRejectErrorCode,
  UncertifiedRejectErrorCode,
  UncertifiedRejectUpdateErrorCode,
  RequestStatusDoneNoReplyErrorCode,
  MissingRootKeyErrorCode,
  HashValueErrorCode,
  HttpDefaultFetchErrorCode,
  IdentityInvalidErrorCode,
  IngressExpiryInvalidErrorCode,
  CreateHttpAgentErrorCode,
  MalformedSignatureErrorCode,
  MissingSignatureErrorCode,
  MalformedPublicKeyErrorCode,
  QuerySignatureVerificationFailedErrorCode,
  UnexpectedErrorCode,
  HashTreeDecodeErrorCode,
  HttpErrorCode,
  HttpV3ApiNotSupportedErrorCode,
  HttpFetchErrorCode,
  MissingCanisterIdErrorCode,
  InvalidReadStateRequestErrorCode,
  ExpiryJsonDeserializeErrorCode,
  UNREACHABLE_ERROR,
  uint8FromBufLike,
  uint8ToBuf,
  uint8Equals,
  hashValue,
  requestIdOf,
  hashOfMap,
  IC_REQUEST_DOMAIN_SEPARATOR,
  IC_RESPONSE_DOMAIN_SEPARATOR,
  IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR,
  SignIdentity,
  AnonymousIdentity,
  createIdentityDescriptor,
  ToCborValue,
  Cbor,
  randomNumber,
  Endpoint,
  SubmitRequestType,
  ReadRequestType,
  makeNonce,
  JSON_KEY_EXPIRY,
  Expiry,
  makeNonceTransform,
  makeExpiryTransform,
  httpHeadersTransform,
  verify,
  blsVerify,
  NodeType,
  hashTreeToString,
  Certificate,
  lookupResultToBuffer,
  reconstruct,
  domain_sep,
  LookupPathStatus,
  LookupSubtreeStatus,
  LookupLabelStatus,
  lookup_path,
  lookup_subtree,
  flatten_forks,
  find_label,
  check_canister_ranges,
  canisterStatus_exports,
  ed25519,
  encodeLenBytes,
  encodeLen,
  decodeLenBytes,
  decodeLen,
  DER_COSE_OID,
  ED25519_OID,
  SECP256K1_OID,
  BLS12_381_G2_OID,
  wrapDER,
  unwrapDER,
  Ed25519PublicKey,
  Observable,
  ObservableLog,
  RequestStatusResponseStatus,
  IC_ROOT_KEY,
  MANAGEMENT_CANISTER_ID,
  HttpAgent,
  calculateIngressExpiry,
  defaultStrategy,
  strategy_exports,
  DEFAULT_POLLING_OPTIONS,
  pollForResponse,
  constructRequest,
  polling_exports,
  Actor,
  ACTOR_METHOD_WITH_HTTP_DETAILS,
  ACTOR_METHOD_WITH_CERTIFICATE,
  fetchCandid
};
/*! Bundled license information:

@noble/curves/esm/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/bls.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/tower.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/bls12-381.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/edwards.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/montgomery.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=chunk-AQLZL5WA.js.map
