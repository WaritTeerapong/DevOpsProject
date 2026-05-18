// services/challenge-service/src/routes/challengeRoutes.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.get('/', challengeController.getChallenges);
router.post('/', challengeController.createChallenge);

module.exports = router;
