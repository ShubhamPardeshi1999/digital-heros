import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-6">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2">
        <p className="text-sm text-slate-400">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
          >
            Built for Digital Heroes Training Task
          </a>
        </p>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} LeadFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
