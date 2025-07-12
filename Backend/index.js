// index.js
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';

// Load .env variables
config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(json()); // Body parser
app.use(morgan('dev'));
app.use(cookieParser());

// Route placeholders (we'll create them next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('StackIt API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http//localhost:${PORT}`);
});
