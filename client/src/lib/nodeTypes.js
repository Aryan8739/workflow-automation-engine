// Single source of truth for the three node types: their accent color,
// display label, default config (used when adding a node), and the short
// summary line rendered on the canvas card.

export const NODE_TYPES = {
  http: {
    accent: '#2563eb',
    label: 'HTTP',
    defaults: { method: 'GET', url: '' },
    summary: (config) => `${config?.method || 'GET'} ${config?.url || 'No URL'}`,
  },
  transform: {
    accent: '#7c3aed',
    label: 'TRANSFORM',
    defaults: { code: '' },
    summary: (config) => (config?.code ? 'JS Snippet' : 'No Code'),
  },
  delay: {
    accent: '#d97706',
    label: 'DELAY',
    defaults: { ms: 1000 },
    summary: (config) => (config?.ms ? `${config.ms} ms` : '0 ms'),
  },
};

export const DEFAULT_RETRY = { maxRetries: 2, retryDelayMs: 1000 };
