import { createHash,randomBytes } from 'crypto';

export async function hash(password){
  const passwordHash = createHash('sha256').update(password).digest('hex');
  return passwordHash;
}