import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../lib/api';
import useWorkflowStore from '../store/workflowStore';
import useAuthStore from '../store/authStore';
import { toRFNode, toRFEdge, toApiNode, toApiEdge } from '../lib/workflowMap';

export function useWorkflow() {
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);
  const { workflowId, setWorkflowId, setNodes, setEdges, nodes, edges } = useWorkflowStore();
  const initialLoadDone = useRef(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    async function loadWorkflow() {
      initialLoadDone.current = false;
      setLoading(true);
      try {
        if (token) {
          const { data: owned } = await api.get('/workflows');
          let wf = owned[0];
          if (!wf) {
            const { data: demo } = await api.get('/workflows/demo');
            const { data: created } = await api.post('/workflows', {
              name: demo.name,
              nodes: demo.nodes,
              edges: demo.edges,
            });
            wf = created;
          }
          const fullWf = wf.nodes ? { data: wf } : await api.get(`/workflows/${wf._id}`);
          setWorkflowId(wf._id);
          setNodes((fullWf.data.nodes || []).map(toRFNode));
          setEdges((fullWf.data.edges || []).map(toRFEdge));
          setIsGuest(false);
        } else {
          const { data: demo } = await api.get('/workflows/demo');
          setWorkflowId(demo._id);
          setNodes((demo.nodes || []).map(toRFNode));
          setEdges((demo.edges || []).map(toRFEdge));
          setIsGuest(true);
        }
      } catch (err) {
        console.error('Failed to load workflow:', err);
      } finally {
        setLoading(false);
        initialLoadDone.current = true;
      }
    }
    loadWorkflow();
  }, [token, setWorkflowId, setNodes, setEdges]);

  const timeoutRef = useRef(null);
  const pendingRef = useRef(null);

  const flushPending = useCallback(() => {
    if (!pendingRef.current) return;
    const { workflowId: id, payload } = pendingRef.current;
    pendingRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const token = localStorage.getItem('wfe_token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
    fetch(`${baseURL}/workflows/${id}`, {
      method: 'PUT',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.error('Failed to flush workflow save:', err));
  }, []);

  const saveWorkflow = useCallback((newNodes, newEdges) => {
    if (!workflowId || isGuest) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const payload = {
      nodes: newNodes.map(toApiNode),
      edges: newEdges.map(toApiEdge),
    };
    pendingRef.current = { workflowId, payload };

    timeoutRef.current = setTimeout(async () => {
      try {
        await api.put(`/workflows/${workflowId}`, payload);
        pendingRef.current = null;
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }, 800);
  }, [workflowId, isGuest]);

  useEffect(() => {
    if (initialLoadDone.current && workflowId) {
      saveWorkflow(nodes, edges);
    }
  }, [nodes, edges, workflowId, saveWorkflow]);

  useEffect(() => {
    const handleHide = () => flushPending();
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flushPending();
    };
    window.addEventListener('beforeunload', handleHide);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleHide);
      document.removeEventListener('visibilitychange', handleVisibility);
      flushPending();
    };
  }, [flushPending]);

  return { workflowId, loading, isGuest };
}
