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
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
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
        <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-slate-400">Lead not found</h3>
        <Button
          onClick={() => router.push("/dashboard/leads")}
          variant="outline"
          className="mt-4 border-slate-800 text-slate-400 cursor-pointer"
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
        className="text-slate-400 hover:text-white -ml-2 cursor-pointer"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Leads
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Lead Info + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Info Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                <p className="text-slate-400 mt-1">{lead.company || "No company"}</p>
              </div>
              <Badge
                variant="outline"
                className={`capitalize text-sm px-3 py-1 ${statusColors[lead.status] || ""}`}
              >
                {lead.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Email", value: lead.email, icon: <Mail className="w-4 h-4 mr-1.5 inline-block" /> },
                { label: "Phone", value: lead.phone, icon: <Phone className="w-4 h-4 mr-1.5 inline-block" /> },
                { label: "Source", value: lead.source, icon: <Globe className="w-4 h-4 mr-1.5 inline-block" /> },
                { label: "Created", value: formatDateTime(lead.createdAt), icon: <Calendar className="w-4 h-4 mr-1.5 inline-block" /> },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/30">
                  <p className="text-xs text-slate-500 mb-1">
                    {item.icon} {item.label}
                  </p>
                  <p className="text-sm text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {lead.message && (
              <div className="mt-4 p-3 rounded-lg bg-slate-800/30">
                <p className="text-xs text-slate-500 mb-1 flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> Message</p>
                <p className="text-sm text-slate-300 leading-relaxed">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Change Status</label>
                <Select
                  value={lead.status}
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
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
                <label className="text-xs text-slate-500">Assign To</label>
                <Select
                  value={lead.assignedTo?._id || "unassigned"}
                  onValueChange={handleAssign}
                  disabled={updating}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <span className="truncate">
                      {lead.assignedTo 
                        ? (users.find(u => u._id === (typeof lead.assignedTo === 'string' ? lead.assignedTo : lead.assignedTo?._id))?.name || lead.assignedTo?.name || "Unknown User")
                        : "Unassigned"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Add Note
            </h3>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note about this lead..."
              rows={3}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 resize-none"
            />
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim() || updating}
              className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            >
              {updating ? "Adding..." : "Add Note"}
            </Button>
          </div>

          {/* Notes List */}
          {lead.notes.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Notes ({lead.notes.length})
              </h3>
              <div className="space-y-3">
                {[...lead.notes].reverse().map((note) => (
                  <div
                    key={note._id}
                    className="p-3 rounded-lg bg-slate-800/30 border border-slate-800"
                  >
                    <p className="text-sm text-slate-300 leading-relaxed">{note.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-indigo-400">
                        {note.addedBy?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-600">•</span>
                      <span className="text-xs text-slate-500">
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Activity Trail
            </h3>

            {activities.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <div className="space-y-0">
                {activities.map((activity, index) => (
                  <div key={activity._id} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50 text-sm shadow-sm shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-px h-full bg-slate-800 my-1" />
                      )}
                    </div>
                    <div className="pb-6 pt-1">
                      <p className="text-sm text-slate-300">{activity.details}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-indigo-400">
                          {activity.performedBy?.name || "System"}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
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
