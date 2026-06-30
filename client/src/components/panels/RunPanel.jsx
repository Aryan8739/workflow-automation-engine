import { useState } from 'react';
import useWorkflowStore from '../../store/workflowStore';
import api from '../../lib/api';

export default function RunPanel({ onToggleLogs }) {
  const { workflowId, isRunning, setIsRunning, activeRunId, setActiveRunId, clearRunState, nodeStatuses } = useWorkflowStore();

  const handleRun = async () => {
    if (!workflowId || isRunning) return;
    
    clearRunState();
    setIsRunning(true);

    try {
      const { data } = await api.post(`/runs/${workflowId}`);
      setActiveRunId(data._id);
    } catch (err) {
      console.error('Failed to trigger run:', err);
      setIsRunning(false);
    }
  };

  // Determine overall status based on nodeStatuses
  const statuses = Object.values(nodeStatuses);
  let overallStatus = 'Idle';
  let badgeColor = 'bg-gray-700';

  if (isRunning) {
    overallStatus = 'Running';
    badgeColor = 'bg-yellow-500';
  } else if (activeRunId) {
    if (statuses.includes('failed')) {
      overallStatus = 'Failed';
      badgeColor = 'bg-red-500';
    } else if (statuses.length > 0 && statuses.every(s => s === 'done')) {
      overallStatus = 'Completed';
      badgeColor = 'bg-green-500';
    } else {
      overallStatus = 'Finished';
      badgeColor = 'bg-gray-500';
    }
  }

  return (
    <div className="w-full h-[56px] bg-[#090909] border-t border-[#1f1f1f] flex items-center justify-between px-6 z-20 absolute bottom-0 left-0">
      <div className="flex items-center space-x-3 w-1/3">
        <span className="text-sm text-gray-400">Run Status:</span>
        <div className={`px-2 py-0.5 rounded text-xs font-bold text-white ${badgeColor}`}>
          {overallStatus}
        </div>
        {activeRunId && <span className="text-xs text-gray-500 font-mono">{activeRunId}</span>}
      </div>

      <div className="flex justify-center w-1/3">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`px-6 py-1.5 rounded-full text-sm font-bold transition flex items-center space-x-1.5 ${isRunning ? 'border border-[#333] text-gray-500 cursor-not-allowed animate-pulse' : 'bg-[#2563eb] text-white hover:bg-blue-500'}`}
        >
          {!isRunning && <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-white border-b-4 border-b-transparent" />}
          <span>{isRunning ? 'Running...' : 'Execute'}</span>
        </button>
      </div>

      <div className="flex justify-end w-1/3">
        <button
          onClick={onToggleLogs}
          className="px-4 py-1.5 text-xs font-medium text-gray-400 border border-transparent hover:border-[#222] hover:bg-[#1a1a1a] rounded-full transition"
        >
          Logs
        </button>
      </div>
    </div>
  );
}
