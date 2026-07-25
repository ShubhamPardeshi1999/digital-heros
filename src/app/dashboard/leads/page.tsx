"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assignedTo?: { _id: string; name: string; email: string } | null;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();

      if (res.ok) {
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      {pagination && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: pagination.totalCount, color: "text-zinc-100" },
            { label: "This Page", value: leads.length, color: "text-zinc-300" },
            { label: "Current Page", value: `${pagination.currentPage} / ${pagination.totalPages}`, color: "text-cyan-400" },
            { label: "Filter", value: statusFilter === "all" ? "All" : statusFilter, color: "text-blue-400" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 shadow-sm">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">{stat.label}</p>
              <p className={`text-xl font-bold mt-1.5 capitalize ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#0a0a0a] border-white/10 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-cyan-500/50 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val || "all"); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 bg-[#0a0a0a] border-white/10 text-zinc-100 h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-white/10 text-zinc-100">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-cyan-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-zinc-500">Loading leads...</span>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-zinc-900/20">
          <svg className="mx-auto w-12 h-12 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-zinc-400 mb-1">No leads found</h3>
          <p className="text-sm text-zinc-600">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden bg-[#0a0a0a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-white/5">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Name</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden lg:table-cell">Company</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden sm:table-cell">Assigned To</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden lg:table-cell">Date</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-zinc-100">{lead.name}</p>
                      <p className="text-xs text-zinc-500 md:hidden mt-0.5">{lead.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-400 hidden md:table-cell">
                      {lead.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-400 hidden lg:table-cell">
                      {lead.company || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={`capitalize text-xs font-medium px-2 py-0.5 ${statusColors[lead.status] || ""}`}
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-400 hidden sm:table-cell">
                      {lead.assignedTo ? lead.assignedTo.name : "Unassigned"}
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-500 hidden lg:table-cell">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/dashboard/leads/${lead._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View
                          <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-zinc-500 font-medium">
            Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
            {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{" "}
            {pagination.totalCount} leads
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer h-9"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer h-9"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
