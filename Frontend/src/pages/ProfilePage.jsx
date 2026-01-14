import { useEffect } from "react";
import PersonalInfo from "../components/profilePage/PersonalInfo";
import InterviewStats from "../components/profilePage/InterviewStats";
import { useAuthStore } from "../store/useAuthStore";
import { useInterviewStore } from "@/store/useInterviewStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { interviews, fetchUserInterviews, isLoading } = useInterviewStore();

  useEffect(() => {
    fetchUserInterviews();
  }, [fetchUserInterviews]);

  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  return (
    <div className="w-full p-4">
      {/* Personal Info */}
      <PersonalInfo atsScore={authUser?.atsScore || 0} />

      {/* Interview Stats */}
      {isLoading ? (
        <p className="text-gray-500 text-center mt-4">Loading interviews...</p>
      ) : sortedInterviews.length > 0 ? (
        <InterviewStats interviews={sortedInterviews} />
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No interview data available
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
