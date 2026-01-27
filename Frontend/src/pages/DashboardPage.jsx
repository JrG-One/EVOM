import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInterviewStore } from '../store/useInterviewStore';
import {
    Brain,
    SearchCodeIcon,
    TrendingUp,
    Calendar,
    ArrowRight,
    ShieldCheck,
    Star,
    Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
    const { authUser } = useAuthStore();
    const { interviews, fetchUserInterviews } = useInterviewStore();

    useEffect(() => {
        fetchUserInterviews();
    }, [fetchUserInterviews]);

    const stats = [
        { label: "Interviews", value: interviews?.length || 0, icon: Activity, color: "text-blue-400" },
        { label: "Avg Score", value: (interviews?.reduce((acc, curr) => acc + (curr.score * 10), 0) / (interviews?.length || 1)).toFixed(1), icon: Star, color: "text-purple-400" },
        { label: "ATS Score", value: authUser?.atsScore || 0, icon: TrendingUp, color: "text-emerald-400" },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10 font-sans selection:bg-purple-500/30">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-black">User Session Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">{authUser?.username || 'Hunter'}</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-medium max-w-xl">
                            Ready to dominate your next interview? Your AI coaches are standing by.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
                        <div className="p-3 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Account Status</div>
                            <div className="text-white font-black">Early Bird</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {stats.map((stat, i) => (
                        <div key={i} className="group relative p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-500">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                                </div>
                                <div className={`p-4 rounded-2xl bg-white/[0.03] ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
                    {/* AI Interview Card */}
                    <Link to="/portal" className="group relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 backdrop-blur-xl hover:scale-[1.01] transition-all duration-700">
                        <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-bl-[5rem] translate-x-12 -translate-y-12 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div>
                                <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-700">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-black mb-4 tracking-tight">Technical <br />Simulation</h2>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
                                    Experience hyper-realistic interview scenarios tailored to your target roles.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm group-hover:gap-5 transition-all">
                                Access Engine <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Resume Analysis Card */}
                    <Link to="/analyser" className="group relative overflow-hidden p-10 rounded-[2.5rem] bg-[#0A0A0F]/60 border border-white/5 backdrop-blur-xl hover:scale-[1.01] transition-all duration-700">
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div>
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-700">
                                    <SearchCodeIcon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h2 className="text-4xl font-black mb-4 tracking-tight">Resume <br />Optimization</h2>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
                                    Analyze your credentials against elite industry standards with AI accuracy.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 group-hover:text-white font-black uppercase tracking-widest text-sm transition-all">
                                Audit Profile <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Session Table */}
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                        <Link to="/profile" className="text-sm font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest underline underline-offset-8">View History</Link>
                    </div>

                    <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.03]">
                                        <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Activity / Machine</th>
                                        <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Performance</th>
                                        <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Timestamp</th>
                                        <th className="p-6 text-xs uppercase tracking-[0.2em] text-gray-500 font-black">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {interviews?.slice(0, 3).reverse().map((interview, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-white">{interview.role}</div>
                                                <div className="text-xs text-gray-500">{interview.company}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${interview.score >= 7 ? 'bg-emerald-500 shadow-[0_0_8px_emerald]' : 'bg-amber-500'}`} />
                                                    <span className="font-black text-sm">{interview.score * 10}%</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-gray-400 font-medium">
                                                {new Date(interview.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-6">
                                                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!interviews || interviews.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center text-gray-500 font-medium italic">
                                                No recent activity found. Initiate a machine simulation to begin.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
