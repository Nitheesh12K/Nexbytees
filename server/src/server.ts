import { createApp } from './app';
import { ENV } from './config/env';
import { prisma, checkDatabaseConnection } from './database/prisma';

async function bootstrap() {
  const app = createApp();

  const server = app.listen(ENV.PORT, async () => {
    console.log(`
=====================================================
🚀 NEXBYTEES Backend Engine Operational
🌐 URL:        ${ENV.APP_URL}
📡 API:        ${ENV.APP_URL}${ENV.API_PREFIX}
🔒 CORS:       ${ENV.SECURITY.CORS_ORIGIN}
📦 Mode:       ${ENV.NODE_ENV}
=====================================================
    `);

    const dbOnline = await checkDatabaseConnection();
    if (dbOnline) {
      console.log('✅ PostgreSQL Database: Connected & Operational');
    } else {
      console.warn('⚠️  PostgreSQL Database: Unreachable at configured DATABASE_URL.');
      console.warn('   To launch local PostgreSQL, run: docker compose up -d (in server directory)');
    }
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      await prisma.$disconnect();
      console.log('Database connection released.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
