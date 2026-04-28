import React, { useEffect, useState } from 'react';
import {
    Trash2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

const AdminInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/admin/interviews?page=${page}`);
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
            await axiosInstance.delete(`/admin/interviews/${id}`);
            toast.success("Interview deleted");
            fetchInterviews();
        } catch (error) {
            toast.error("Failed to delete interview");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000 text-gray-900 dark:text-white">
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Interview Logs</h1>
                <p className="text-gray-500 dark:text-gray-400">Monitor all AI interview simulations across the platform.</p>
            </div>

            <div className="rounded-[2.5rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0F]/60 overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Candidate</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Role / Company</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Performance</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Date</th>
                                <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-6 bg-gray-50 dark:bg-white/[0.01]">&nbsp;</td>
                                    </tr>
                                ))
                            ) : interviews.map((interview) => (
                                <tr key={interview.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-xs ring-1 ring-gray-200 dark:ring-white/10 text-gray-700 dark:text-white">
                                                {interview.user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{interview.user.username}</div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">{interview.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{interview.role}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{interview.company}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <div className={`w-1.5 h-1.5 rounded-full ${interview.score >= 7 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                                            <span className="font-black text-xs text-gray-700 dark:text-gray-300">{interview.score * 10}%</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {new Date(interview.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(interview.id)}
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

export default AdminInterviews;