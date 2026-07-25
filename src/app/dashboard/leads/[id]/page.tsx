"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Globe, Calendar, MessageSquare, PlusCircle, RefreshCw, FileText, UserPlus, UserMinus, Activity as ActivityIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Note {
  _id: string;
  text: string;
  addedBy: User;
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  source: string;
  assignedTo?: User | null;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  _id: string;
  action: string;
  performedBy: User;
  details: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "lead_created": return <PlusCircle className="w-4 h-4 text-emerald-400" />;
    case "status_changed": return <RefreshCw className="w-4 h-4 text-blue-400" />;
    case "note_added": return <FileText className="w-4 h-4 text-amber-400" />;
    case "assigned": return <UserPlus className="w-4 h-4 text-purple-400" />;
    case "unassigned": return <UserMinus className="w-4 h-4 text-red-400" />;
    default: return <ActivityIcon className="w-4 h-4 text-slate-400" />;
  }
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setLead(data.lead);
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchLead();
    fetchUsers();
  }, [fetchLead, fetchUsers]);

  const updateLead = async (body: Record<string, unknown>) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/leads/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setLead(data.lead);
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (status: string | null) => {
    if (!status) return;
    updateLead({ action: "update_status", status });
  };

  const handleAssign = (userId: string | null) => {
    if (!userId) return;
    updateLead({ action: "assign", assignedTo: userId === "unassigned" ? null : userId });
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await updateLead({ action: "add_note", text: noteText.trim() });
    setNoteText("");
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-cyan-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20 border border-white/5 rounded-xl bg-zinc-900/20">
        <h3 className="text-lg font-medium text-zinc-400">Lead not found</h3>
        <Button
          onClick={() => router.push("/dashboard/leads")}
          variant="outline"
          className="mt-4 border-white/5 bg-[#0a0a0a] text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
        >
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back button */}
      <Button
        onClick={() => router.push("/dashboard/leads")}
        variant="ghost"
        size="sm"
        className="text-zinc-400 hover:text-white hover:bg-white/5 -ml-2 cursor-pointer h-9 px-3"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Leads
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Lead Info + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info Card */}
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">{lead.name}</h2>
                <p className="text-zinc-400 mt-1">{lead.company || "No company provided"}</p>
              </div>
              <Badge
                variant="outline"
                className={`capitalize font-medium px-3 py-1 ${statusColors[lead.status] || ""}`}
              >
                {lead.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Email", value: lead.email, icon: <Mail className="w-4 h-4 mr-2 text-cyan-400" /> },
                { label: "Phone", value: lead.phone, icon: <Phone className="w-4 h-4 mr-2 text-cyan-400" /> },
                { label: "Source", value: lead.source, icon: <Globe className="w-4 h-4 mr-2 text-cyan-400" /> },
                { label: "Created", value: formatDateTime(lead.createdAt), icon: <Calendar className="w-4 h-4 mr-2 text-cyan-400" /> },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-start flex-col justify-center">
                  <div className="flex items-center text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">
                    {item.icon} {item.label}
                  </div>
                  <p className="text-sm font-medium text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>

            {lead.message && (
              <div className="mt-4 p-5 rounded-xl bg-[#0a0a0a] border border-white/5">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" /> Message
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Change Status</label>
                <Select
                  value={lead.status}
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-zinc-100 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-zinc-100">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Assign To</label>
                <Select
                  value={lead.assignedTo?._id || "unassigned"}
                  onValueChange={handleAssign}
                  disabled={updating}
                >
                  <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-zinc-100 h-10">
                    <span className="truncate">
                      {lead.assignedTo 
                        ? (users.find(u => u._id === (typeof lead.assignedTo === 'string' ? lead.assignedTo : lead.assignedTo?._id))?.name || lead.assignedTo?.name || "Unknown User")
                        : "Unassigned"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-zinc-100">
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Add Note */}
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Add Note
            </h3>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note about this lead..."
              rows={3}
              className="bg-[#0a0a0a] border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-cyan-500/50 resize-none"
            />
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim() || updating}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold cursor-pointer h-10 px-6 rounded-md transition-colors"
            >
              {updating ? "Adding..." : "Add Note"}
            </Button>
          </div>

          {/* Notes List */}
          {lead.notes.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 space-y-5 shadow-sm">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Notes ({lead.notes.length})
              </h3>
              <div className="space-y-3">
                {[...lead.notes].reverse().map((note) => (
                  <div
                    key={note._id}
                    className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5"
                  >
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs font-medium text-cyan-400">
                        {note.addedBy?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">
                        {formatDateTime(note.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Activity Trail */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 shadow-sm sticky top-24">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
              Activity Trail
            </h3>

            {activities.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No activity yet.</p>
            ) : (
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/5 before:z-0">
                {activities.map((activity, index) => (
                  <div key={activity._id} className="relative z-10 flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-white/10 text-sm shadow-sm shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-sm font-medium text-zinc-200">{activity.details}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-cyan-400">
                          {activity.performedBy?.name || "System"}
                        </span>
                        <span className="text-[11px] text-zinc-600">•</span>
                        <span className="text-[11px] text-zinc-500 tracking-wider">
                          {formatDateTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
