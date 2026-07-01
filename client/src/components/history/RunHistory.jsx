import { useEffect } from 'react';
import useWorkflowStore from '../../store/workflowStore';
import { useRunHistory } from '../../hooks/useRunHistory';

export default function RunHistory({ isOpen, onClose }) {
  const { workflowId } = useWorkflowStore();
  const { history, loading, fetchHistory } = useRunHistory();

  useEffect(() => {
    if (isOpen && workflowId) {
      fetchHistory(workflowId);
    }
  }, [isOpen, workflowId]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-[52px] left-0 w-[280px] bottom-[56px] bg-[#0d0d0d] border-r border-[#1f1f1f] shadow-2xl flex flex-col z-20 transition-transform">
      <div className="flex items-center justify-between p-4 border-b border-[#1f1f1f]">
        <h2 className="text-sm font-bold tracking-wider uppercase text-gray-300">Run History</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading && <div className="text-xs text-gray-500 text-center mt-4">Loading history...</div>}
        
        {!loading && history.length === 0 && (
          <div className="text-xs text-gray-500 text-center mt-4">No past runs found.</div>
        )}

        {!loading && history.map(run => {
          const isFailed = run.status === 'failed';
          const isCompleted = run.status === 'completed';
          
          let statusBadge = 'bg-gray-500/15 text-gray-400';
          if (isFailed) statusBadge = 'bg-red-500/15 text-red-500';
          if (isCompleted) statusBadge = 'bg-green-500/15 text-green-500';

          const started = new Date(run.startedAt);
          const diffMin = Math.round((Date.now() - started) / 60000);
          const relativeTime = diffMin < 1 ? 'Just now' : `${diffMin} min ago`;

          return (
            <div 
              key={run._id}
              className="bg-[#111] border border-[#222] p-3 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm ${statusBadge}`}>
                  {run.status}
                </span>
                <span className="text-[10px] text-gray-500">{relativeTime}</span>
              </div>
              <div className="text-xs text-gray-300 font-mono mb-1">
                Duration: {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '-'}
              </div>
              <div className="text-[11px] text-gray-500">
                {run.nodesSucceeded}/{run.totalNodes} nodes succeeded
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
