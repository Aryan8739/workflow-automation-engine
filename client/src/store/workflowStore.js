import { create } from 'zustand';

const useWorkflowStore = create((set) => ({
  workflowId: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  activeRunId: null,
  nodeStatuses: {},      // { nodeId: 'pending' | 'running' | 'done' | 'failed' }
  nodeLogs: {},          // { nodeId: { output, durationMs, error } }
  isRunning: false,
  logs: [],              // flat array of log events for LogDrawer


  setWorkflowId: (id) => set({ workflowId: id }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  
  updateNodeConfig: (nodeId, config) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } } : node
    )
  })),

  updateNodeRetry: (nodeId, retry) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, retry: { ...node.data.retry, ...retry } } } : node
    )
  })),

  deleteNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(n => n.id !== nodeId),
    edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
  })),

  setActiveRunId: (id) => set({ activeRunId: id }),
  
  setNodeStatus: (nodeId, status) => set((state) => ({
    nodeStatuses: { ...state.nodeStatuses, [nodeId]: status }
  })),

  setNodeLog: (nodeId, logData) => set((state) => ({
    nodeLogs: { ...state.nodeLogs, [nodeId]: { ...(state.nodeLogs[nodeId] || {}), ...logData } }
  })),

  setIsRunning: (bool) => set({ isRunning: bool }),

  
  addLog: (logEntry) => set((state) => ({
    logs: [...state.logs, logEntry]
  })),

  setLogs: (logs) => set({ logs }),

  
  clearRunState: () => set({
    activeRunId: null,
    nodeStatuses: {},
    nodeLogs: {},
    logs: [],
    isRunning: true
  })
}));

export default useWorkflowStore;
