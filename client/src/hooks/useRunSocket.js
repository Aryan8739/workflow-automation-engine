import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useWorkflowStore from '../store/workflowStore';

export function useRunSocket(runId) {
  const { setNodeStatus, setNodeLog, addLog, setIsRunning } = useWorkflowStore();

  useEffect(() => {
    if (!runId) return;

    const socket = io('http://localhost:5050');

    const checkRunCompletion = () => {
      const state = useWorkflowStore.getState();
      const allCompleted = state.nodes.every(node => {
        const status = state.nodeStatuses[node.id];
        return status === 'done' || status === 'failed';
      });
      if (allCompleted) {
        state.setIsRunning(false);
      }
    };

    socket.on('connect', () => {
      socket.emit('joinRun', runId);
    });

    socket.on('nodeEvent', (data) => {
      setNodeStatus(data.nodeId, data.status);

      if (data.status === 'done' || data.status === 'failed') {
        setNodeLog(data.nodeId, {
          output: data.output,
          error: data.error,
          durationMs: data.durationMs
        });
      }

      addLog({
        nodeId: data.nodeId,
        status: data.status,
        output: data.output,
        error: data.error,
        durationMs: data.durationMs,
        timestamp: Date.now()
      });

      checkRunCompletion();
    });

    return () => {
      socket.disconnect();
    };
  }, [runId]);
}