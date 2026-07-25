import Link from "next/link";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, Target, Users, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-100 selection:bg-cyan-500/30 font-sans">
      {/* Abstract Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              LeadFlow.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block">
              Features
            </a>
            <a href="#contact" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block">
              Contact
            </a>
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-900 transition-all font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden z-10 flex-1 flex flex-col items-center justify-center">
        {/* Soft glowing orb behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-xs font-medium uppercase tracking-widest mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
            </span>
            Next-Gen CRM
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-zinc-100">
            Convert leads with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              precision.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The minimal, fast, and powerful lead management platform designed for modern sales teams who care about closing deals, not fighting software.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold transition-all duration-200 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              Start Capturing
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-medium border border-white/5 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5 relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Built for speed and clarity.</h2>
            <p className="text-zinc-400">Everything you need, nothing you don't.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-5 h-5 text-cyan-400" />,
                title: "Lifecycle Tracking",
                desc: "Move leads seamlessly from new inquiry to won deal.",
              },
              {
                icon: <Users className="w-5 h-5 text-cyan-400" />,
                title: "Team Collaboration",
                desc: "Assign leads, add notes, and work together in real-time.",
              },
              {
                icon: <Zap className="w-5 h-5 text-cyan-400" />,
                title: "Instant Activity Trail",
                desc: "Every action is logged. Never lose context on a conversation.",
              },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/20 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Lead Capture Section */}
      <section id="contact" className="py-24 px-6 border-t border-white/5 relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Experience the flow.</h2>
            <p className="text-zinc-400">Drop your info below and see how quickly it hits the dashboard.</p>
          </div>
          
          <div className="max-w-md mx-auto">
            {/* The form wrapper to make it look floating and premium */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
                <LeadCaptureForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
