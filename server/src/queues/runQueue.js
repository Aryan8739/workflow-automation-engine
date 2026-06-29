import { Queue  } from 'bullmq';
import IORedis from 'ioredis';

// Ensure dotenv is loaded if run standalone
import 'dotenv/config.js';

const connection = new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null, family: 4 });

connection.on('error', (err) => console.error('Redis connection error in runQueue:', err));
const runQueue = new Queue('runs', { connection });

export default runQueue;
