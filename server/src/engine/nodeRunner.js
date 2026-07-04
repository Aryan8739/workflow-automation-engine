import NodeLog from '../models/NodeLog.js';
import httpHandler from './handlers/httpHandler.js';
import transformHandler from './handlers/transformHandler.js';
import delayHandler from './handlers/delayHandler.js';
import conditionHandler from './handlers/conditionHandler.js';

const handlers = {
  http: httpHandler,
  transform: transformHandler,
  delay: delayHandler,
  condition: conditionHandler
};

async function nodeRunner(node, inputData, runId, emitter) {
  const handler = handlers[node.type];
  if (!handler) {
    throw new Error(`Unknown node type: ${node.type}`);
  }

  const startTime = Date.now();

  let nodeLog = await NodeLog.create({
    runId,
    nodeId: node.id,
    status: 'running',
    input: inputData
  });

  emitter.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'running' });

  let attempt = 0;
  const maxRetries = node.retry?.maxRetries ?? 2;
  const retryDelayMs = node.retry?.retryDelayMs || 1000;

  while (attempt <= maxRetries) {
    try {
      const outputData = await handler(node.config, inputData);

      const durationMs = Date.now() - startTime;
      nodeLog.status = 'done';
      nodeLog.output = outputData;
      nodeLog.durationMs = durationMs;
      nodeLog.attempts = attempt + 1;
      await nodeLog.save();

      emitter.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'done', output: outputData, durationMs });

      return outputData;
    } catch (error) {
      attempt++;
      
      if (attempt > maxRetries) {
        const durationMs = Date.now() - startTime;
        nodeLog.status = 'failed';
        nodeLog.error = error.message;
        nodeLog.durationMs = durationMs;
        nodeLog.attempts = attempt;
        await nodeLog.save();

        emitter.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'failed', error: error.message, durationMs });

        throw error;
      } else {
        emitter.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'retrying', attempt, maxRetries });
        nodeLog.attempts = attempt;
        await nodeLog.save();
        
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
  }
}

export default nodeRunner;
