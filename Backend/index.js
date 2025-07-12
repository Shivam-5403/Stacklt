// index.js
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import answerRoutes from './routes/answerRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

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
app.use(notFound);
app.use(errorHandler);


app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/notifications', notificationRoutes);


// Root route
app.get('/', (req, res) => {
    res.send('StackIt API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port http//localhost:${PORT}`);
});
