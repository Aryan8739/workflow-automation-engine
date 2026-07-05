import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import hero from '../assets/hero.png';

const FEATURES = [
  {
    accent: '#2563eb',
    title: 'Parallel DAG execution',
    body: 'Independent branches run concurrently — the engine schedules each node the moment its dependencies finish, and fan-in nodes join their inputs.',
  },
  {
    accent: '#16a34a',
    title: 'Conditional branching',
    body: 'Route execution with if/else condition nodes. Untaken branches are skipped, not run — just like a real automation platform.',
  },
  {
    accent: '#7c3aed',
    title: 'Live execution streaming',
    body: 'Watch every node light up in real time over websockets — running, done, retrying, failed, or skipped — with per-node logs.',
  },
  {
    accent: '#d97706',
    title: 'Per-node retries',
    body: 'Configure max retries and backoff per node. Transient failures recover automatically without restarting the whole workflow.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100">
      <Nav />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#222] text-[10px] uppercase tracking-widest text-gray-400 mb-6">
            Workflow automation engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Build, run, and watch <span className="text-[#2563eb]">workflows</span> as a real parallel DAG.
          </h1>
          <p className="mt-5 text-gray-400 text-base leading-relaxed max-w-lg">
            Drag nodes onto a canvas, connect them into a graph, and execute — HTTP calls,
            JS transforms, delays, and conditional branches, scheduled concurrently and streamed live.
          </p>
          <div className="mt-8 flex items-center space-x-3">
            <Link to="/app" className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#2563eb] text-white hover:bg-blue-500 transition">
              Try the demo
            </Link>
            <Link to="/docs" className="px-6 py-2.5 rounded-full text-sm font-medium border border-[#222] text-gray-300 hover:border-gray-500 transition">
              Read the docs
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-gray-600">No sign-up needed to try — the demo runs in a sandbox.</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#2563eb]/20 via-[#7c3aed]/10 to-transparent blur-2xl rounded-3xl" />
          <img src={hero} alt="Workflow canvas preview" className="relative rounded-xl border border-[#1f1f1f] shadow-2xl w-full" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[#141414]">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">What it does</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#2a2a2a] transition">
              <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: f.accent }} />
              <h3 className="text-base font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center border-t border-[#141414]">
        <h2 className="text-2xl md:text-3xl font-bold">Ready to build a workflow?</h2>
        <p className="mt-3 text-gray-400">Jump into the canvas — or sign in to save your own.</p>
        <div className="mt-7 flex items-center justify-center space-x-3">
          <Link to="/app" className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#2563eb] text-white hover:bg-blue-500 transition">
            Launch the app
          </Link>
          <Link to="/login" className="px-6 py-2.5 rounded-full text-sm font-medium border border-[#222] text-gray-300 hover:border-gray-500 transition">
            Create an account
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#141414] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-[11px] text-gray-600">
          <span>Workflow Engine — build, run, and watch workflows</span>
          <div className="space-x-4">
            <Link to="/docs" className="hover:text-gray-400">Docs</Link>
            <Link to="/app" className="hover:text-gray-400">App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
