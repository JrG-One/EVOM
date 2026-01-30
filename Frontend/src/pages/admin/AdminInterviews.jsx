import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Briefcase,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/admin/interviews?page=${page}`, { withCredentials: true });
            setInterviews(response.data.interviews);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch interviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this interview record?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/admin/interviews/${id}`, { withCredentials: true });
            toast.success("Interview deleted");
            fetchInterviews();
        } catch (error) {
            toast.error("Failed to delete interview");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Interview Logs</h1>
                <p className="text-gray-400">Monitor all AI interview simulations across the platform.</p>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-[#0A0A0F]/60 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03]">
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Candidate</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Role / Company</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Performance</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Date</th>
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
                            ) : interviews.map((interview) => (
                                <tr key={interview.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs ring-1 ring-white/10">
                                                {interview.user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{interview.user.username}</div>
                                                <div className="text-[10px] text-gray-500">{interview.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-white text-sm">{interview.role}</div>
                                        <div className="text-xs text-gray-500">{interview.company}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                            <div className={`w-1.5 h-1.5 rounded-full ${interview.score >= 7 ? 'bg-emerald-500 shadow-[0_0_8px_emerald]' : 'bg-amber-500'}`} />
                                            <span className="font-black text-xs">{interview.score * 10}%</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs text-gray-400 font-medium">
                                        {new Date(interview.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(interview.id)}
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

export default AdminInterviews;
