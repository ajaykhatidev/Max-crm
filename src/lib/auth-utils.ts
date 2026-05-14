import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

const PBKDF2_ITERATIONS = 100000; 
const SALT_LENGTH = 16; 
const KEY_LENGTH = 32; 

export const verifyPassword = (password: string, storedHash: string | null): boolean => {
  if (!storedHash || !password) return false;

  if (storedHash.startsWith('$2')) {
    try {
      return bcrypt.compareSync(password, storedHash);
    } catch {
      return false;
    }
  }

  try {
    const [salt, expectedHash] = storedHash.split(':');
    
    if (!salt || !expectedHash) {
      if (password === storedHash) return true;
      const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
      return legacyHash === storedHash;
    }

    const hash = crypto.pbkdf2Sync(
      password,
      Buffer.from(salt, 'hex'),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      'sha256'
    );
    const hashHex = hash.toString('hex');

    return crypto.timingSafeEqual(
      Buffer.from(hashHex, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch {
    return false;
  }
};

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(
    plain,
    Buffer.from(salt, 'hex'),
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    'sha256'
  );
  return `${salt}:${hash.toString('hex')}`;
}
