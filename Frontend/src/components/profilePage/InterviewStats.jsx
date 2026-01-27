import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InterviewStats = ({ interviews }) => {
  const chartData = interviews.map((interview) => {
    const createdAt = new Date(interview.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-GB"); // e.g. 05/04/2025
    const formattedTime = createdAt.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
    }); // e.g. 04:15 PM

    return {
      ...interview,
      date: formattedDate,
      time: formattedTime,
      position: interview.role,
      actions: interview.pdfReport !== "No File" ? "View Report" : "Not Available",
    };
  });

  const averageScore = interviews.reduce((sum, interview) => sum + interview.score * 10, 0) / (interviews.length || 1);
  const highestScore = Math.max(...interviews.map(interview => interview.score * 10), 0);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1">Average Score</p>
            <p className="text-3xl font-black text-white">{averageScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-1">Highest Score</p>
            <p className="text-3xl font-black text-white">{highestScore}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Total Interviews</p>
            <p className="text-3xl font-black text-white">{interviews.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <p className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-1">Last Score</p>
            <p className="text-3xl font-black text-white">
              {interviews.length > 0 ? interviews[interviews.length - 1].score * 10 : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold text-white tracking-wide">Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111", borderColor: "#333", borderRadius: "8px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey={(data) => data.score * 10}
                    name="Score"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent List (Simplified Table) */}
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold text-white tracking-wide">Recent Activity</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-bold uppercase text-xs w-[100px]">Date</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs">Role</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase text-xs text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.slice().reverse().map((interview, index) => (
                  <TableRow key={interview.id || index} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                    <TableCell className="text-gray-400 text-xs font-medium">{interview.date}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-white text-sm">{interview.role}</div>
                      <div className="text-xs text-gray-500">{interview.company}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${interview.score * 10 >= 80 ? "text-emerald-400" :
                          interview.score * 10 >= 60 ? "text-amber-400" : "text-red-400"
                        }`}>
                        {interview.score * 10}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewStats;