import express from 'express';
const router = express.Router();
import Run from '../models/Run.js';
import NodeLog from '../models/NodeLog.js';
import runQueue from '../queues/runQueue.js';

// POST /api/runs/:workflowId - trigger a run
router.post('/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    const run = new Run({ workflowId });
    await run.save();

    await runQueue.add('execute-workflow', {
      runId: run._id,
      workflowId
    }, {
      attempts: 1, // No job-level retries per spec
      delay: 500
    });

    res.status(201).json(run);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/runs/:runId - get run status + all node logs
router.get('/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const run = await Run.findById(runId);
    if (!run) return res.status(404).json({ error: 'Run not found' });

    const nodeLogs = await NodeLog.find({ runId }).sort({ createdAt: 1 });

    res.json({
      run,
      nodeLogs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
