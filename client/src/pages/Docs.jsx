import Nav from '../components/Nav';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'quickstart', label: 'Quick start' },
  { id: 'nodes', label: 'Node types' },
  { id: 'execution', label: 'Execution model' },
  { id: 'conditions', label: 'Conditional branching' },
  { id: 'retries', label: 'Retries' },
  { id: 'runs', label: 'Run lifecycle' },
];

function Code({ children }) {
  return <code className="px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#242424] text-[12px] font-mono text-[#93c5fd]">{children}</code>;
}

function Block({ children }) {
  return (
    <pre className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg p-4 text-[12px] font-mono text-gray-300 overflow-x-auto my-3 whitespace-pre-wrap">
      {children}
    </pre>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-[200px_1fr] gap-10">
        {/* TOC */}
        <aside className="hidden md:block">
          <div className="sticky top-24 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">Documentation</p>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-400 hover:text-white py-1 transition">
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <article className="max-w-2xl space-y-12">
          <section id="overview" className="scroll-mt-20">
            <h1 className="text-3xl font-bold mb-3">Documentation</h1>
            <p className="text-gray-400 leading-relaxed">
              Workflow Engine is a workflow automation platform. You build a workflow as a directed graph of
              nodes on a canvas, then execute it: the engine topologically resolves the graph and runs
              independent branches <strong className="text-gray-200">in parallel</strong>, streaming each
              node's status back to the UI in real time.
            </p>
          </section>

          <section id="quickstart" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">Quick start</h2>
            <ol className="list-decimal list-inside text-gray-400 space-y-2 leading-relaxed">
              <li>Open the <strong className="text-gray-200">app</strong> and add nodes from the toolbar (HTTP, Transform, Delay, IF).</li>
              <li>Drag from a node's right handle to another node's left handle to connect them.</li>
              <li>Click a node to configure it in the right-hand panel.</li>
              <li>Press <Code>Execute</Code> and watch nodes light up. Open <Code>Logs</Code> to inspect each node's output.</li>
            </ol>
            <p className="text-gray-500 text-sm mt-3">
              Each node receives the output of the node before it as its <Code>input</Code>. A node with
              multiple incoming edges receives an array of its predecessors' outputs.
            </p>
          </section>

          <section id="nodes" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-4">Node types</h2>

            <div className="space-y-5">
              <div className="border-l-2 pl-4" style={{ borderColor: '#2563eb' }}>
                <h3 className="font-semibold text-white">HTTP</h3>
                <p className="text-sm text-gray-400 mt-1">Makes an HTTP request. Config: <Code>method</Code>, <Code>url</Code>, <Code>headers</Code>, <Code>body</Code>. Returns <Code>{'{ status, data }'}</Code>.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: '#7c3aed' }}>
                <h3 className="font-semibold text-white">Transform</h3>
                <p className="text-sm text-gray-400 mt-1">Runs a JavaScript snippet against <Code>input</Code> in a sandbox. Whatever you <Code>return</Code> becomes the node's output.</p>
                <Block>{`// input is the previous node's output\nreturn input.data.temperature;`}</Block>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: '#d97706' }}>
                <h3 className="font-semibold text-white">Delay</h3>
                <p className="text-sm text-gray-400 mt-1">Waits <Code>ms</Code> milliseconds, then passes through. Useful for pacing or simulating latency.</p>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: '#16a34a' }}>
                <h3 className="font-semibold text-white">IF (condition)</h3>
                <p className="text-sm text-gray-400 mt-1">Evaluates a JS expression against <Code>input</Code>. A truthy result takes the <Code>true</Code> branch; otherwise the <Code>false</Code> branch. The untaken branch is skipped.</p>
                <Block>{`input.age >= 18`}</Block>
              </div>
            </div>
          </section>

          <section id="execution" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">Execution model</h2>
            <p className="text-gray-400 leading-relaxed">
              The engine is a real concurrent DAG scheduler. Each node runs as soon as
              <em className="text-gray-200"> all</em> of its predecessors have finished — so two branches
              off the same node run at the same time, and a node that joins several branches (fan-in)
              waits for all of them and receives their outputs as an array.
            </p>
            <Block>{`fetch ─┬─► tempC ─┐\n       └─► wind  ─┴─► join ─► ...`}</Block>
            <p className="text-gray-500 text-sm">
              A cycle in the graph is rejected before execution. If a node fails, its downstream chain
              fails, but independent branches still finish; the run is then marked failed.
            </p>
          </section>

          <section id="conditions" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">Conditional branching</h2>
            <p className="text-gray-400 leading-relaxed">
              An <Code>IF</Code> node has two outputs, <Code>true</Code> and <Code>false</Code>. Connect each
              to a different downstream node. At run time the engine evaluates the expression and takes only
              the matching edge; nodes reachable only through the untaken edge are marked
              <Code>skipped</Code> and never execute.
            </p>
          </section>

          <section id="retries" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">Retries</h2>
            <p className="text-gray-400 leading-relaxed">
              Every node has <Code>maxRetries</Code> and <Code>retryDelayMs</Code> settings. On failure the
              node retries up to the limit with a delay between attempts, emitting a
              <Code>retrying</Code> status each time, before finally failing.
            </p>
          </section>

          <section id="runs" className="scroll-mt-20">
            <h2 className="text-xl font-bold mb-3">Run lifecycle</h2>
            <p className="text-gray-400 leading-relaxed">
              Triggering a run enqueues a job (BullMQ + Redis). A worker executes the graph, writes a log per
              node, and streams <Code>running / done / retrying / failed / skipped</Code> events over
              websockets. The run itself moves <Code>pending → running → completed / failed</Code>, and past
              runs are browsable in History.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
