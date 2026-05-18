// services/submission-service/src/index.js
require('dotenv').config();
const express = require('express');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Routes
app.use('/submit', submissionRoutes);

app.listen(PORT, () => {
  console.log(`Submission Service running on port ${PORT}`);
});
