import React from "react";
import {
  Code,
  BookOpen,
  Users,
  MessageSquare,
  ClipboardList,
  Video,
  Briefcase,
  Target,
  Monitor,
} from "lucide-react";

const resources = [
  {
    id: "google-interview-question",
    title: "Google Interview Questions",
    description:
      "Practice the most asked interview questions in Google curated from InterviewBit.",
    icon: <ClipboardList />,
    link: "https://www.interviewbit.com/google-interview-questions/",
  },
  {
    id: "striver-sheet",
    title: "Striver SDE Sheet",
    description:
      "Solve Striver’s SDE Sheet to ace your Data Structures & Algorithms preparation.",
    icon: <Code />,
    link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
  },
  {
    id: "microsoft-interview-question",
    title: "Microsoft Interview Questions",
    description:
      "Frequently asked interview question in Microsoft from Indeed",
    icon: <ClipboardList />,
    link: "https://ie.indeed.com/career-advice/interviewing/microsoft-interview-questions",
  },
  {
    id: "cses-problem-sheet",
    title: "CSES Problem Sheet",
    description:
      "A collection of comprehensive high quality problem set for learning algorithmic programming.",
    icon: <Code />,
    link: "https://cses.fi/problemset/",
  },
  
  {
    id: "interview-experiences",
    title: "Interview Experiences",
    description:
      "Read about real interview experiences shared by candidates from top companies.",
    icon: <BookOpen />,
    link: "https://leetcode.com/discuss/interview-experience",
  },
  {
    id: "resume-review",
    title: "Resume Review",
    description:
      "Get your resume reviewed by industry experts to improve your chances of getting shortlisted.",
    icon: <Briefcase />,
    link: "http://ec2-52-66-131-35.ap-south-1.compute.amazonaws.com/analyser"
  },
  {
    id: "blogs",
    title: "Tech Blogs",
    description:
      "Stay updated with the latest tech trends and industry insights through informative blogs.",
    icon: <MessageSquare />,
    link: "https://medium.com/tag/technology",
  },
  {
    id: "dsa-roadmap",
    title: "DSA Roadmap",
    description:
      "Follow a structured roadmap to master Data Structures and Algorithms step by step.",
    icon: <Target />,
    link: "https://roadmap.sh/computer-science",
  },
  {
    id: "system-design",
    title: "System Design Guide",
    description:
      "Learn system design concepts to crack high-level interviews at FAANG companies.",
    icon: <Monitor />,
    link: "https://github.com/donnemartin/system-design-primer",
  },
];

const ResourceCard = ({ title, description, icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-50 p-6 rounded-md flex flex-col items-center text-center hover:shadow-md transition-shadow block"
    >
      <div className="text-purple-800 mb-3 text-4xl">{icon}</div>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
};

const ResourcePage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Enhanced header with background and better styling */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-lg p-6 mb-10">
        <div className="flex items-center">
          <div className="w-12 h-12 mr-4 bg-white p-2 rounded-lg shadow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="6" height="10" rx="1" fill="#3034A9" />
              <rect x="9" y="5" width="6" height="14" rx="1" fill="#4045C9" />
              <rect x="16" y="9" width="6" height="6" rx="1" fill="#5156E5" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Resources Page</h1>
            <p className="text-blue-100 mt-1">
              Explore useful resources for learning and improving your skills.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            href={resource.link}
            title={resource.title}
            description={resource.description}
            icon={resource.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcePage;