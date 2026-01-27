import { useEffect } from "react";
import PersonalInfo from "../components/profilePage/PersonalInfo";
import InterviewStats from "../components/profilePage/InterviewStats";
import CareerDetails from "../components/profilePage/CareerDetails";
import ResumeSection from "../components/profilePage/ResumeSection";
import { useAuthStore } from "../store/useAuthStore";
import { useInterviewStore } from "@/store/useInterviewStore";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const { interviews, fetchUserInterviews, isLoading } = useInterviewStore();

  useEffect(() => {
    fetchUserInterviews();
  }, [fetchUserInterviews]);

  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  const handleCareerUpdate = async (updatedFields) => {
    await updateProfile(updatedFields);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10 font-sans selection:bg-purple-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">User Profile</h1>
          <p className="text-gray-400 font-medium">Manage your personal information and career history</p>
        </div>

        {/* Personal Info Section */}
        <PersonalInfo atsScore={authUser?.atsScore || 0} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Resume */}
          <div className="space-y-8">
            <ResumeSection />
          </div>

          {/* Right Column: Career Details */}
          <div className="lg:col-span-2 space-y-8">
            <CareerDetails
              experience={authUser?.experience || []}
              education={authUser?.education || []}
              onUpdate={handleCareerUpdate}
            />
          </div>
        </div>

        <div className="h-px bg-white/10 my-8" />

        {/* Interview Stats Section */}
        <div>
          <h3 className="text-xl font-black tracking-tight mb-6">Interview History</h3>
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading interviews...</p>
          ) : sortedInterviews.length > 0 ? (
            <InterviewStats interviews={sortedInterviews} />
          ) : (
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl text-center">
              <p className="text-gray-500 font-medium">
                No interview data available. Start your first interview now!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
