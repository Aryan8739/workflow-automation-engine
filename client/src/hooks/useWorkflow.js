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

  // Custom debounce for saving
  const timeoutRef = useRef(null);

  const saveWorkflow = useCallback((newNodes, newEdges) => {
    if (!workflowId || isGuest) return; // guest edits are sandboxed — never persisted

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const payload = {
          nodes: newNodes.map(toApiNode),
          edges: newEdges.map(toApiEdge),
        };
        await api.put(`/workflows/${workflowId}`, payload);
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }, 800);
  }, [workflowId, isGuest]);

  // Trigger save whenever nodes or edges change, but only after initial load
  useEffect(() => {
    if (initialLoadDone.current && workflowId) {
      saveWorkflow(nodes, edges);
    }
  }, [nodes, edges, workflowId, saveWorkflow]);

  return { workflowId, loading, isGuest };
}
