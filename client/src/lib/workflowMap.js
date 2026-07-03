import { DEFAULT_RETRY } from './nodeTypes';

// Translate between the backend workflow shape (flat config/retry) and the
// React Flow shape (custom props nested under `data`).

export const toRFNode = (n) => ({
  id: n.id,
  type: n.type,
  position: n.position || { x: Math.random() * 200, y: Math.random() * 200 },
  data: { label: n.type, config: n.config, retry: n.retry || { ...DEFAULT_RETRY } },
});

export const toRFEdge = (e, idx) => ({
  id: `e-${e.source}-${e.target}-${idx}`,
  source: e.source,
  target: e.target,
  sourceHandle: e.sourceHandle ?? null,
});

export const toApiNode = (n) => ({
  id: n.id,
  type: n.type,
  position: n.position,
  config: n.data?.config || {},
  retry: n.data?.retry || { ...DEFAULT_RETRY },
});

export const toApiEdge = (e) => ({ source: e.source, target: e.target, sourceHandle: e.sourceHandle ?? null });
