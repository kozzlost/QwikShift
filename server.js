/**
 * QwikShift Backend Server * 
 * Main entry point for the Express.js backend server.
 * Handles API routing, database connections, and middleware setup.
 * 
 * Environment Variables Required:
 * - PORT: Server port (default: 3001)
 * - NODE_ENV: Environment (development/production)
 * - MONGODB_URI: MongoDB connection string
 * - JWT_SECRET: JWT signing secret
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Middleware Configuration
 */

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Database Connection
 */
const connectDB = async () => {
    try {
          const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/qwikshift';

      await mongoose.connect(mongoURL, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
      });

      console.log('✓ MongoDB Connected Successfully');
    } catch (error) {
          console.error('✗ MongoDB Connection Failed:', error.message);
          // Retry connection after 5 seconds
      setTimeout(connectDB, 5000);
    }
};

/**
 * API Routes
 */

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
});

// API v1 Routes
// app.use('/api/v1/auth', require('./api/auth'));
// app.use('/api/v1/jobs', require('./api/jobs'));
// app.use('/api/v1/users', require('./api/users'));
// app.use('/api/v1/workers', require('./api/workers'));
// app.use('/api/v1/payments', require('./api/payments'));
// app.use('/api/v1/analytics', require('./api/analytics'));

/**
 * Error Handling Middleware
 */

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
          error: 'Not Found',
          message: `The requested endpoint ${req.method} ${req.path} does not exist`,
          path: req.path,
          method: req.method
    });
});

// Error Handler
app.use((error, req, res, next) => {
    console.error('Error:', error);

          const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

          res.status(status).json({
                error: {
                        status,
                        message,
                        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
                }
          });
});

/**
 * Server Startup
 */

const startServer = async () => {
    try {
          // Connect to Database
      if (process.env.NODE_ENV !== 'test') {
              await connectDB();
      }

      // Start Express Server
      app.listen(PORT, () => {
              console.log(`\n🚀 Server running on http://localhost:${PORT}`);
              console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
              console.log(`🔗 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local/Fallback'}\n`);
      });
    } catch (error) {
          console.error('Failed to start server:', error);
          process.exit(1);
    }
};

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
    console.log('\n⚠️  SIGTERM received. Closing server gracefully...');
    try {
          await mongoose.connection.close();
          process.exit(0);
    } catch (error) {
          console.error('Error during graceful shutdown:', error);
          process.exit(1);
    }
});

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = app;
