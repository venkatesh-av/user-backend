const express = require('express');
const { initializeDatabase } = require('./database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  startServer();
}

module.exports = app; 