import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ToggleLeft } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

const defaultFlags = [
  { key: "FEATURE_AI_INTERVIEW", description: "AI interview sessions", enabled: true },
  { key: "FEATURE_RESUME_ANALYZER", description: "Resume analyzer", enabled: true },
  { key: "FEATURE_CODE_TEST", description: "Code test module", enabled: true },
];

const AdminFeatureToggles = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = async () => {
    try {
      const response = await axiosInstance.get("/admin/feature-flags");
      const serverFlags = response.data || [];
      const merged = defaultFlags.map((flag) => {
        const match = serverFlags.find((f) => f.key === flag.key);
        return match ? { ...flag, ...match } : flag;
      });
      setFlags(merged);
    } catch (error) {
      toast.error("Failed to fetch feature toggles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const updateFlag = async (flag) => {
    const nextEnabled = !flag.enabled;
    setFlags((prev) => prev.map((f) => (f.key === flag.key ? { ...f, enabled: nextEnabled } : f)));
    try {
      await axiosInstance.patch(`/admin/feature-flags/${flag.key}`, {
        enabled: nextEnabled,
        description: flag.description,
      });
      toast.success(`${flag.key} ${nextEnabled ? "enabled" : "disabled"}`);
    } catch (error) {
      setFlags((prev) => prev.map((f) => (f.key === flag.key ? { ...f, enabled: !nextEnabled } : f)));
      toast.error("Failed to update feature flag");
    }
  };

  return (
    <div className="space-y-8 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Feature Toggles</h1>
        <p className="text-gray-500 dark:text-gray-400">Enable/disable production features in real-time.</p>
      </div>

      <div className="rounded-[2rem] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0F]/60 p-6 space-y-4 shadow-sm dark:shadow-none">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading feature flags...</div>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.key}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10"
            >
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{flag.key}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{flag.description || "No description"}</div>
              </div>
              <button
                onClick={() => updateFlag(flag)}
                className={`px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-colors ${
                  flag.enabled
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20"
                }`}
              >
                {flag.enabled ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFeatureToggles;