import nodeRunner from './nodeRunner.js';
import dagExecutor from './dagExecutor.js';

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
      const incoming = preds.get(nodeId) || [];
      const predOutputs = await Promise.all(incoming.map((e) => run(e.source)));
      const input = mergeInputs(predOutputs);
      return nodeRunner(nodeMap.get(nodeId), input, runId, emitter);
    })();

    running.set(nodeId, promise);
    return promise;
  }

  const settled = await Promise.allSettled(nodes.map((n) => run(n.id)));
  const failed = settled.find((s) => s.status === 'rejected');
  if (failed) throw failed.reason;
}

function mergeInputs(outputs) {
  if (outputs.length === 0) return {};
  if (outputs.length === 1) return outputs[0];
  return outputs;
}
