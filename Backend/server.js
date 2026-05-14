import "dotenv/config";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://modern-masonry-group.vercel.app',
];

// Trust the first hop (Vercel / reverse proxy) so req.ip is the real client IP
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (same-origin, curl, Postman in dev)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '16kb' }));

const quoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Routes
app.use('/api/quotes', quoteLimiter);
app.use('/api', apiLimiter, routes);

// Global error handler — catches any unhandled error from routes/middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
