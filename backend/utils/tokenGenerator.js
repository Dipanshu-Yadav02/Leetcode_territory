import crypto from 'crypto';

export const generateLCKingToken = () => {
  const hexString = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `LC-KING-${hexString}`;
};
