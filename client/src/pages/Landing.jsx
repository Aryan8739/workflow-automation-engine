import { Link } from 'react-router-dom';
import { ArrowRight, Workflow, Zap, GitBranch, PlayCircle, RefreshCcw, LayoutTemplate } from 'lucide-react';
import Nav from '../components/Nav';
import hero from '../assets/hero.png';

const FEATURES = [
  {
    icon: <GitBranch className="w-5 h-5 text-blue-500" />,
    accent: '#2563eb',
    title: 'Parallel DAG execution',
    body: 'Independent branches run concurrently — the engine schedules each node the moment its dependencies finish, and fan-in nodes join their inputs.',
  },
  {
    icon: <Workflow className="w-5 h-5 text-emerald-500" />,
    accent: '#10b981',
    title: 'Conditional branching',
    body: 'Route execution with if/else condition nodes. Untaken branches are skipped, not run — just like a real automation platform.',
  },
  {
    icon: <PlayCircle className="w-5 h-5 text-purple-500" />,
    accent: '#8b5cf6',
    title: 'Live execution streaming',
    body: 'Watch every node light up in real time over websockets — running, done, retrying, failed, or skipped — with per-node logs.',
  },
  {
    icon: <RefreshCcw className="w-5 h-5 text-amber-500" />,
    accent: '#f59e0b',
    title: 'Per-node retries',
    body: 'Configure max retries and backoff per node. Transient failures recover automatically without restarting the whole workflow.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 font-sans selection:bg-blue-500/30">
      <Nav />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 fill-blue-500/50" />
              <span>Next-gen workflow automation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
              Build, run, and watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">workflows</span> as a real parallel DAG.
            </h1>
            
            <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
              Drag nodes onto a canvas, connect them into a graph, and execute — HTTP calls, JS transforms, delays, and conditional branches, scheduled concurrently and streamed live.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/app" className="group flex items-center px-6 py-3.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                Try the demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/docs" className="flex items-center px-6 py-3.5 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                Read the docs
              </Link>
            </div>
            <p className="mt-5 text-xs text-gray-500 flex items-center">
              <LayoutTemplate className="w-3.5 h-3.5 mr-2 opacity-70" />
              No sign-up needed to try — the demo runs in a sandbox.
            </p>
          </div>

          <div className="relative lg:ml-auto w-full max-w-[600px] perspective-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/30 via-purple-500/20 to-transparent blur-2xl rounded-2xl opacity-70 animate-pulse" />
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden ring-1 ring-white/5 transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-24 pointer-events-none" />
              <img src={hero} alt="Workflow canvas preview" className="w-full h-auto relative z-10 opacity-90 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Powerful execution engine</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built from the ground up to handle complex logic, concurrency, and real-time observability.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group relative bg-[#111] border border-white/5 rounded-2xl p-8 hover:bg-[#161616] hover:border-white/10 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
                <div className="relative z-10 flex items-start space-x-5">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{f.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6">Ready to build a workflow?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Jump into the canvas immediately in our sandbox environment, or create an account to save your workflows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/app" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-all shadow-xl hover:scale-105">
              Launch the app
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full text-sm font-medium bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all">
              Create an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030303] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-5 h-5 border-[1.5px] border-gray-400 rounded rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Workflow Engine</span>
          </div>
          
          <div className="flex items-center space-x-8 text-sm text-gray-500 font-medium">
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link to="/app" className="hover:text-white transition-colors">App</Link>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
