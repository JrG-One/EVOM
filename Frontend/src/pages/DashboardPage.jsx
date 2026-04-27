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
    Activity,
    Sparkles
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
        { label: "Interviews", value: interviews?.length || 0, icon: Activity, color: "text-blue-500 dark:text-blue-400" },
        { label: "Avg Score", value: (interviews?.reduce((acc, curr) => acc + (curr.score * 10), 0) / (interviews?.length || 1)).toFixed(1), icon: Star, color: "text-purple-500 dark:text-purple-400" },
        { label: "ATS Score", value: authUser?.atsScore || 0, icon: TrendingUp, color: "text-emerald-500 dark:text-emerald-400" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 lg:p-10 font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Premium Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/[0.03] dark:bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.03] dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
                
                {/* Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 mb-4 backdrop-blur-xl">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500 font-bold">User Session Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2">
                            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">{authUser?.username || 'Hunter'}</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium max-w-xl opacity-80">
                            Ready to dominate your next interview? Your AI coaches are standing by.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-3xl backdrop-blur-xl shadow-sm">
                        <div className="p-3 bg-gradient-to-tr from-primary to-indigo-600 rounded-2xl shadow-lg shadow-primary/20">
                            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">Account Status</div>
                            <div className="text-foreground font-extrabold tracking-tight">Early Bird Access</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {stats.map((stat, i) => (
                        <div key={i} className="group relative p-6 rounded-[2rem] bg-card border border-border backdrop-blur-3xl hover:bg-accent/50 transition-all duration-500 shadow-sm hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-1 opacity-70 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</h3>
                                </div>
                                <div className={`p-4 rounded-2xl bg-accent ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
                    {/* AI Interview Card */}
                    <Link to="/portal" className="group relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-indigo-500/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20 backdrop-blur-xl hover:scale-[1.01] transition-all duration-700 shadow-xl shadow-primary/5">
                        <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[5rem] translate-x-12 -translate-y-12 blur-3xl group-hover:bg-primary/10 transition-colors" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div>
                                <div className="w-16 h-16 bg-gradient-to-tr from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform duration-700 shadow-primary/30">
                                    <Brain className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground leading-tight">Technical <br />Simulation</h2>
                                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm opacity-80">
                                    Experience hyper-realistic interview scenarios tailored to your target roles.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-foreground font-bold uppercase tracking-widest text-sm group-hover:gap-5 transition-all">
                                Access Engine <ArrowRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </Link>

                    {/* Resume Analysis Card */}
                    <div className="group relative overflow-hidden p-10 rounded-[2.5rem] bg-card/50 border border-border backdrop-blur-xl cursor-not-allowed shadow-sm">
                        <div className="absolute top-4 right-8 z-20">
                            <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full animate-bounce shadow-lg shadow-primary/20">COMING SOON</Badge>
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12 opacity-50">
                            <div>
                                <div className="w-16 h-16 bg-accent border border-border rounded-2xl flex items-center justify-center mb-8">
                                    <SearchCodeIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-4xl font-extrabold mb-4 tracking-tight text-foreground/80 leading-tight">Resume <br />Optimization</h2>
                                <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-sm">
                                    Analyze your credentials against elite industry standards with AI accuracy.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground font-bold uppercase tracking-widest text-sm">
                                Feature Locked <ShieldCheck className="w-5 h-5 opacity-40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Session Table */}
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Recent Activity</h2>
                        <Link to="/profile" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest underline underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all">View History</Link>
                    </div>

                    <div className="rounded-[2rem] border border-border bg-card overflow-hidden backdrop-blur-xl shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-accent/30 dark:bg-accent/50 border-b border-border">
                                        <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">Activity / Machine</th>
                                        <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">Performance</th>
                                        <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">Timestamp</th>
                                        <th className="p-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold text-right pr-10">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {interviews?.slice(0, 3).reverse().map((interview, i) => (
                                        <tr key={i} className="group hover:bg-accent/30 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">{interview.role}</div>
                                                <div className="text-xs text-muted-foreground font-medium opacity-70">{interview.company}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/50 border border-border group-hover:border-primary/20 transition-colors">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${interview.score >= 7 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                    <span className="font-bold text-sm">{interview.score * 10}%</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-muted-foreground font-medium opacity-80">
                                                {new Date(interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="p-6 text-right pr-10">
                                                <button className="p-2 rounded-xl bg-accent border border-border hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95">
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!interviews || interviews.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="p-16 text-center text-muted-foreground font-medium italic opacity-60">
                                                <Sparkles className="w-8 h-8 mx-auto mb-4 opacity-20" />
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

