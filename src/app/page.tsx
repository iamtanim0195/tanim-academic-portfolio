import { Terminal, ShieldCheck, Database, Cpu, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-3xl w-full space-y-8 bg-surface border border-border-subtle p-8 sm:p-12 rounded-2xl shadow-2xl">

        {/* Status Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-lg text-accent">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-secondary-text font-semibold">Phase 0 Status</span>
              <h1 className="text-xl font-bold text-primary-text">Environment & Token Verification</h1>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Ready for Phase 1
          </span>
        </div>

        {/* Identity & Mission */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-text tracking-tight">
            Computer Science & Engineering Research Portfolio
          </h2>
          <p className="text-secondary-text text-base leading-relaxed">
            Personal academic hub configured for research updates in <span className="text-accent font-medium">Robotics</span>, <span className="text-accent font-medium">Reinforcement Learning</span>, <span className="text-accent font-medium">Computer Vision</span>, and <span className="text-accent font-medium">Intelligent Systems</span>.
          </p>
        </div>

        {/* Verification Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-background/50 border border-border-subtle rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
            <div>
              <p className="text-xs text-secondary-text font-medium">Framework</p>
              <p className="text-sm font-semibold text-primary-text">Next.js App Router</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 border border-border-subtle rounded-xl flex items-center gap-3">
            <Cpu className="w-5 h-5 text-accent shrink-0" />
            <div>
              <p className="text-xs text-secondary-text font-medium">Design Tokens</p>
              <p className="text-sm font-semibold text-primary-text">Tailwind + Dark Palette</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 border border-border-subtle rounded-xl flex items-center gap-3">
            <Database className="w-5 h-5 text-accent shrink-0" />
            <div>
              <p className="text-xs text-secondary-text font-medium">Backend Ready</p>
              <p className="text-sm font-semibold text-primary-text">Supabase Ready</p>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-secondary-text">
          <span>Target Architecture: Production Ready</span>
          <div className="flex items-center gap-1 text-accent font-medium hover:underline cursor-pointer">
            <span>Next: Build Phase 1 Layout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </main>
  );
}