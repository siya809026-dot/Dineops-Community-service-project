import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/db.js';

import branchRoutes from './src/routes/branchRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import rawMaterialRoutes from './src/routes/rawMaterialRoutes.js';
import recipeRoutes from './src/routes/recipeRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import saleRoutes from './src/routes/saleRoutes.js';
import stockMovementRoutes from './src/routes/stockMovementRoutes.js';
import purchaseRoutes from './src/routes/purchaseRoutes.js';
import wastageRoutes from './src/routes/wastageRoutes.js';
import stockTransferRoutes from './src/routes/stockTransferRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import enquiryRoutes from './src/routes/enquiryRoutes.js';

dotenv.config();

const app = express();

// Render sits behind a proxy
app.set('trust proxy', 1);

// ---------- CORS ----------
// CLIENT_URL can hold one or more comma-separated frontend URLs.
const normalizeOrigin = (url) => url.trim().replace(/\/+$/, '');

const allowedOrigins = [
  ...(process.env.CLIENT_URL || '').split(','),
  'https://dineops-phi.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173'
]
  .map(normalizeOrigin)
  .filter(Boolean);

// Vercel preview deployments of this project (dineops-xxxx.vercel.app)
const vercelPreviewPattern = /^https:\/\/dineops[a-z0-9-]*\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow tools like Postman/curl (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use(express.json());

app.use('/api/branches', branchRoutes);
app.use('/api/products', productRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/wastage', wastageRoutes);
app.use('/api/stock-transfers', stockTransferRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DineOps Backend API is running!'
  });
});

// Health check (used by Render + uptime pingers)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`DineOps Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();