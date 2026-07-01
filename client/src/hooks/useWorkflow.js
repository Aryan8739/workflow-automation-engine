import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../lib/api';
import useWorkflowStore from '../store/workflowStore';

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
          
          // Map backend nodes config to React Flow expected format
          // React flow expects data object to contain our custom properties
          const formattedNodes = (fullWf.data.nodes || []).map(n => ({
            id: n.id,
            type: n.type,
            position: n.position || { x: Math.random() * 200, y: Math.random() * 200 },
            data: { label: n.type, config: n.config, retry: n.retry || { maxRetries: 2, retryDelayMs: 1000 } }
          }));
          
          const formattedEdges = (fullWf.data.edges || []).map((e, idx) => ({
            id: `e-${e.source}-${e.target}-${idx}`,
            source: e.source,
            target: e.target,
          }));

          setNodes(formattedNodes);
          setEdges(formattedEdges);
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
          nodes: newNodes.map(n => ({
            id: n.id,
            type: n.type,
            position: n.position,
            config: n.data?.config || {},
            retry: n.data?.retry || { maxRetries: 2, retryDelayMs: 1000 }
          })),
          edges: newEdges.map(e => ({
            source: e.source,
            target: e.target
          }))
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
