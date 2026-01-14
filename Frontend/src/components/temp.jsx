import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';

// PersonalInfoCard Component
const PersonalInfoCard = ({ personalInfo, atsScore }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{personalInfo.name}</h1>
            <div className="mt-2 text-gray-600">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.location}</p>
              <p>LinkedIn: {personalInfo.linkedin}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-gray-700">ATS Score</h2>
                <div className="flex items-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={atsScore > 80 ? "#48bb78" : atsScore > 60 ? "#f6ad55" : "#f56565"}
                        strokeWidth="4"
                        strokeDasharray={`${atsScore}, 100`}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold">{atsScore}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      Resume strength is {
                        atsScore >= 80 ? "excellent" : 
                        atsScore >= 70 ? "good" : 
                        atsScore >= 60 ? "average" : "needs improvement"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ResumeDetails Component
const ResumeDetails = ({ skills, experience, education }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <p className="font-medium">{exp.title}</p>
                <p className="text-gray-600 text-sm">{exp.duration}</p>
              </div>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{edu.degree}</p>
              <div className="flex justify-between">
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-gray-600 text-sm">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// InterviewStats Component
const InterviewStats = ({ interviews }) => {
  // Calculate interview statistics
  const averageScore = interviews.reduce((sum, interview) => sum + interview.score, 0) / interviews.length;
  const highestScore = Math.max(...interviews.map(interview => interview.score));
  
  // Format the data for the line chart
  const chartData = interviews.map(interview => ({
    date: interview.date,
    score: interview.score,
    position: interview.position
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Interview Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
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
              <p className="text-2xl font-bold text-gray-800">{interviews[interviews.length - 1].score}</p>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-lg font-medium text-gray-700 mb-4">Progress Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Interviews</h3>
          <div className="overflow-auto max-h-48">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.slice().reverse().map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>{interview.date}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>
                      <Badge  className={  
                        interview.score >= 80 ? 'rounded-2xl  bg-green-500' :
                        interview.score >= 70 ? 'rounded-2xl bg-blue-500' :
                        interview.score >= 60 ? 'bg-yellow-500 rounded-2xl' : 'rounded-2xl bg-red-500'
                      }>
                        {interview.score}
                      </Badge>
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

// Sidebar Component
// const Sidebar = ({ interviewPatterns, activePattern, onSelectPattern, onStartInterview }) => {
//   return (
//     <div className="bg-gray-800 text-white p-4 flex flex-col h-full">
//       <h2 className="text-xl font-semibold mb-4">Mock Interviews</h2>
//       <div className="space-y-2">
//         {interviewPatterns.map((pattern) => (
//           <Button
//             key={pattern.id}
//             variant={activePattern === pattern.id ? "secondary" : "ghost"}
//             className="w-full justify-start"
//             onClick={() => onSelectPattern(pattern.id)}
//           >
//             {pattern.name}
//           </Button>
//         ))}
//       </div>
      
//       <div className="mt-auto pt-4">
//         <Button 
//           onClick={onStartInterview}
//           className="w-full bg-green-600 hover:bg-green-700"
//         >
//           Start New Interview
//         </Button>
//       </div>
//     </div>
//   );
// };

// MockInterviewInfo Component
const MockInterviewInfo = ({ selectedPattern }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{selectedPattern.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{selectedPattern.description}</p>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">What to Expect</h3>
          <ul className="list-disc pl-5">
            {selectedPattern.expectations.map((item, index) => (
              <li key={index} className="text-gray-600 mb-1">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Tips</h3>
          <ul className="list-disc pl-5">
            {selectedPattern.tips.map((tip, index) => (
              <li key={index} className="text-gray-600 mb-1">{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          <p className="text-sm text-gray-600">Duration: {selectedPattern.duration} minutes</p>
          <p className="text-sm text-gray-600">Difficulty: {selectedPattern.difficulty}</p>
        </div>
        <Button>Start Practice</Button>
      </CardFooter>
    </Card>
  );
};

// Main App Component
const CandidateProfilePage = () => {
  // Sample data for the candidate profile
  const [candidateData] = useState({
    personalInfo: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/janedoe"
    },
    resume: {
      atsScore: 85,
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "Data Analysis"],
      experience: [
        {
          title: "Senior Frontend Developer",
          company: "Tech Solutions Inc.",
          duration: "2020 - Present",
          description: "Led development of responsive web applications using React and Redux."
        },
        {
          title: "Web Developer",
          company: "Digital Creations LLC",
          duration: "2017 - 2020",
          description: "Developed and maintained client websites and e-commerce platforms."
        }
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "University of Technology",
          year: "2017"
        },
        {
          degree: "Bachelor of Science in Information Technology",
          institution: "State University",
          year: "2015"
        }
      ]
    },
    mockInterviews: [
      { id: 1, date: "2025-03-10", score: 72, position: "Frontend Developer" },
      { id: 2, date: "2025-03-15", score: 78, position: "Frontend Developer" },
      { id: 3, date: "2025-03-20", score: 85, position: "Senior Developer" },
      { id: 4, date: "2025-03-25", score: 89, position: "Senior Developer" }
    ]
  });

  // Mock interview patterns data
  const [interviewPatterns] = useState([
    {
      id: 1,
      name: "Behavioral Interview",
      description: "Practice answering questions about your past experiences, work style, and how you handle various situations.",
      expectations: [
        "Questions about how you've handled challenges in the past",
        "Teamwork and collaboration scenarios",
        "Leadership and initiative examples",
        "Problem-solving approach questions"
      ],
      tips: [
        "Use the STAR method (Situation, Task, Action, Result)",
        "Prepare specific examples from your experience",
        "Be honest and authentic in your responses",
        "Focus on your role and contributions specifically"
      ],
      duration: 30,
      difficulty: "Medium"
    },
    {
      id: 2,
      name: "Technical Problem Solving",
      description: "Solve coding challenges and technical problems while explaining your thought process.",
      expectations: [
        "Algorithm challenges and data structure problems",
        "System design questions",
        "Code debugging exercises",
        "Technical knowledge assessments"
      ],
      tips: [
        "Think out loud as you solve problems",
        "Ask clarifying questions before diving into solutions",
        "Consider edge cases and optimizations",
        "Practice common algorithms and data structures beforehand"
      ],
      duration: 45,
      difficulty: "Hard"
    },
    {
      id: 3,
      name: "System Design Interview",
      description: "Design large-scale systems and discuss architectural decisions.",
      expectations: [
        "High-level system architecture design",
        "Component design and interactions",
        "Scalability and performance considerations",
        "Trade-off discussions"
      ],
      tips: [
        "Understand requirements before starting",
        "Consider scale from the beginning",
        "Discuss trade-offs explicitly",
        "Break down the problem into manageable components"
      ],
      duration: 60,
      difficulty: "Hard"
    },
    {
      id: 4,
      name: "Portfolio Review",
      description: "Present and discuss your past projects and technical decisions.",
      expectations: [
        "Deep dive into your past projects",
        "Discussion of technical choices and alternatives",
        "Challenges faced and how you overcame them",
        "Your specific contributions to team projects"
      ],
      tips: [
        "Prepare to explain your most complex projects",
        "Be ready to discuss technical decisions and alternatives",
        "Highlight your specific role and contributions",
        "Practice explaining technical concepts clearly"
      ],
      duration: 40,
      difficulty: "Medium"
    }
  ]);

  // State for active view and selected interview pattern
  const [activeTab, setActiveTab] = useState("profile"); // Can be 'profile' or 'interview'
  const [activePatternId, setActivePatternId] = useState(1);
  const [sidebarWidth, setSidebarWidth] = useState(15);

  // Get the selected pattern based on active ID
  const selectedPattern = interviewPatterns.find(pattern => pattern.id === activePatternId);

  // Handlers for UI interactions
  const handleSelectPattern = (patternId) => {
    setActivePatternId(patternId);
    setActiveTab("interview");
  };

  const handleStartInterview = () => {
    setActiveTab("interview");
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar 
        interviewPatterns={interviewPatterns}
        activePattern={activePatternId}
        onSelectPattern={handleSelectPattern}
        onStartInterview={handleStartInterview}
      />
      
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={185} minSize={175}>
          <div className="h-full p-6 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="max-w-6xl mx-auto">
                  <PersonalInfoCard 
                    personalInfo={candidateData.personalInfo} 
                    atsScore={candidateData.resume.atsScore} 
                  />
                  
                  <ResizablePanelGroup direction="horizontal" className="mb-6">
                    <ResizablePanel defaultSize={50}>
                      <InterviewStats interviews={candidateData.mockInterviews} />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </TabsContent>
              
              <TabsContent value="interview">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveTab("profile")}
                      className="flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Profile
                    </Button>
                  </div>
                  
                  <MockInterviewInfo selectedPattern={selectedPattern} />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Previous Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Interview Type</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {candidateData.mockInterviews
                            .filter(interview => 
                              selectedPattern && 
                              interview.position.includes(selectedPattern.name.split(" ")[0])
                            )
                            .map((interview) => (
                              <TableRow key={interview.id}>
                                <TableCell>{interview.date}</TableCell>
                                <TableCell>{selectedPattern?.name}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    interview.score >= 80 ? 'bg-green-500' :
                                    interview.score >= 70 ? 'bg-blue-500' :
                                    interview.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }>
                                    {interview.score}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">View</Button>
                                    <Button variant="outline" size="sm">Retry</Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CandidateProfilePage;