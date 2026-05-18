// services/challenge-service/src/services/userService.js
const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/hash');

const createUser = async (data) => {
  const { username, email, password } = data;
  return await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: hashPassword(password),
    }
  });
};

module.exports = {
  createUser
};
