require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3004,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  
};