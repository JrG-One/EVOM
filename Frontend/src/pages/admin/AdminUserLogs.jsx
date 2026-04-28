import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useSearchParams } from "react-router-dom";

const AdminUserLogs = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/admin/users?limit=100");
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchLogs = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}/activity-logs?limit=100`);
      setLogs(response.data.logs || []);
    } catch (error) {
      toast.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      setSelectedUser(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLogs(selectedUser);
  }, [selectedUser]);

  return (
    <div className="space-y-8 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">User Activity Logs</h1>
        <p className="text-gray-500 dark:text-gray-400">Inspect tracked activity for each user.</p>
      </div>

      <div className="rounded-[2rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0F]/60 p-6 space-y-6 shadow-sm dark:shadow-none">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full md:w-[420px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        >
          <option value="" className="bg-white dark:bg-black">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id} className="bg-white dark:bg-black">
              {user.username} ({user.email})
            </option>
          ))}
        </select>

        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/5">
                  <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Event</th>
                  <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Meta</th>
                  <th className="p-4 text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 font-black">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-900 dark:text-gray-200">{log.eventType}</td>
                    <td className="p-4 text-xs text-gray-500 dark:text-gray-400 max-w-[480px] truncate">
                      {JSON.stringify(log.meta || {})}
                    </td>
                    <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {!logs.length && (
                  <tr>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center" colSpan={3}>
                      No logs found for selected user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserLogs;