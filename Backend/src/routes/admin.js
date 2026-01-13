const express = require('express');
const {
  getAllUsers,
  getStats,
  createStock,
  updateStock,
  deleteStock,
  getAllStocksAdmin
} = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Semua route admin butuh autentikasi dan role admin
router.use(authenticate);
router.use(isAdmin);

console.log({
  getAllUsers,
  getStats,
  createStock,
  updateStock,
  deleteStock,
  getAllStocksAdmin
});


// User management
router.get('/users', getAllUsers);

// Statistics
router.get('/stats', getStats);

// Stock management
router.get('/stocks', getAllStocksAdmin);
router.post('/stocks', createStock);
router.put('/stocks/:id', updateStock);
router.delete('/stocks/:id', deleteStock);

module.exports = router;