import { Worker } from 'bullmq';
import Workflow from '../models/Workflow.js';
import Run from '../models/Run.js';
import executeGraph from '../engine/executeGraph.js';
import socketEmitter from '../socket/emitter.js';
import connection from '../queues/connection.js';

const runWorker = new Worker('runs', async (job) => {
  const { runId, workflowId } = job.data;

  const run = await Run.findById(runId);
  if (!run) throw new Error('Run not found');

  const workflow = await Workflow.findById(workflowId);
  if (!workflow) {
    run.status = 'failed';
    run.completedAt = new Date();
    await run.save();
    throw new Error('Workflow not found');
  }

  run.status = 'running';
  run.startedAt = new Date();
  await run.save();

  try {
    await executeGraph(workflow, runId, socketEmitter);

    run.status = 'completed';
    run.completedAt = new Date();
    await run.save();
    socketEmitter.emit(runId, 'workflow-completed', { runId });
  } catch (error) {
    run.status = 'failed';
    run.completedAt = new Date();
    await run.save();
    socketEmitter.emit(runId, 'workflow-failed', { runId, error: error.message });
    // Re-throw so BullMQ marks job as failed
    throw error;
  }
}, { connection });

runWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error ${err.message}`);
});

export default runWorker;
