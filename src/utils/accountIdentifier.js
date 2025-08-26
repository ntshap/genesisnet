import { Principal } from '@dfinity/principal';
import { sha224 } from 'js-sha256';

// Account identifier implementation for ICP
export class AccountIdentifier {
  constructor(principal, subAccount) {
    this.principal = principal;
    this.subAccount = subAccount || new Uint8Array(32);
  }

  static fromPrincipal(principal, subAccount) {
    return new AccountIdentifier(principal, subAccount);
  }


  toUint8Array() {
    const principal = this.principal;
    const subAccount = this.subAccount;

    // Create the account identifier
    const hash = sha224.create();
    hash.update("\x0Aaccount-id");
    hash.update(principal.toUint8Array());
    hash.update(subAccount);

    const hashArray = hash.array();
    const checksum = this.crc32(new Uint8Array(hashArray));

    const bytes = new Uint8Array(32);
    bytes.set(checksum, 0);
    bytes.set(hashArray, 4);

    return bytes;
  }

  toHex() {
    const principal = this.principal;
    const subAccount = this.subAccount;
    
    // Create the account identifier
    const hash = sha224.create();
    hash.update('\x0Aaccount-id');
    hash.update(principal.toUint8Array());
    hash.update(subAccount);
    
    const hashArray = hash.array();
    const checksum = this.crc32(new Uint8Array(hashArray));
    
    const bytes = new Uint8Array(32);
    bytes.set(checksum, 0);
    bytes.set(hashArray, 4);
    
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  crc32(bytes) {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    
    const result = new Uint8Array(4);
    result[0] = (crc ^ 0xFFFFFFFF) >>> 24;
    result[1] = ((crc ^ 0xFFFFFFFF) >>> 16) & 0xFF;
    result[2] = ((crc ^ 0xFFFFFFFF) >>> 8) & 0xFF;
    result[3] = (crc ^ 0xFFFFFFFF) & 0xFF;
    
    return result;
  }
}
