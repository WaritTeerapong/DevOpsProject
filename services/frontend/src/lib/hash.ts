import crypto from 'crypto';

export const hashFlag = (flag: string) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

export const hashPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};
