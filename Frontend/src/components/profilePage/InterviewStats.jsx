import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const InterviewStats = ({ interviews }) => {
  const chartData = interviews.map((interview) => {
    const createdAt = new Date(interview.createdAt);
    const formattedDate = createdAt.toLocaleDateString("en-GB"); 
    const formattedTime = createdAt.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      ...interview,
      date: formattedDate,
      time: formattedTime,
      scoreValue: interview.score * 10,
    };
  });

  const averageScore = interviews.reduce((sum, interview) => sum + interview.score * 10, 0) / (interviews.length || 1);
  const highestScore = Math.max(...interviews.map(interview => interview.score * 10), 0);

  return (
    <div className="space-y-8">
      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-[1.5rem] bg-card border border-emerald-500/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Success Velocity</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-foreground tabular-nums">{averageScore.toFixed(1)}</p>
            <span className="text-[10px] font-bold text-muted-foreground pb-1">Avg Score</span>
          </div>
        </div>

        <div className="p-6 rounded-[1.5rem] bg-card border border-purple-500/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4">Peak Performance</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-foreground tabular-nums">{highestScore}</p>
            <span className="text-[10px] font-bold text-muted-foreground pb-1">Best Score</span>
          </div>
        </div>

        <div className="p-6 rounded-[1.5rem] bg-card border border-blue-500/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Engagement Depth</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-foreground tabular-nums">{interviews.length}</p>
            <span className="text-[10px] font-bold text-muted-foreground pb-1">Sessions</span>
          </div>
        </div>

        <div className="p-6 rounded-[1.5rem] bg-card border border-amber-500/10 backdrop-blur-xl relative overflow-hidden group shadow-sm transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Recent Pulse</p>
          <div className="flex items-end justify-between">
            <p className="text-4xl font-black text-foreground tabular-nums">
              {interviews.length > 0 ? (interviews[interviews.length - 1].score * 10).toFixed(0) : "0"}
            </p>
            <span className="text-[10px] font-bold text-muted-foreground pb-1">Last Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Intelligence Visualization */}
        <div className="lg:col-span-2 p-8 rounded-[2rem] bg-card border border-border backdrop-blur-3xl shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Growth Trajectory</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Score Evolution over time</p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
              <div className="w-2 h-2 rounded-full bg-muted" />
            </div>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="currentColor" className="opacity-5" />
                <XAxis 
                  dataKey="date" 
                  stroke="currentColor" 
                  fontSize={10} 
                  fontFamily="Inter"
                  axisLine={false}
                  tickLine={false}
                  tick={{ transform: 'translate(0, 10)' }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="currentColor" 
                  fontSize={10}
                  fontFamily="Inter"
                  axisLine={false}
                  tickLine={false}
                  tickCount={6}
                  className="text-muted-foreground"
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: "1px solid hsl(var(--border))", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    color: "hsl(var(--foreground))"
                  }}
                  itemStyle={{ fontWeight: "900", fontSize: "12px" }}
                  labelStyle={{ fontWeight: "700", marginBottom: "4px", fontSize: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="scoreValue"
                  name="Proficiency"
                  stroke="var(--primary)"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "hsl(var(--background))", stroke: "var(--primary)", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: "hsl(var(--foreground))", stroke: "var(--primary)", strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tactical Feed */}
        <div className="p-8 rounded-[2rem] bg-card border border-border backdrop-blur-3xl shadow-xl flex flex-col transition-all duration-500">
          <div className="mb-8">
            <h3 className="text-lg font-black text-foreground tracking-tight">Tactical Feed</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Live interaction history</p>
          </div>
          
          <div className="flex-1 space-y-6 overflow-auto pr-2 custom-scrollbar">
            {chartData.slice().reverse().map((interview, index) => (
              <div key={interview.id || index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[1px] before:bg-border last:before:hidden group">
                <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 border-border z-10 group-hover:border-primary group-hover:shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)] transition-all" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground tabular-nums uppercase">{interview.date}</span>
                    <span className={`text-[10px] font-black uppercase ${
                      interview.scoreValue >= 80 ? "text-emerald-500" :
                      interview.scoreValue >= 60 ? "text-amber-500" : "text-red-500"
                    }`}>
                      {interview.scoreValue}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{interview.role}</h4>
                    {interview.pdfReport && interview.pdfReport !== "No File" && (
                      <a 
                        href={interview.pdfReport} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9px] font-black text-primary hover:text-foreground uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-md bg-primary/5 transition-all"
                      >
                        Report
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground">{interview.company}</p>
                </div>
              </div>
            ))}
            {chartData.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted border border-dashed border-border flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">!</span>
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Feed Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewStats;