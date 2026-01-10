const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Token autentikasi tidak ditemukan'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        apiKey: true,
        apiCalls: true,
        monthlyQuota: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token tidak valid'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token tidak valid'
        }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token sudah kadaluarsa'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Terjadi kesalahan server'
      }
    });
  }
};

/**
 * Middleware untuk cek role admin
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Akses ditolak. Hanya admin yang dapat mengakses endpoint ini'
      }
    });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin
};