import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useSearchParams } from "react-router-dom";

const AdminAICredits = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchSummary = async () => {
    try {
      const response = await axiosInstance.get("/admin/credits/summary");
      setSummary(response.data);
    } catch (error) {
      toast.error("Failed to fetch AI credits summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const highlightedUserId = searchParams.get("userId");

  if (loading) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">Loading credit analytics...</div>;
  }

  return (
    <div className="space-y-8 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">AI Credits</h1>
        <p className="text-gray-500 dark:text-gray-400">Track remaining, warning, and exhausted AI credits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat Cards - Updated for Light/Dark Mode */}
        <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black">Total Limit</p>
          <p className="text-2xl font-black">{summary?.totals?.monthlyLimit ?? 0}</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black">Used</p>
          <p className="text-2xl font-black">{summary?.totals?.used ?? 0}</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black">Warning (95%)</p>
          <p className="text-2xl font-black">{summary?.warningThresholds?.warning95 ?? 0}</p>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black">Exhausted</p>
          <p className="text-2xl font-black text-red-500 dark:text-red-400">{summary?.totals?.exhausted ?? 0}</p>
        </div>
      </div>

      {/* Table Container - Updated for Light/Dark Mode */}
      <div className="rounded-[2rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-white dark:bg-[#0A0A0F]/60 overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">User</th>
                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Plan</th>
                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Used</th>
                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Remaining</th>
                <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Cycle End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {(summary?.users || []).map((user) => (
                <tr
                  key={user.userId}
                  className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${highlightedUserId === user.userId ? "bg-purple-50 dark:bg-purple-500/10" : ""
                    }`}
                >
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-200">{user.username}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{user.plan}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{user.usedThisCycle} / {user.monthlyLimit}</td>
                  <td className={`p-4 text-sm font-medium ${user.remaining <= 0 ? "text-red-500 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`}>
                    {user.remaining}
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(user.cycleEnd).toLocaleDateString()}</td>
                </tr>
              ))}
              {!summary?.users?.length && (
                <tr>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center" colSpan={5}>
                    No credit records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAICredits;