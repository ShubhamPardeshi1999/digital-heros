"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member" as "admin" | "member",
  });

  // Redirect non-admin users
  useEffect(() => {
    if (session && session.user.role !== "admin") {
      router.push("/dashboard/leads");
    }
  }, [session, router]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "member" });
      fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  if (session?.user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">Team Members</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Manage your team members and their roles.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors h-10 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/5 text-zinc-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-zinc-100">Add New Team Member</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Create a new account for your team member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="bg-zinc-900/40 border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="bg-zinc-900/40 border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={6}
                  className="bg-zinc-900/40 border-white/10 text-zinc-100 focus-visible:ring-cyan-500/50"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) =>
                    setFormData((p) => ({ ...p, role: (val || "member") as "admin" | "member" }))
                  }
                >
                  <SelectTrigger className="bg-zinc-900/40 border-white/10 text-zinc-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-zinc-100">
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                  className="text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer h-10 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold cursor-pointer h-10 px-6 transition-colors"
                >
                  {creating ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-cyan-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden bg-[#0a0a0a] shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-white/5">
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Name</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0 shadow-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{user.name}</p>
                        <p className="text-xs text-zinc-500 sm:hidden mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-400 hidden sm:table-cell">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs font-medium px-2 py-0.5 ${
                        user.role === "admin"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-zinc-500 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
