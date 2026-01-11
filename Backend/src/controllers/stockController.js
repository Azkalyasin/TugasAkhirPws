const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const serializeBigInt = require('../utils/serializeBigInt');

/**
 * Get all stocks dengan pagination
 */
const getAllStocks = async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = "symbol", order = "asc" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100
    const skip = (pageNum - 1) * limitNum;

    const orderBy = {};
    orderBy[sort] = order === "desc" ? "desc" : "asc";

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        skip,
        take: limitNum,
        orderBy,
        select: {
          symbol: true,
          name: true,
          price: true,
          change: true,
          changePercent: true,
          volume: true,
          marketCap: true,
          lastUpdate: true,
        },
      }),
      prisma.stock.count(),
    ]);

    res.json({
      success: true,
      data: serializeBigInt(stocks),
      meta: {
        total,
        page: pageNum,
        perPage: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get all stocks error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Terjadi kesalahan server",
      },
    });
  }
};

/**
 * Get stock by symbol
 */
const getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          code: "STOCK_NOT_FOUND",
          message: `Saham dengan symbol '${symbol}' tidak ditemukan`,
        },
      });
    }

    res.json({
      success: true,
      data: serializeBigInt(stock),
    });
  } catch (error) {
    console.error("Get stock by symbol error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Terjadi kesalahan server",
      },
    });
  }
};

/**
 * Search stocks
 */
const searchStocks = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Query pencarian minimal 2 karakter",
        },
      });
    }

    const limitNum = Math.min(parseInt(limit), 50);

    const stocks = await prisma.stock.findMany({
      where: {
        OR: [{ symbol: { contains: q.toUpperCase() } }, { name: { contains: q, mode: "insensitive" } }],
      },
      take: limitNum,
      select: {
        symbol: true,
        name: true,
        price: true,
        changePercent: true,
      },
    });

    res.json({
      success: true,
      data: serializeBigInt(stocks),
      meta: {
        query: q,
        found: stocks.length,
        showing: stocks.length,
      },
    });
  } catch (error) {
    console.error("Search stocks error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Terjadi kesalahan server",
      },
    });
  }
};

/**
 * Get stock history
 */
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to, interval = "daily" } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_PARAMETERS",
          message: "Parameter from dan to harus diisi (format: YYYY-MM-DD)",
        },
      });
    }

    const stock = await prisma.stock.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          code: "STOCK_NOT_FOUND",
          message: `Saham dengan symbol '${symbol}' tidak ditemukan`,
        },
      });
    }

    const history = await prisma.stockHistory.findMany({
      where: {
        stockId: stock.id,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
        open: true,
        high: true,
        low: true,
        close: true,
        volume: true,
      },
    });

    res.json({
      success: true,
      data: {
        symbol: stock.symbol,
        interval,
        prices: serializeBigInt(history),
      },
      meta: {
        from,
        to,
        count: history.length,
      },
    });
  } catch (error) {
    console.error("Get stock history error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Terjadi kesalahan server",
      },
    });
  }
};

/**
 * Get market summary
 */
const getMarketSummary = async (req, res) => {
  try {
    const [totalStocks, stockStats] = await Promise.all([
      prisma.stock.count(),
      prisma.stock.findMany({
        select: {
          changePercent: true,
          volume: true,
          value: true,
          foreignBuy: true,
          foreignSell: true,
        },
      }),
    ]);

    const advancing = stockStats.filter((s) => s.changePercent > 0).length;
    const declining = stockStats.filter((s) => s.changePercent < 0).length;
    const unchanged = stockStats.filter((s) => s.changePercent === 0).length;

    const totalVolume = stockStats.reduce((sum, s) => sum + Number(s.volume), 0);
    const totalValue = stockStats.reduce((sum, s) => sum + Number(s.value), 0);
    const foreignBuy = stockStats.reduce((sum, s) => sum + Number(s.foreignBuy || 0), 0);
    const foreignSell = stockStats.reduce((sum, s) => sum + Number(s.foreignSell || 0), 0);

    res.json({
      success: true,
      data: {
        ihsg: {
          value: 7234.56,
          change: 45.23,
          changePercent: 0.63,
        },
        totalStocks,
        advancing,
        declining,
        unchanged,
        totalVolume,
        totalValue,
        foreignBuy,
        foreignSell,
        foreignNet: foreignBuy - foreignSell,
        lastUpdate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Get market summary error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Terjadi kesalahan server",
      },
    });
  }
};


module.exports = {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getStockHistory,
  getMarketSummary,
};
