// services/challenge-service/src/utils/hash.js
const crypto = require('crypto');

const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

module.exports = {
  hashFlag,
  hashPassword
};
