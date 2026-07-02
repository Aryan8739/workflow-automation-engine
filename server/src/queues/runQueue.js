import { Queue } from 'bullmq';
import connection from './connection.js';

const runQueue = new Queue('runs', { connection });

export default runQueue;
