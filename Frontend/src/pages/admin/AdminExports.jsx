import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

const exportsList = [
  { key: "users", title: "Users Report" },
  { key: "interviews", title: "Interviews Report" },
  { key: "credits", title: "AI Credits Report" },
];

const AdminExports = () => {
  const downloadCsv = async (type) => {
    try {
      const response = await axiosInstance.get(`/admin/exports/${type}?format=csv`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${type}-report.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${type} report downloaded`);
    } catch (error) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Exports</h1>
        <p className="text-gray-400">Download operational reports in CSV format.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exportsList.map((item) => (
          <div key={item.key} className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
            <h2 className="text-lg font-bold mb-3">{item.title}</h2>
            <button
              onClick={() => downloadCsv(item.key)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-bold transition-colors"
            >
              Download CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExports;
