const express = require('express');
const router = express.Router();
const { savePlayerId } = require('../controllers/onesignalController');

router.post('/save-player-id', savePlayerId);

module.exports = router;