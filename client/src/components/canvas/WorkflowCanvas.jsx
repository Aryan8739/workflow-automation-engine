import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import HttpNode from './nodes/HttpNode';
import TransformNode from './nodes/TransformNode';
import DelayNode from './nodes/DelayNode';
import useWorkflowStore from '../../store/workflowStore';

export default function WorkflowCanvas() {
  const { nodes, edges, setNodes, setEdges, setSelectedNodeId } = useWorkflowStore();

  const nodeTypes = useMemo(() => ({
    http: HttpNode,
    transform: TransformNode,
    delay: DelayNode
  }), []);

  const onNodesChange = useCallback((changes) => {
    // React flow gives us changes. We manually apply them, 
    // but typically useNodesState does this.
    // For simplicity with Zustand, we can just map the changes or let React Flow handle it.
    // However, to keep store sync simple, we'll recreate the applyChanges logic or 
    // just rely on React Flow's onNodesChange callback pattern if we import it.
    // Wait, the instructions say to update store + call saveWorkflow.
    // The easiest way is to use `applyNodeChanges` and `applyEdgeChanges` from '@xyflow/react'
  }, []);

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
            onClick={() => {
              const newNode = {
                id: `node-${Date.now()}`,
                type: 'http',
                position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                data: { label: 'http', config: { method: 'GET', url: '' } }
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
                data: { label: 'transform', config: { code: '' } }
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
                data: { label: 'delay', config: { ms: 1000 } }
              };
              setNodes([...nodes, newNode]);
            }}
            className="border border-[#222] hover:border-[#d97706] hover:bg-[#d97706]/10 text-[#d97706] px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1"
          >
            <span>+ Delay</span>
          </button>
        </div>
      </div>

      <div className="pt-[52px] w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            // Need to manually apply node changes to Zustand, or just use applyNodeChanges
            import('@xyflow/react').then(({ applyNodeChanges }) => {
              setNodes(applyNodeChanges(changes, nodes));
            });
          }}
          onEdgesChange={(changes) => {
            import('@xyflow/react').then(({ applyEdgeChanges }) => {
              setEdges(applyEdgeChanges(changes, edges));
            });
          }}
          onConnect={(params) => setEdges(addEdge(params, edges))}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#1a1a1a]"
        >
          <Background color="#2a2a2a" gap={24} size={1.5} />
          <Controls className="!bg-[#1a1a1a] !border-[#333] !fill-gray-300" />
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
      </div>
    </div>
  );
}
