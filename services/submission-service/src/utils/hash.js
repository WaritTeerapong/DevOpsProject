// services/submission-service/src/utils/hash.js
const crypto = require('crypto');

const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

module.exports = {
  hashFlag
};
