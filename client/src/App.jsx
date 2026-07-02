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
    <div className="w-screen min-h-screen bg-[#0f0f0f] text-gray-100 flex">
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas stays at full viewport height minus run bar and logs when open */}
        <div style={{ height: logsOpen ? 'calc(100vh - 56px - 260px)' : 'calc(100vh - 56px)' }} className="relative overflow-hidden isolate">
          <WorkflowCanvas />
        </div>
        {/* Run bar */}
        <RunPanel onToggleLogs={() => setLogsOpen(prev => !prev)} />
        {/* Log drawer extends page below */}
        <LogDrawer isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
      </div>

      {/* Right Sidebar */}
      <NodeConfigPanel />
      
    </div>
  );
}

export default App;
