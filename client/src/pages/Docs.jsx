import { useState, useEffect } from 'react';
import { BookOpen, Rocket, Component, Zap, GitBranch, RefreshCcw, Activity, ChevronRight, Hash } from 'lucide-react';
import Nav from '../components/Nav';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'quickstart', label: 'Quick start', icon: <Rocket className="w-4 h-4" /> },
  { id: 'nodes', label: 'Node types', icon: <Component className="w-4 h-4" /> },
  { id: 'execution', label: 'Execution model', icon: <Zap className="w-4 h-4" /> },
  { id: 'conditions', label: 'Conditional branching', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'retries', label: 'Retries', icon: <RefreshCcw className="w-4 h-4" /> },
  { id: 'runs', label: 'Run lifecycle', icon: <Activity className="w-4 h-4" /> },
];

function Code({ children }) {
  return <code className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[13px] font-mono text-blue-300">{children}</code>;
}

function Block({ children }) {
  return (
    <pre className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-5 text-[13px] font-mono text-gray-300 overflow-x-auto my-4 whitespace-pre-wrap shadow-xl shadow-black/50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </pre>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 font-sans selection:bg-blue-500/30 pb-20">
      <Nav />

      <div className="max-w-7xl mx-auto px-6 pt-12 grid lg:grid-cols-[260px_1fr] gap-16 relative">
        {/* TOC Sidebar */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-28">
            <div className="mb-6 flex items-center space-x-2 px-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h2 className="text-sm font-bold text-white tracking-wide">Documentation</h2>
            </div>
            
            <nav className="space-y-1 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/5" />
              
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                    activeSection === s.id
                      ? 'bg-blue-500/10 text-blue-400 font-medium'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <div className={`relative z-10 bg-[#030303] rounded-full transition-colors ${activeSection === s.id ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                    {s.icon}
                  </div>
                  <span>{s.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="max-w-3xl space-y-24 relative">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <section id="overview" className="scroll-mt-32">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-6 flex items-center group">
              <Hash className="w-6 h-6 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Overview
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Workflow Engine is a powerful automation platform designed for complex logic. You build a workflow as a directed graph of nodes on a canvas, then execute it. The engine topologically resolves the graph and runs independent branches <strong className="text-blue-400 font-semibold">in parallel</strong>, streaming each node's status back to the UI in real time.
            </p>
          </section>

          <section id="quickstart" className="scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Quick start
            </h2>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-xl">
              <ol className="space-y-6">
                {[
                  'Open the app and add nodes from the toolbar (HTTP, Transform, Delay, IF).',
                  'Drag from a node\'s right handle to another node\'s left handle to connect them.',
                  'Click a node to configure it in the right-hand panel.',
                  'Press Execute and watch nodes light up. Open Logs to inspect each node\'s output.'
                ].map((step, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/20 mr-4">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 leading-relaxed pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 flex items-start space-x-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong className="text-gray-300">Data flow:</strong> Each node receives the output of the node before it as its <Code>input</Code>. A node with multiple incoming edges receives an array of its predecessors' outputs.
              </p>
            </div>
          </section>

          <section id="nodes" className="scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Node types
            </h2>

            <div className="grid gap-6">
              <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r" />
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    HTTP
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">Makes an HTTP request. Config: <Code>method</Code>, <Code>url</Code>, <Code>headers</Code>, <Code>body</Code>.</p>
                  <div className="text-sm text-gray-500">Returns: <Code>{'{ status, data }'}</Code></div>
                </div>
              </div>

              <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-purple-500 rounded-r" />
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    Transform
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">Runs a JavaScript snippet against <Code>input</Code> in a sandbox. Whatever you <Code>return</Code> becomes the node's output.</p>
                  <Block>{`// input is the previous node's output\nreturn input.data.temperature;`}</Block>
                </div>
              </div>

              <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-amber-500/50 transition-colors">
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-amber-500 rounded-r" />
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    Delay
                  </h3>
                  <p className="text-gray-400 leading-relaxed">Waits <Code>ms</Code> milliseconds, then passes through. Useful for pacing or simulating latency.</p>
                </div>
              </div>

              <div className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-emerald-500 rounded-r" />
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    IF (condition)
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-4">Evaluates a JS expression against <Code>input</Code>. A truthy result takes the <Code>true</Code> branch; otherwise the <Code>false</Code> branch. The untaken branch is skipped.</p>
                  <Block>{`input.age >= 18`}</Block>
                </div>
              </div>
            </div>
          </section>

          <section id="execution" className="scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Execution model
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              The engine is a real concurrent DAG scheduler. Each node runs as soon as
              <strong className="text-gray-200"> all</strong> of its predecessors have finished — so two branches
              off the same node run at the same time, and a node that joins several branches (fan-in)
              waits for all of them and receives their outputs as an array.
            </p>
            <Block>{`fetch ─┬─► tempC ─┐\n       └─► wind  ─┴─► join ─► ...`}</Block>
            <p className="text-gray-500 mt-4 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
              A cycle in the graph is rejected before execution. If a node fails, its downstream chain
              fails, but independent branches still finish; the run is then marked failed.
            </p>
          </section>

          <section id="conditions" className="scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Conditional branching
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              An <Code>IF</Code> node has two outputs, <Code>true</Code> and <Code>false</Code>. Connect each
              to a different downstream node. At run time the engine evaluates the expression and takes only
              the matching edge; nodes reachable only through the untaken edge are marked
              <Code>skipped</Code> and never execute.
            </p>
          </section>

          <section id="retries" className="scroll-mt-32">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Retries
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              Every node has <Code>maxRetries</Code> and <Code>retryDelayMs</Code> settings. On failure the
              node retries up to the limit with a delay between attempts, emitting a
              <Code>retrying</Code> status each time, before finally failing.
            </p>
          </section>

          <section id="runs" className="scroll-mt-32 border-b border-white/10 pb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 flex items-center group">
              <Hash className="w-5 h-5 mr-3 text-white/20 group-hover:text-blue-500 transition-colors" />
              Run lifecycle
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Triggering a run enqueues a job. A worker executes the graph, writes a log per
              node, and streams events over websockets.
            </p>
            
            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
              {['pending', 'running', 'completed / failed'].map((state, i, arr) => (
                <div key={state} className="flex items-center">
                  <div className="px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm font-mono text-gray-300">
                    {state}
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-5 h-5 mx-4 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
