// services/auth-service/src/controllers/authController.js
const authService = require('../services/authService');

const googleCallback = (req, res) => {
  const token = authService.generateToken(req.user);

  res.json({
    message: 'Authentication successful',
    token: token,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

const healthCheck = (req, res) => {
  res.json({ status: 'Auth Service is live' });
};

module.exports = {
  googleCallback,
  healthCheck
};
