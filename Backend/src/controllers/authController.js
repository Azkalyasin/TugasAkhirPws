const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { generateApiKey } = require("../utils/apiKeyGenerator");

const prisma = new PrismaClient();

/**
 * Register user baru
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Nama, email, dan password harus diisi",
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "Password minimal 6 karakter",
        },
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: "EMAIL_EXISTS",
          message: "Email sudah terdaftar",
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate API key otomatis
    const apiKey = generateApiKey();

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        plan: "FREE",
        apiKey,
        monthlyQuota: 1000,
        dailyQuota: 100,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        apiKey: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
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
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_FIELDS",
          message: "Email dan password harus diisi",
        },
      });
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email atau password salah",
        },
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Email atau password salah",
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        apiKey: true,
        apiCalls: true,
        monthlyQuota: true,
        dailyQuota: true,
        lastReset: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
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
 * Generate atau regenerate API key
 */
const regenerateApiKey = async (req, res) => {
  try {
    const newApiKey = generateApiKey();

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        apiKey: newApiKey,
      },
      select: {
        id: true,
        apiKey: true,
      },
    });

    res.json({
      success: true,
      message: "API Key berhasil di-generate",
      data: {
        apiKey: user.apiKey,
      },
    });
  } catch (error) {
    console.error("Regenerate API key error:", error);
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
  register,
  login,
  getProfile,
  regenerateApiKey,
};
