import React, { useEffect, useState } from 'react';
import {
    Users,
    Briefcase,
    TrendingUp,
    Star
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { axiosInstance } from '@/lib/axios';

const AdminDashboard = () => {
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/admin/overview');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    const stats = [
        { label: "Total Users", value: data?.totalUsers ?? 0, icon: Users, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-400/10" },
        { label: "Interviews", value: data?.totalInterviews ?? 0, icon: Briefcase, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-400/10" },
        { label: "Active Users (30d)", value: data?.activeUsers30d ?? 0, icon: Star, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-400/10" },
        { label: "Credits Exhausted", value: data?.credits?.exhausted ?? 0, icon: TrendingUp, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-400/10" },
    ];

    const chartData = data?.chartData || [];
    const isDark = document.documentElement.classList.contains('dark');

    return (
        <div className="space-y-8 animate-in fade-in duration-1000 text-gray-900 dark:text-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">System Overview</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage and monitor the entire EVOM ecosystem.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group p-6 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur-3xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-500">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0A0A0F]/60 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">User Growth</h2>
                        <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#00000010"} vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#0A0A0F' : '#ffffff', 
                                        border: isDark ? '1px solid #ffffff10' : '1px solid #e5e7eb', 
                                        borderRadius: '12px',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    itemStyle={{ color: isDark ? '#fff' : '#000' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#9333ea" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0A0A0F]/60 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Interview Volume</h2>
                        <Briefcase className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff10" : "#00000010"} vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#0A0A0F' : '#ffffff', 
                                        border: isDark ? '1px solid #ffffff10' : '1px solid #e5e7eb', 
                                        borderRadius: '12px',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    cursor={{ fill: isDark ? '#ffffff05' : '#00000005' }}
                                />
                                <Bar dataKey="interviews" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0A0A0F]/60 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none backdrop-blur-xl mb-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Recent Signups</h2>
                    <button className="text-sm font-bold text-purple-600 dark:text-purple-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors uppercase tracking-widest underline underline-offset-8">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
                                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">User</th>
                                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Email</th>
                                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Role</th>
                                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                            {(data?.recentUsers || []).map((user, i) => (
                                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold ring-1 ring-gray-200 dark:ring-white/10 text-gray-700 dark:text-white">{user.username[0].toUpperCase()}</div>
                                            <span className="font-bold text-gray-900 dark:text-white">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-widest
                                            ${user.role === 'SUPERADMIN' ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20' :
                                                user.role === 'ADMIN' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' :
                                                'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20'}
                                        `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;