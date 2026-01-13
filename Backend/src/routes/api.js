const express = require('express');
const {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getStockHistory
} = require('../controllers/stockController');
const { validateApiKey } = require('../middleware/apiKey');

const router = express.Router();

/**
 * Semua endpoint API pakai API KEY
 */
router.use(validateApiKey);

/**
 * GET /api/v1/stocks
 * Query: page, limit, sort, order
 */
router.get('/stocks', getAllStocks);

/**
 * GET /api/v1/stocks/search?q=bank
 */
router.get('/stocks/search', searchStocks);

/**
 * GET /api/v1/stocks/:symbol
 */
router.get('/stocks/:symbol', getStockBySymbol);

router.get('/stocks/:symbol/history', getStockHistory);



module.exports = router;
