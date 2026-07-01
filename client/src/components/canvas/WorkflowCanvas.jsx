import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useViewport,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import HttpNode from './nodes/HttpNode';
import TransformNode from './nodes/TransformNode';
import DelayNode from './nodes/DelayNode';
import useWorkflowStore from '../../store/workflowStore';
import RunHistory from '../history/RunHistory';

function ZoomCapsule() {
  const { zoom } = useViewport();
  const { zoomIn, zoomOut } = useReactFlow();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '60px',
        left: '20px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        borderRadius: '9999px',
        backgroundColor: '#111',
        border: '1px solid #333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontSize: '12px',
        fontWeight: 500,
        color: '#e5e7eb',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => zoomOut()}
        style={{
          padding: '6px 12px',
          background: 'none',
          border: 'none',
          borderRight: '1px solid #333',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9ca3af'; }}
      >
        −
      </button>
      <div style={{ padding: '6px 12px', minWidth: '50px', textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={() => zoomIn()}
        style={{
          padding: '6px 12px',
          background: 'none',
          border: 'none',
          borderLeft: '1px solid #333',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => { e.target.style.backgroundColor = '#2a2a2a'; e.target.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9ca3af'; }}
      >
        +
      </button>
    </div>
  );
}

function WorkflowCanvasInner() {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId } = useWorkflowStore();
  const [historyOpen, setHistoryOpen] = useState(false);

  const nodeTypes = useMemo(() => ({
    http: HttpNode,
    transform: TransformNode,
    delay: DelayNode
  }), []);

  return (
    <div className="w-full h-full relative bg-[#080808]">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 w-full h-[52px] bg-[#0f0f0f] border-b border-[#1f1f1f] flex items-center justify-between px-4 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border border-gray-500 rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
          </div>
          <h1 className="text-xs font-medium uppercase tracking-widest text-gray-400">Workflow Engine</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setHistoryOpen(!historyOpen)}
            className="border border-[#222] hover:border-gray-500 hover:bg-gray-500/10 text-gray-400 px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center mr-4"
          >
            History
          </button>
          <button 
            onClick={() => {
              const newNode = {
                id: `node-${Date.now()}`,
                type: 'http',
                position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                data: { label: 'http', config: { method: 'GET', url: '' }, retry: { maxRetries: 2, retryDelayMs: 1000 } }
              };
              setNodes([...nodes, newNode]);
            }}
            className="border border-[#222] hover:border-[#2563eb] hover:bg-[#2563eb]/10 text-[#2563eb] px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1"
          >
            <span>+ HTTP</span>
          </button>
          <button 
            onClick={() => {
              const newNode = {
                id: `node-${Date.now()}`,
                type: 'transform',
                position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                data: { label: 'transform', config: { code: '' }, retry: { maxRetries: 2, retryDelayMs: 1000 } }
              };
              setNodes([...nodes, newNode]);
            }}
            className="border border-[#222] hover:border-[#7c3aed] hover:bg-[#7c3aed]/10 text-[#7c3aed] px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1"
          >
            <span>+ Transform</span>
          </button>
          <button 
            onClick={() => {
              const newNode = {
                id: `node-${Date.now()}`,
                type: 'delay',
                position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                data: { label: 'delay', config: { ms: 1000 }, retry: { maxRetries: 2, retryDelayMs: 1000 } }
              };
              setNodes([...nodes, newNode]);
            }}
            className="border border-[#222] hover:border-[#d97706] hover:bg-[#d97706]/10 text-[#d97706] px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1"
          >
            <span>+ Delay</span>
          </button>
        </div>
      </div>

      <div className="pt-[52px] w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            import('@xyflow/react').then(({ applyNodeChanges }) => {
              setNodes(applyNodeChanges(changes, nodes));
            });
          }}
          onEdgesChange={(changes) => {
            import('@xyflow/react').then(({ applyEdgeChanges }) => {
              setEdges(applyEdgeChanges(changes, edges));
            });
          }}
          onConnect={(params) => setEdges(addEdge({ ...params, animated: true, style: { strokeDasharray: '4 4' } }, edges))}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ animated: true, style: { strokeDasharray: '4 4' } }}
          fitView
          className="bg-[#1a1a1a]"
        >
          <Background color="#2a2a2a" gap={24} size={1.5} />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.type) {
                case 'http': return '#3b82f6';
                case 'transform': return '#8b5cf6';
                case 'delay': return '#f59e0b';
                default: return '#eee';
              }
            }}
            className="!bg-[#1a1a1a] !border-[#333]"
            maskColor="rgba(0, 0, 0, 0.7)"
          />
        </ReactFlow>

        {/* Zoom Capsule - positioned outside ReactFlow to avoid clipping */}
        <ZoomCapsule />
        
        <RunHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      </div>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
