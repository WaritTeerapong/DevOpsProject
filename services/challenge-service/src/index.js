// services/challenge-service/src/index.js
require('dotenv').config();
const express = require('express');
const challengeRoutes = require('./routes/challengeRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.use('/challenges', challengeRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Challenge Service running on port ${PORT}`);
});
