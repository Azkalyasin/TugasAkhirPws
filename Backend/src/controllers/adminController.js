const { PrismaClient } = require('@prisma/client');
const serializeBigInt = require('../utils/serializeBigInt');


const prisma = new PrismaClient();

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          apiKey: true,
          apiCalls: true,
          monthlyQuota: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);

    res.json({
      success: true,
      data: users,
      meta: {
        total,
        page: pageNum,
        perPage: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};

/**
 * Get statistics
 */
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStocks,
      totalApiCalls,
      recentUsage
    ] = await Promise.all([
      prisma.user.count(),
      prisma.stock.count(),
      prisma.apiUsage.count(),
      prisma.apiUsage.findMany({
        take: 10,
        orderBy: {
          timestamp: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    const usersByPlan = await prisma.user.groupBy({
      by: ['plan'],
      _count: true
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStocks,
        totalApiCalls,
        usersByPlan: usersByPlan.reduce((acc, item) => {
          acc[item.plan] = item._count;
          return acc;
        }, {}),
        recentUsage
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};

/**
 * Create stock
 */
const createStock = async (req, res) => {
  try {
    const {
      symbol,
      name,
      sector,
      subsector,
      price,
      open,
      high,
      low,
      close,
      volume,
      marketCap
    } = req.body;

    if (!symbol || !name || !price) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Symbol, name, dan price harus diisi'
        }
      });
    }

    const existingStock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() }
    });

    if (existingStock) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'STOCK_EXISTS',
          message: 'Stock dengan symbol ini sudah ada'
        }
      });
    }

    const stock = await prisma.stock.create({
      data: {
        symbol: symbol.toUpperCase(),
        name,
        sector,
        subsector,
        price: parseFloat(price),
        open: open ? parseFloat(open) : parseFloat(price),
        high: high ? parseFloat(high) : parseFloat(price),
        low: low ? parseFloat(low) : parseFloat(price),
        close: close ? parseFloat(close) : parseFloat(price),
        volume: volume ? BigInt(volume) : BigInt(0),
        marketCap: marketCap ? BigInt(marketCap) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Stock berhasil ditambahkan',
      data: serializeBigInt(stock)
    });
  } catch (error) {
    console.error('Create stock error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};

/**
 * Update stock
 */
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert numeric strings to proper types
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.open) updateData.open = parseFloat(updateData.open);
    if (updateData.high) updateData.high = parseFloat(updateData.high);
    if (updateData.low) updateData.low = parseFloat(updateData.low);
    if (updateData.close) updateData.close = parseFloat(updateData.close);
    if (updateData.volume) updateData.volume = BigInt(updateData.volume);
    if (updateData.marketCap) updateData.marketCap = BigInt(updateData.marketCap);

    const stock = await prisma.stock.update({
      where: { id },
      data: {
        ...updateData,
        lastUpdate: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Stock berhasil diupdate',
      data: serializeBigInt(stock)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'STOCK_NOT_FOUND',
          message: 'Stock tidak ditemukan'
        }
      });
    }

    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};

/**
 * Delete stock
 */
const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.stock.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Stock berhasil dihapus'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'STOCK_NOT_FOUND',
          message: 'Stock tidak ditemukan'
        }
      });
    }

    console.error('Delete stock error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};


const getAllStocksAdmin = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: serializeBigInt(stocks),
    });
  } catch (error) {
    console.error('Get admin stocks error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Gagal mengambil data stocks',
      },
    });
  }
};



module.exports = {
  getAllUsers,
  getStats,
  createStock,
  updateStock,
  deleteStock,
  getAllStocksAdmin
};