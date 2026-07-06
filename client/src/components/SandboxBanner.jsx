import { Link } from 'react-router-dom';

export default function SandboxBanner() {
  return (
    <div className="w-full bg-[#1f1a0d] border-b border-[#3a2f14] text-[12px] text-amber-300 px-4 py-2 flex items-center justify-center gap-2">
      <span>Sandbox — changes aren&apos;t saved and reset on refresh.</span>
      <Link to="/login" className="font-semibold underline hover:text-amber-200">Sign in to save your own workflows</Link>
    </div>
  );
}
