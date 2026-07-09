import { useEffect, useRef } from 'react';
import useWorkflowStore from '../../store/workflowStore';
import api from '../../lib/api';

export default function LogDrawer({ isOpen, onClose }) {
  const { logs, activeRunId, setLogs, setNodeStatus, setNodeLog } = useWorkflowStore();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  useEffect(() => {
    if (isOpen && activeRunId) {
      api.get(`/runs/${activeRunId}`).then(({ data }) => {
        if (data && data.nodeLogs) {
          const fetchedLogs = data.nodeLogs.map(log => ({
            nodeId: log.nodeId,
            status: log.status,
            output: log.output,
            error: log.error,
            durationMs: log.durationMs,
            timestamp: log.createdAt
          }));
          setLogs(fetchedLogs);
          
          data.nodeLogs.forEach(log => {
            setNodeStatus(log.nodeId, log.status);
            if (log.status === 'done' || log.status === 'failed') {
              setNodeLog(log.nodeId, {
                output: log.output,
                error: log.error,
                durationMs: log.durationMs
              });
            }
          });
        }
      }).catch(err => console.error('Failed to fetch logs:', err));
    }
  }, [isOpen, activeRunId]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-[260px] shrink-0 bg-[#080808] border-t border-[#1f1f1f] flex flex-col shadow-2xl">
      <div className="flex justify-between items-center p-2 px-4 border-b border-[#1f1f1f] bg-[#0f0f0f]">
        <h3 className="font-bold text-sm text-gray-300">Run Logs</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        {logs.length === 0 && <div className="text-gray-500 italic">No logs yet...</div>}
        
        {logs.map((log, i) => (
          <div key={i} className="flex flex-col space-y-1 bg-[#111] p-3 rounded-lg border border-[#1f1f1f]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <span className="text-[#3b82f6] font-bold">{log.nodeId}</span>
                
                {log.status === 'running' && <span className="bg-[#facc15] text-black px-1.5 rounded text-[9px] font-bold tracking-wider">RUNNING</span>}
                {log.status === 'done' && <span className="bg-[#22c55e] text-black px-1.5 rounded text-[9px] font-bold tracking-wider">DONE</span>}
                {log.status === 'failed' && <span className="bg-[#ef4444] text-white px-1.5 rounded text-[9px] font-bold tracking-wider">FAILED</span>}
                {log.status === 'skipped' && <span className="bg-[#555] text-gray-200 px-1.5 rounded text-[9px] font-bold tracking-wider">SKIPPED</span>}
              </div>
              <div className="text-gray-500 text-[10px]">
                {log.durationMs ? `${log.durationMs}ms` : '—'}
              </div>
            </div>
            
            {log.output && (
              <div className="mt-1 pl-4 text-gray-300 whitespace-pre-wrap overflow-x-auto">
                {typeof log.output === 'object' ? JSON.stringify(log.output, null, 2) : String(log.output)}
              </div>
            )}
            
            {log.error && (
              <div className="mt-1 pl-4 text-red-400 whitespace-pre-wrap overflow-x-auto">
                {String(log.error)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
