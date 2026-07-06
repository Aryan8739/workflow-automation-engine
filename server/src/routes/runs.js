import express from 'express';
const router = express.Router();
import Run from '../models/Run.js';
import NodeLog from '../models/NodeLog.js';
import Workflow from '../models/Workflow.js';
import runQueue from '../queues/runQueue.js';
import { optionalAuth } from '../middleware/auth.js';

// POST /api/runs/:workflowId - trigger a run
router.post('/:workflowId', optionalAuth, async (req, res) => {
  try {
    const { workflowId } = req.params;

    const workflow = await Workflow.findById(workflowId).select('owner');
    if (!workflow) return res.status(404).json({ error: 'Workflow not found' });
    if (workflow.owner && (!req.userId || workflow.owner.toString() !== req.userId)) {
      return res.status(403).json({ error: 'Not authorized to run this workflow' });
    }

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

// GET /api/runs?workflowId=xxx
router.get('/', async (req, res) => {
  try {
    const { workflowId } = req.query;
    if (!workflowId) return res.status(400).json({ error: 'workflowId query parameter is required' });

    const runs = await Run.find({ workflowId }).sort({ startedAt: -1 }).lean();
    
    // For each run, get aggregated NodeLog data
    const runIds = runs.map(r => r._id);
    const logs = await NodeLog.find({ runId: { $in: runIds } }).lean();

    const result = runs.map(run => {
      const runLogs = logs.filter(l => l.runId.toString() === run._id.toString());
      const nodesSucceeded = runLogs.filter(l => l.status === 'done').length;
      const nodesFailed = runLogs.filter(l => l.status === 'failed').length;
      
      let durationMs = 0;
      if (run.startedAt && run.completedAt) {
        durationMs = new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
      } else {
        // Fallback to summing up individual log duration if complete times aren't fully accurate
        durationMs = runLogs.reduce((acc, l) => acc + (l.durationMs || 0), 0);
      }

      return {
        _id: run._id,
        status: run.status,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        durationMs,
        nodesSucceeded,
        nodesFailed,
        totalNodes: runLogs.length
      };
    });

    res.json(result);
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
