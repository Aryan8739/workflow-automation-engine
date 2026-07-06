import { useState } from 'react';
import WorkflowCanvas from '../components/canvas/WorkflowCanvas';
import NodeConfigPanel from '../components/panels/NodeConfigPanel';
import RunPanel from '../components/panels/RunPanel';
import LogDrawer from '../components/logs/LogDrawer';
import SandboxBanner from '../components/SandboxBanner';
import { useWorkflow } from '../hooks/useWorkflow';
import { useRunSocket } from '../hooks/useRunSocket';
import useWorkflowStore from '../store/workflowStore';

const BANNER_HEIGHT = 33;

export default function AppPage() {
  const { loading, isGuest } = useWorkflow();
  const { activeRunId } = useWorkflowStore();

  useRunSocket(activeRunId);

  const [logsOpen, setLogsOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#0f0f0f] flex items-center justify-center text-gray-400">
        Loading Workflow...
      </div>
    );
  }

  const canvasHeight = `calc(100vh - 56px${isGuest ? ` - ${BANNER_HEIGHT}px` : ''}${logsOpen ? ' - 260px' : ''})`;

  return (
    <div className="w-screen min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">
      {isGuest && <SandboxBanner />}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div style={{ height: canvasHeight }} className="relative overflow-hidden isolate">
            <WorkflowCanvas />
          </div>
          <RunPanel onToggleLogs={() => setLogsOpen(prev => !prev)} />
          <LogDrawer isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
        </div>

        <NodeConfigPanel />
      </div>
    </div>
  );
}
