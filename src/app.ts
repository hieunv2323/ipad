import express from 'express';
import cors from 'cors';
import registrationRoutes from './routes/registration.routes';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Middleware to bind Cloudflare Worker env to Express req.env
app.use((req, _res, next) => {
  const context = (req as any).apiGateway?.context;
  if (context?.env) {
    req.env = context.env;
  } else if ((req as any).env) {
    req.env = (req as any).env;
  }
  next();
});

// Health check endpoint (GET /)
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Banana iPad Store API is running'
  });
});

// API Routes
app.use('/api', registrationRoutes);
app.use('/api', productRoutes);

// Global Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
