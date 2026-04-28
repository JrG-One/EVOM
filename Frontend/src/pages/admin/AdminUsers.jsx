import React, { useEffect, useState } from 'react';
import {
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/admin/users?page=${page}&search=${search}`);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await axiosInstance.patch(`/admin/users/${userId}`, { role: newRole });
            toast.success(`Role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? Action cannot be undone.")) return;
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleStatusUpdate = async (userId, status) => {
        try {
            await axiosInstance.patch(`/admin/users/${userId}/status`, { status });
            toast.success(`Status updated to ${status}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000 text-gray-900 dark:text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Total {users.length} users found in the system.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-6 w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="rounded-[2.5rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0F]/60 overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">User Identity</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Account Details</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Role</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Status</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">ATS Score</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="p-6 bg-gray-50 dark:bg-white/[0.01]">&nbsp;</td>
                                    </tr>
                                ))
                            ) : users.map((user) => (
                                <tr key={user.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-gray-200 dark:border-white/10 flex items-center justify-center font-bold text-lg text-purple-600 dark:text-purple-300">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-lg">{user.username}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">ID: {user.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.email}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1 text-xs font-black tracking-widest text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="USER" className="bg-white dark:bg-black">USER</option>
                                            <option value="ADMIN" className="bg-white dark:bg-black">ADMIN</option>
                                            <option value="SUPERADMIN" className="bg-white dark:bg-black">SUPERADMIN</option>
                                        </select>
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={user.status || "ACTIVE"}
                                            onChange={(e) => handleStatusUpdate(user.id, e.target.value)}
                                            className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1 text-xs font-black tracking-widest text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="ACTIVE" className="bg-white dark:bg-black">ACTIVE</option>
                                            <option value="SUSPENDED" className="bg-white dark:bg-black">SUSPENDED</option>
                                            <option value="DELETED" className="bg-white dark:bg-black">DELETED</option>
                                        </select>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.atsScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className="font-black text-xs text-gray-700 dark:text-gray-300">{user.atsScore}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/logs?userId=${user.id}`)}
                                                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all"
                                            >
                                                Logs
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/credits?userId=${user.id}`)}
                                                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-all"
                                            >
                                                Credits
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;