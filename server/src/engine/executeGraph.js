import nodeRunner from './nodeRunner.js';
import dagExecutor from './dagExecutor.js';
import NodeLog from '../models/NodeLog.js';

export default async function executeGraph(workflow, runId, emitter) {
  const { nodes = [], edges = [] } = workflow;

  dagExecutor(workflow);

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const preds = new Map(nodes.map((n) => [n.id, []]));
  for (const edge of edges) {
    if (preds.has(edge.target)) preds.get(edge.target).push(edge);
  }

  const running = new Map();

  function run(nodeId) {
    if (running.has(nodeId)) return running.get(nodeId);

    const promise = (async () => {
      const node = nodeMap.get(nodeId);
      const incoming = preds.get(nodeId) || [];

      const predResults = await Promise.all(
        incoming.map(async (edge) => ({ edge, result: await run(edge.source) }))
      );

      const active = predResults.filter(
        ({ edge, result }) => !result.skipped && isEdgeTaken(edge, nodeMap.get(edge.source), result.output)
      );

      if (incoming.length > 0 && active.length === 0) {
        await NodeLog.create({ runId, nodeId, status: 'skipped' });
        emitter.emit(runId, 'nodeEvent', { runId, nodeId, status: 'skipped' });
        return { skipped: true };
      }

      const input = mergeInputs(active.map((a) => a.result.output));
      const output = await nodeRunner(node, input, runId, emitter);
      return { output, skipped: false };
    })();

    running.set(nodeId, promise);
    return promise;
  }

  const settled = await Promise.allSettled(nodes.map((n) => run(n.id)));
  const failed = settled.find((s) => s.status === 'rejected');
  if (failed) throw failed.reason;
}

function isEdgeTaken(edge, sourceNode, sourceOutput) {
  if (sourceNode?.type !== 'condition') return true;
  return edge.sourceHandle === sourceOutput?.branch;
}

function mergeInputs(outputs) {
  if (outputs.length === 0) return {};
  if (outputs.length === 1) return outputs[0];
  return outputs;
}
