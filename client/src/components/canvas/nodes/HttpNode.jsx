import { Handle, Position } from '@xyflow/react';
import useWorkflowStore from '../../../store/workflowStore';

export default function HttpNode({ id, data }) {
  const { nodeStatuses, setSelectedNodeId } = useWorkflowStore();
  const status = nodeStatuses[id] || 'pending';
  
  const statusColors = {
    pending: 'bg-[#333]',
    running: 'bg-[#facc15] animate-pulse-amber',
    done: 'bg-[#22c55e] animate-flash-green',
    failed: 'bg-[#ef4444]'
  };

  return (
    <div 
      className="bg-[#111] border border-[#222] rounded-lg min-w-[200px] h-[80px] shadow-lg flex overflow-hidden cursor-pointer"
      onClick={() => setSelectedNodeId(id)}
    >
      {/* Accent border */}
      <div className="w-[3px] bg-[#2563eb]" />
      
      <div className="p-3 w-full relative">
        {/* Status dot */}
        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusColors[status]}`} />
        
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          <span className="text-[10px] tracking-widest text-gray-400 font-medium uppercase">HTTP</span>
        </div>
        <div className="mt-1.5 text-[13px] text-white truncate max-w-[170px]">
          {data?.config?.method || 'GET'} {data?.config?.url || 'No URL'}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#2563eb] !border-transparent" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-[#2563eb] !border-transparent" />
    </div>
  );
}
