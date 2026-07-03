import IORedis from 'ioredis';
import 'dotenv/config';

// Shared Redis connection for BullMQ (queue producer + worker consumer).
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  family: 4,
});

connection.on('error', (err) => console.error('Redis connection error:', err));

export default connection;
