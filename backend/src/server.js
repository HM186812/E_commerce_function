require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ [Database] SQLite Database connected successfully via Prisma');

    app.listen(PORT, () => {
      console.log(`🚀 [Server] Lao E-Commerce Backend running on http://localhost:${PORT}`);
      console.log(`📡 [API Health] http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ [Database Connection Error]:', error.message);
    process.exit(1);
  }
}

startServer();
