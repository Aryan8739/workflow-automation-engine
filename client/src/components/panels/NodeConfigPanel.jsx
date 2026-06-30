import useWorkflowStore from '../../store/workflowStore';

export default function NodeConfigPanel() {
  const { nodes, selectedNodeId, updateNodeConfig, deleteNode } = useWorkflowStore();

  const node = nodes.find(n => n.id === selectedNodeId);

  if (!node) {
    return (
      <div className="w-[320px] bg-[#0d0d0d] border-l border-[#1f1f1f] h-full p-4 flex items-center justify-center text-gray-500">
        Select a node to configure
      </div>
    );
  }

  const { type, data } = node;
  const config = data?.config || {};

  const handleChange = (key, value) => {
    updateNodeConfig(selectedNodeId, { [key]: value });
  };

  return (
    <div className="w-[320px] bg-[#0d0d0d] border-l border-[#1f1f1f] h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-[#1f1f1f]">
        <h2 className="text-lg font-bold capitalize">{type} Node Config</h2>
        <p className="text-xs text-gray-400 mt-1">ID: {selectedNodeId}</p>
      </div>

      <div className="p-4 flex-1 flex flex-col space-y-4">
        {type === 'http' && (
          <>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Method</label>
              <select
                value={config.method || 'GET'}
                onChange={(e) => handleChange('method', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">URL</label>
              <input
                type="text"
                value={config.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30"
                placeholder="https://api.example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Headers (JSON)</label>
              <textarea
                value={config.headers ? JSON.stringify(config.headers, null, 2) : ''}
                onChange={(e) => {
                  try {
                    handleChange('headers', e.target.value ? JSON.parse(e.target.value) : {});
                  } catch (err) {
                    // ignore parse errors while typing
                  }
                }}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30 h-24"
                placeholder="{}"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Body (JSON)</label>
              <textarea
                value={config.body ? JSON.stringify(config.body, null, 2) : ''}
                onChange={(e) => {
                  try {
                    handleChange('body', e.target.value ? JSON.parse(e.target.value) : {});
                  } catch (err) {
                    // ignore parse errors while typing
                  }
                }}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/30 h-24"
                placeholder="{}"
              />
            </div>
          </>
        )}

        {type === 'transform' && (
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Code snippet</label>
            <textarea
              value={config.code || ''}
              onChange={(e) => handleChange('code', e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 h-48"
              placeholder="return input.data.someField;"
            />
          </div>
        )}

        {type === 'delay' && (
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">Delay (ms)</label>
            <input
              type="number"
              value={config.ms || 0}
              onChange={(e) => handleChange('ms', parseInt(e.target.value))}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-1.5 text-[13px] font-mono focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30"
              placeholder="1000"
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1f1f1f] mt-auto">
        <button
          onClick={() => deleteNode(selectedNodeId)}
          className="w-full py-2 px-4 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium border border-red-500/20 transition-colors flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          <span>Delete Node</span>
        </button>
      </div>
    </div>
  );
}
