import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useWorkflowStore from '../store/workflowStore';

export function useRunSocket(runId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!runId) return;

    // Prevent duplicate connections for the same runId
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const { setNodeStatus, setNodeLog, addLog, setIsRunning } = useWorkflowStore.getState();

    let disposed = false;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050', {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      if (!disposed) socket.emit('joinRun', runId);
    });

    socket.on('workflow-completed', () => {
      if (!disposed) {
        setIsRunning(false);
        socket.disconnect();
      }
    });

    socket.on('workflow-failed', () => {
      if (!disposed) {
        setIsRunning(false);
        socket.disconnect();
      }
    });

    socket.on('nodeEvent', (data) => {
      if (disposed) return;

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
      disposed = true;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [runId]);
}