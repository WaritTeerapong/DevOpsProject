// services/auth-service/src/services/authService.js
const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');

const upsertGoogleUser = async (profile) => {
  // Check if user exists by googleId or email
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    }
  });

  if (!user) {
    // Create new user if not found
    user = await prisma.user.create({
      data: {
        googleId: profile.id,
        username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000),
        email: profile.emails[0].value,
      }
    });
  } else if (!user.googleId) {
    // Link google account if user exists by email but has no googleId
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId: profile.id }
    });
  }

  return user;
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  upsertGoogleUser,
  generateToken
};
