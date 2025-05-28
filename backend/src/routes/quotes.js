const express = require('express');
const router = express.Router();
const { getQuotes } = require('../controllers/quotesController');

// GET /api/quotes
router.get('/', getQuotes);

module.exports = router; 