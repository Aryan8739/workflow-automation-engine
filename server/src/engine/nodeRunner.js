import NodeLog from '../models/NodeLog.js';
import httpHandler from './handlers/httpHandler.js';
import transformHandler from './handlers/transformHandler.js';
import delayHandler from './handlers/delayHandler.js';

const handlers = {
  http: httpHandler,
  transform: transformHandler,
  delay: delayHandler
};

async function nodeRunner(node, inputData, runId, io) {
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

  if (io && io.emit) {
    io.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'running' });
  }

  try {
    const outputData = await handler(node.config, inputData);
    
    const durationMs = Date.now() - startTime;
    nodeLog.status = 'done';
    nodeLog.output = outputData;
    nodeLog.durationMs = durationMs;
    nodeLog.attempts = 1;
    await nodeLog.save();

    if (io && io.emit) {
      io.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'done', output: outputData, durationMs });
    }

    return outputData;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    nodeLog.status = 'failed';
    nodeLog.error = error.message;
    nodeLog.durationMs = durationMs;
    nodeLog.attempts = 1;
    await nodeLog.save();

    if (io && io.emit) {
      io.emit(runId, 'nodeEvent', { runId, nodeId: node.id, status: 'failed', error: error.message, durationMs });
    }

    throw error;
  }
}

export default nodeRunner;
