import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

export const encrypt = (password: string, salt = nanoid(16)) => {
  // const salt = randomBytes(8).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return {
    salt,
    hash,
  };
};

export const generatePassword = () => {
  return nanoid(10);
};
