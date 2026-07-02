import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../lib/api';
import useWorkflowStore from '../store/workflowStore';
import { toRFNode, toRFEdge, toApiNode, toApiEdge } from '../lib/workflowMap';

export function useWorkflow() {
  const [loading, setLoading] = useState(true);
  const { workflowId, setWorkflowId, setNodes, setEdges, nodes, edges } = useWorkflowStore();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    async function loadWorkflow() {
      try {
        const { data } = await api.get('/workflows');
        if (data && data.length > 0) {
          const wf = data[0]; // Take the first workflow
          setWorkflowId(wf._id);
          
          // Re-fetch the full workflow to get nodes and edges
          const fullWf = await api.get(`/workflows/${wf._id}`);

          setNodes((fullWf.data.nodes || []).map(toRFNode));
          setEdges((fullWf.data.edges || []).map(toRFEdge));
        }
      } catch (err) {
        console.error('Failed to load workflow:', err);
      } finally {
        setLoading(false);
        initialLoadDone.current = true;
      }
    }
    loadWorkflow();
  }, []);

  // Custom debounce for saving
  const timeoutRef = useRef(null);
  
  const saveWorkflow = useCallback((newNodes, newEdges) => {
    if (!workflowId) return;
    
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
        console.log('Workflow auto-saved');
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }, 800);
  }, [workflowId]);

  // Trigger save whenever nodes or edges change, but only after initial load
  useEffect(() => {
    if (initialLoadDone.current && workflowId) {
      saveWorkflow(nodes, edges);
    }
  }, [nodes, edges, workflowId, saveWorkflow]);

  return { workflowId, loading };
}
