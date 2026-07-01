import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['http', 'transform', 'delay'], required: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
  retry: {
    maxRetries: { type: Number, default: 2 },
    retryDelayMs: { type: Number, default: 1000 }
  },
  position: {
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 }
  }
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true }
}, { _id: false });

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Workflow', workflowSchema);
