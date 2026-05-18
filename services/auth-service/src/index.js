// services/auth-service/src/index.js
require('dotenv').config();
const express = require('express');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
