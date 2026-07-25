"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details && Array.isArray(data.details) && data.details.length > 0) {
          throw new Error(data.details[0].message);
        }
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-10 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Thank you!</h3>
        <p className="text-zinc-400 mb-6">
          Your inquiry has been submitted. Our team will get back to you shortly.
        </p>
        <Button
          onClick={() => setStatus("idle")}
          variant="outline"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {status === "error" && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              disabled={status === "loading"}
              className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-10"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === "loading"}
              className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-10"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              minLength={7}
              disabled={status === "loading"}
              className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Company (Optional)</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={status === "loading"}
              className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md h-10"
              placeholder="Acme Inc."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            minLength={10}
            disabled={status === "loading"}
            rows={4}
            className="bg-[#0a0a0a] border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50 rounded-md resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold rounded-md transition-colors mt-2 cursor-pointer"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Request"
          )}
        </Button>
      </form>
    </div>
  );
}
