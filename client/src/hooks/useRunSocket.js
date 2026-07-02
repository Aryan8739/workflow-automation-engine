import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useWorkflowStore from '../store/workflowStore';

export function useRunSocket(runId) {
  const { setNodeStatus, setNodeLog, addLog, setIsRunning } = useWorkflowStore();

  useEffect(() => {
    if (!runId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050');

    socket.on('connect', () => {
      socket.emit('joinRun', runId);
    });

    socket.on('workflow-completed', () => {
      setIsRunning(false);
    });

    socket.on('workflow-failed', () => {
      setIsRunning(false);
    });

    socket.on('nodeEvent', (data) => {
      setNodeStatus(data.nodeId, data.status);

      if (data.status === 'retrying') {
        setNodeLog(data.nodeId, {
          attempt: data.attempt,
          maxRetries: data.maxRetries
        });
      }

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
        attempt: data.attempt,
        maxRetries: data.maxRetries,
        timestamp: Date.now()
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [runId]);
}