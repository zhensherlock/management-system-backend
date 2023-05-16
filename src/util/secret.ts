import hmacMD5 from 'crypto-js/hmac-md5';

const secretKey = '6(DF1H*D&F3&72@!I#Jl';

export const encrypt = message => {
  return hmacMD5(message, secretKey).toString();
};
