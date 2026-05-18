// services/submission-service/src/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { submissionRateLimiter } = require('../middlewares/rateLimiter');

router.post('/', submissionRateLimiter, submissionController.handleSubmit);

module.exports = router;
