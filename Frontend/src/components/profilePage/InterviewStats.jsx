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

  const averageScore = interviews.reduce((sum, interview) => sum + interview.score*10, 0) / interviews.length;
  const highestScore = Math.max(...interviews.map(interview => interview.score*10));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Interview Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50">
            <CardContent>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-800">{averageScore.toFixed(1)}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardContent>
              <p className="text-sm text-gray-600">Highest Score</p>
              <p className="text-2xl font-bold text-gray-800">{highestScore}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent>
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-800">{interviews.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent>
              <p className="text-sm text-gray-600">Last Interview</p>
              <p className="text-2xl font-bold text-gray-800">
                {interviews[interviews.length - 1]?.score*10 || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-4">Progress Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Interviews</h3>
          <div className="overflow-auto max-h-48">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SnO.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.slice().reverse().map((interview, index) => (
                  <TableRow key={interview._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{interview.date}</TableCell>
                    <TableCell>{interview.time}</TableCell>
                    <TableCell>{interview.company}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          interview.score >= 80
                            ? "bg-green-500"
                            : interview.score >= 70
                            ? "bg-blue-500"
                            : interview.score >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {interview.score*10}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    <Button onClick={() => window.open(interview.pdfReport, "_blank")}>{interview.actions}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewStats;