import mongoose from 'mongoose';

const nodeLogSchema = new mongoose.Schema({
  runId: { type: mongoose.Schema.Types.ObjectId, ref: 'Run', required: true },
  nodeId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'running', 'done', 'failed'], default: 'pending' },
  input: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
  error: { type: String },
  durationMs: { type: Number },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('NodeLog', nodeLogSchema);
