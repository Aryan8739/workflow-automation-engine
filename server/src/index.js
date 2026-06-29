import 'dotenv/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cors from 'cors';

import emitter from './socket/emitter.js';
import workflowsRouter from './routes/workflows.js';
import runsRouter from './routes/runs.js';

// Import the worker so it starts listening to the queue
import './workers/runWorker.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', workflowsRouter);
app.use('/api/runs', runsRouter);

// Socket.io
emitter.setIO(io);
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('joinRun', (runId) => {
    socket.join(runId.toString());
    console.log(`Socket ${socket.id} joined room ${runId}`);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
