import mongoose from 'mongoose';

const runSchema = new mongoose.Schema({
  workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
  startedAt: { type: Date },
  completedAt: { type: Date }
});

export default mongoose.model('Run', runSchema);
