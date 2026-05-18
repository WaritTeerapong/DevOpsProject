const jwt = require('jsonwebtoken');

// Since server.js is CJS, we use a CJS prisma client
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const upsertGoogleUser = async (profile) => {
  let user = await prismaClient.user.findFirst({
    where: {
      OR: [
        { googleId: profile.id },
        { email: profile.emails[0].value }
      ]
    }
  });

  if (!user) {
    user = await prismaClient.user.create({
      data: {
        googleId: profile.id,
        username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000),
        email: profile.emails[0].value,
      }
    });
  } else if (!user.googleId) {
    user = await prismaClient.user.update({
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
