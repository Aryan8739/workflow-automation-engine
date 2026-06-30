import { useState } from 'react';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeConfigPanel from './components/panels/NodeConfigPanel';
import RunPanel from './components/panels/RunPanel';
import LogDrawer from './components/logs/LogDrawer';
import { useWorkflow } from './hooks/useWorkflow';
import { useRunSocket } from './hooks/useRunSocket';
import useWorkflowStore from './store/workflowStore';

function App() {
  const { loading } = useWorkflow();
  const { activeRunId } = useWorkflowStore();
  
  // Listen for socket events if a run is active
  useRunSocket(activeRunId);

  const [logsOpen, setLogsOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#0f0f0f] flex items-center justify-center text-gray-400">
        Loading Workflow...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#0f0f0f] text-gray-100 flex overflow-hidden">
      
      {/* Main Canvas Area */}
      <div className="flex-1 relative h-full">
        <WorkflowCanvas />
        <LogDrawer isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
        <RunPanel onToggleLogs={() => setLogsOpen(!logsOpen)} />
      </div>

      {/* Right Sidebar */}
      <NodeConfigPanel />
      
    </div>
  );
}

export default App;
