import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Search,
    MoreVertical,
    Shield,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
    UserCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/admin/users?page=${page}&search=${search}`, { withCredentials: true });
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
            await axios.put(`http://localhost:3000/api/admin/users/role`, { userId, role: newRole }, { withCredentials: true });
            toast.success(`Role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? Action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, { withCredentials: true });
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">User Management</h1>
                    <p className="text-gray-400">Total {users.length} users found in the system.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 w-full md:w-[300px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <Filter className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-[#0A0A0F]/60 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03]">
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">User Identity</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Account Details</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Role / Permission</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">ATS Score</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-6 bg-white/[0.01]">&nbsp;</td>
                                    </tr>
                                ))
                            ) : users.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center font-bold text-lg">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{user.username}</div>
                                                <div className="text-xs text-gray-500 font-medium">ID: {user.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-sm font-medium">{user.email}</div>
                                        <div className="text-xs text-gray-500 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-6">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs font-black tracking-widest focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="USER" className="bg-black">USER</option>
                                            <option value="ADMIN" className="bg-black">ADMIN</option>
                                            <option value="SUPERADMIN" className="bg-black">SUPERADMIN</option>
                                        </select>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.atsScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className="font-black text-xs">{user.atsScore}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 transition-all hover:text-white"
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
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-all"
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
