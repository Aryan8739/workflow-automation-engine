import { Handle, Position } from '@xyflow/react';
import useWorkflowStore from '../../../store/workflowStore';
import { NODE_TYPES } from '../../../lib/nodeTypes';

const statusColors = {
  pending: 'bg-[#333]',
  running: 'bg-[#facc15] animate-pulse-amber',
  retrying: 'bg-[#f59e0b] animate-ping',
  done: 'bg-[#22c55e] animate-flash-green',
  failed: 'bg-[#ef4444]',
};

// One component for every node type — visuals differ only by the metadata
// looked up from NODE_TYPES (accent color, label, canvas summary line).
export default function BaseNode({ id, type, data }) {
  const { nodeStatuses, nodeLogs, setSelectedNodeId } = useWorkflowStore();
  const status = nodeStatuses[id] || 'pending';
  const log = nodeLogs[id];
  const meta = NODE_TYPES[type];

  return (
    <div
      className="bg-[#111] border border-[#222] rounded-lg min-w-[200px] h-[80px] shadow-lg flex cursor-pointer relative"
      onClick={() => setSelectedNodeId(id)}
    >
      {/* Retry badge - positioned above the node */}
      {status === 'retrying' && log?.attempt && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse"
          style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}
        >
          Retry {log.attempt}/{log.maxRetries}
        </div>
      )}

      {/* Accent border */}
      <div className="w-[3px] rounded-l-lg" style={{ backgroundColor: meta.accent }} />

      <div className="p-3 w-full relative overflow-hidden">
        {/* Status dot */}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[status]}`} />

        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.accent }} />
          <span className="text-[10px] tracking-widest text-gray-400 font-medium uppercase">{meta.label}</span>
        </div>
        <div className="mt-1.5 text-[13px] text-white truncate max-w-[170px]">
          {meta.summary(data?.config)}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 !border-transparent" style={{ backgroundColor: meta.accent }} />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !border-transparent" style={{ backgroundColor: meta.accent }} />
    </div>
  );
}
