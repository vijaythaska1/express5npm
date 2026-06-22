import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Shield,
  UserX,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type User = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function DashboardPage() {
  const { token, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isActiveInput, setIsActiveInput] = useState(true);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${api}/users?page=${page}&limit=${limit}&search=${debouncedSearch}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data = await res.json();
      setUsers(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while loading users.");
    } finally {
      setIsLoading(false);
    }
  }, [token, page, limit, debouncedSearch, api]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const openCreateModal = () => {
    setNameInput("");
    setEmailInput("");
    setPasswordInput("");
    setIsActiveInput(true);
    setIsCreateOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setNameInput(user.name);
    setEmailInput(user.email);
    setPasswordInput("");
    setIsActiveInput(user.isActive);
    setIsEditOpen(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return setErrorMsg("Name is required.");
    if (!emailInput.trim()) return setErrorMsg("Email is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) return setErrorMsg("Invalid email address.");
    if (!passwordInput) return setErrorMsg("Password is required.");
    if (passwordInput.length < 6) return setErrorMsg("Password must be at least 6 characters.");

    setActionLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${api}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create user.");
      }
      setSuccessMsg("User created successfully!");
      setIsCreateOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!nameInput.trim()) return setErrorMsg("Name is required.");
    if (!emailInput.trim()) return setErrorMsg("Email is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) return setErrorMsg("Invalid email address.");

    setActionLoading(true);
    setErrorMsg(null);
    try {
      const body: any = {
        name: nameInput,
        email: emailInput,
        isActive: isActiveInput,
      };
      if (passwordInput) {
        if (passwordInput.length < 6) throw new Error("Password must be at least 6 characters.");
        body.password = passwordInput;
      }

      const res = await fetch(`${api}/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update user.");
      }
      setSuccessMsg("User details updated successfully!");
      setIsEditOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${api}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update status.");
      }
      setSuccessMsg(`User status updated to ${!user.isActive ? "Active" : "Inactive"}!`);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to toggle status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${api}/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user.");
      }
      setSuccessMsg("User account deleted successfully.");
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, total);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 flex flex-col gap-6 w-full">
      {/* Toast notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {successMsg && (
          <div className="bg-emerald-950/90 backdrop-blur border border-emerald-800 text-emerald-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}
        {errorMsg && !isCreateOpen && !isEditOpen && (
          <div className="bg-rose-950/90 backdrop-blur border border-rose-800 text-rose-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            User Management Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage system administrator roles and account permissions</p>
        </div>
        <Button
          onClick={openCreateModal}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Table Card wrapper */}
      <Card className="bg-zinc-900/60 backdrop-blur-xl border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
        <div className="p-5 border-b border-zinc-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-sm text-zinc-400">
            Total Records: <span className="text-zinc-200 font-semibold">{total}</span>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center px-4">
              <UserX className="w-12 h-12 text-zinc-600 mb-3" />
              <h3 className="text-zinc-300 font-medium text-base">No Users Found</h3>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                Try adjusting your search criteria or add a new user to start.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-800 text-zinc-400 text-xs font-semibold uppercase bg-zinc-900/40 select-none">
                  <TableHead className="px-6 py-4">Name</TableHead>
                  <TableHead className="px-6 py-4">Email</TableHead>
                  <TableHead className="px-6 py-4">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-800/60">
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-zinc-800/20 transition-colors group text-sm"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-white">{user.name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-zinc-400">{user.email}</TableCell>
                    <TableCell className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoading}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none transition-all disabled:opacity-50 ${
                          user.isActive
                            ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-400 hover:bg-emerald-950/60"
                            : "bg-zinc-800/40 border-zinc-700/60 text-zinc-500 hover:bg-zinc-800/80"
                        }`}
                        title="Click to toggle status"
                      >
                        {user.isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                            Inactive
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-all"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {users.length > 0 && (
          <div className="p-5 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-zinc-400">
            <div>
              Showing <span className="text-zinc-200 font-semibold">{startRange}</span> to{" "}
              <span className="text-zinc-200 font-semibold">{endRange}</span> of{" "}
              <span className="text-zinc-200 font-semibold">{total}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-zinc-700/60 rounded-xl hover:bg-zinc-800/60 text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-zinc-800 border border-zinc-700/40 rounded-xl text-zinc-200 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-zinc-700/60 rounded-xl hover:bg-zinc-800/60 text-zinc-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-modal-enter">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create New User</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Register a new user directly in the database</p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-800/50 text-rose-300 text-sm px-4 py-2.5 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Alice Smith"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <Label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">Email</Label>
                <Input
                  type="email"
                  placeholder="e.g. alice@example.com"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <Label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">Password</Label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  variant="outline"
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create User
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-modal-enter">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-600/15 text-amber-400 flex items-center justify-center">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit User Information</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Modify properties or reset passwords</p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-800/50 text-rose-300 text-sm px-4 py-2.5 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">Name</Label>
                <Input
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <Label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1">Email</Label>
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-3.5 py-2 bg-zinc-800/50 border border-zinc-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 py-2 bg-zinc-800/20 px-3.5 rounded-xl border border-zinc-800">
                <input
                  id="modal-isActive"
                  type="checkbox"
                  checked={isActiveInput}
                  onChange={(e) => setIsActiveInput(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
                <Label htmlFor="modal-isActive" className="text-sm font-medium text-zinc-300 cursor-pointer select-none">
                  Account Status Active
                </Label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  variant="outline"
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsViewOpen(false)} />
          <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-modal-enter">
            <button
              onClick={() => setIsViewOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans">User Information Details</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Comprehensive view of database fields</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-800 flex flex-col gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">User ID</div>
                  <div className="text-zinc-300 font-mono text-xs mt-0.5 select-all">{selectedUser._id}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Full Name</div>
                  <div className="text-white text-sm font-semibold mt-0.5">{selectedUser.name}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</div>
                  <div className="text-zinc-300 text-sm mt-0.5 select-all">{selectedUser.email}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Account Status</div>
                  <div className="mt-1">
                    <Badge variant={selectedUser.isActive ? "default" : "outline"} className={selectedUser.isActive ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-400" : ""}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedUser.isActive ? "bg-emerald-400" : "bg-zinc-500"}`} />
                      {selectedUser.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                {selectedUser.createdAt && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Registered At</div>
                    <div className="text-zinc-400 text-xs mt-0.5">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </div>
                  </div>
                )}
                {selectedUser.updatedAt && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Last Profile Update</div>
                    <div className="text-zinc-400 text-xs mt-0.5">
                      {new Date(selectedUser.updatedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  onClick={() => setIsViewOpen(false)}
                  className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-colors"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          <Card className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-modal-enter">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-600/15 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete User Account</h3>
                <p className="text-rose-400/80 text-xs font-semibold uppercase tracking-wider">Warning Action</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Are you absolutely sure you want to delete the user account for{" "}
                <span className="text-white font-semibold">"{selectedUser.name}"</span> ({selectedUser.email})? This action is permanent and cannot be undone.
              </p>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-800">
                <Button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  variant="outline"
                  className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors text-zinc-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-rose-600/10 flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Delete Permanently
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
