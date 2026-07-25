"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard/leads");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-cyan-500/30">
      
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 border-r border-white/5 items-center justify-center overflow-hidden">
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Soft glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg px-12">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-8">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            LeadFlow.
          </h1>
          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            The minimal, fast, and powerful lead management platform designed for modern sales teams who care about closing deals, not fighting software.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile-only background effects */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] lg:hidden mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none lg:hidden" />

        {/* Back button */}
        <div className="absolute top-8 left-8 z-20">
          <Button 
            variant="ghost" 
            className="text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer rounded-md h-9 px-3"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="w-full max-w-sm relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Welcome back</h2>
            <p className="text-sm text-zinc-400">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@leadflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-11"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold rounded-md transition-colors mt-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-500 text-center uppercase tracking-widest font-semibold mb-4">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between bg-white/5 border border-white/5 rounded-md px-4 py-2.5">
                <span>admin@leadflow.com</span>
                <span className="font-mono text-zinc-300">admin123</span>
              </div>
              <div className="flex justify-between bg-white/5 border border-white/5 rounded-md px-4 py-2.5">
                <span>member@leadflow.com</span>
                <span className="font-mono text-zinc-300">member123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
