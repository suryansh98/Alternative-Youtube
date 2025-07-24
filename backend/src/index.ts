import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import './auth/googleStrategy';
import authRoutes from './routes/authRoutes';
import youtubeRoutes from './routes/youtubeRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create session store
const FileStore = require('session-file-store')(session);

// Register middleware first
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true                // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new FileStore({
    path: './sessions',
    ttl: 86400,
    retries: 0
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,                    // Prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000       // 24 hours in milliseconds
  },
  rolling: true                        // Reset expiration on each request
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/youtube', youtubeRoutes);

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Alternative YouTube Backend API' });
});

// THEN start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
