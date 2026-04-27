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
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleCareerUpdate = async (updatedFields) => {
    await updateProfile(updatedFields);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12 font-sans selection:bg-primary/30 overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 dark:bg-purple-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[160px] animate-pulse duration-[20s]" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[140px] animate-pulse duration-[25s]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
        
        {/* Intelligence Command Center Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">System Online</span>
            </div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none">
              Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Hub</span>
            </h1>
            <p className="text-sm text-muted-foreground font-bold max-w-md">
              Synchronizing career telemetry and interview performance analytics for {authUser?.fullName}.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="px-4 py-2 rounded-xl bg-card border border-border backdrop-blur-md shadow-sm">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-foreground">ACTIVE CANDIDATE</p>
             </div>
             <div className="px-4 py-2 rounded-xl bg-card border border-border backdrop-blur-md shadow-sm">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Sync</p>
                <p className="text-xs font-black text-foreground uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
             </div>
          </div>
        </div>

        {/* Identity Core */}
        <PersonalInfo atsScore={authUser?.atsScore || 0} />

        {/* Knowledge & Experience Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Document Section (4/12) */}
          <div className="lg:col-span-4 h-full">
            <ResumeSection />
          </div>

          {/* Career Timeline (8/12) */}
          <div className="lg:col-span-8">
            <CareerDetails
              experience={authUser?.experience || []}
              education={authUser?.education || []}
              onUpdate={handleCareerUpdate}
            />
          </div>
        </div>

        {/* Analytics Layer */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            <h3 className="text-2xl font-black text-foreground tracking-tight">Performance Telemetry</h3>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Decrypting Data...</p>
            </div>
          ) : sortedInterviews.length > 0 ? (
            <InterviewStats interviews={sortedInterviews} />
          ) : (
            <div className="p-16 rounded-[3rem] bg-card border border-border border-dashed backdrop-blur-xl text-center group hover:border-primary/30 transition-all shadow-sm">
              <div className="w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl text-muted-foreground">?</span>
              </div>
              <h4 className="text-xl font-black text-foreground mb-2">No Session Data Found</h4>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8">
                Your performance metrics are awaiting your first interaction. Initialize a session to begin tracking.
              </p>
              <button className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                Begin Calibration
              </button>
            </div>
          )}
        </div>

        {/* Footer Attribution */}
        <div className="pt-12 pb-6 flex items-center justify-between border-t border-border">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">EVOM Intelligence Protocol © 2026</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors">Privacy</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
