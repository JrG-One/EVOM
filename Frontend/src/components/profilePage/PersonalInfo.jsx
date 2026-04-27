import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import defaultAvatar from "@/assets/profile.png";

const PersonalInfo = ({ atsScore }) => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [_, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    phone: authUser?.phone || "",
    location: authUser?.location || "",
    bio: authUser?.bio || "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <Card className="relative overflow-hidden border-border bg-card/50 backdrop-blur-2xl rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group transition-all duration-500">
      {/* Dynamic Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/10 transition-colors duration-1000" />
      
      <CardContent className="p-10 relative z-10">
        <div className="flex flex-col xl:flex-row gap-12 items-start">
          
          {/* Identity Block */}
          <div className="flex flex-col md:flex-row gap-8 flex-1">
            <div className="relative">
              <div className="h-36 w-36 rounded-[2.5rem] p-1 bg-gradient-to-br from-primary via-blue-500 to-emerald-500 animate-gradient-xy">
                <div className="h-full w-full rounded-[2.3rem] overflow-hidden border-4 border-card bg-background flex items-center justify-center relative group/avatar">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={authUser.profilePic || defaultAvatar} className="object-cover" />
                    <AvatarFallback className="bg-background">
                      <img src={defaultAvatar} alt="default" className="w-16 h-16 opacity-20" />
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Update</span>
                  </div>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-3 animate-in slide-in-from-left-4 duration-500">
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="h-12 bg-background border-border text-foreground font-bold text-xl rounded-xl focus:ring-primary/20"
                    placeholder="Full Name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-background border-border text-sm rounded-xl"
                      placeholder="Phone"
                    />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-background border-border text-sm rounded-xl"
                      placeholder="Location"
                    />
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">
                      {authUser.username}
                    </h1>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-bold tracking-widest px-2">
                      Active Candidate
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">{authUser.email}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    {authUser.phone && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground text-xs font-bold shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        {authUser.phone}
                      </div>
                    )}
                    {authUser.location && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground text-xs font-bold shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        {authUser.location}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Professional Brief</h5>
                {isEditing ? (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-[80px] bg-background border-border text-foreground text-sm rounded-xl resize-none"
                    placeholder="Your background..."
                  />
                ) : (
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xl italic">
                    "{authUser.bio || "No professional summary added yet. Introduce yourself to stand out."}"
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isUpdatingProfile} className="bg-primary text-primary-foreground font-bold px-8 hover:opacity-90 rounded-xl transition-all active:scale-95">
                      {isUpdatingProfile ? "Synchronizing..." : "Commit Changes"}
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl">
                      Abort
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="border-border text-foreground hover:bg-accent rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-widest shadow-sm">
                    Edit Identity
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Performance Radar / Score */}
          <div className="w-full xl:w-72">
            <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-card to-background border border-border overflow-hidden group/score shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-bl-[4rem] blur-2xl group-hover/score:bg-primary/10 transition-all duration-700" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">ATS Intelligence</span>
                
                <div className="relative w-40 h-40 mb-6">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-muted/10" strokeWidth="2.5" />
                    <circle 
                      cx="18" cy="18" r="16" fill="none" 
                      stroke="url(#atsGradient)" 
                      strokeWidth="2.5" 
                      strokeDasharray={`${authUser.atsScore}, 100`} 
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-foreground leading-none tabular-nums tracking-tighter">
                      {authUser.atsScore}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1">Percentile</span>
                  </div>
                </div>

                <Badge variant="outline" className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  atsScore >= 80 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                  atsScore >= 60 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                  "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                }`}>
                  {atsScore >= 80 ? "Optimized" : atsScore >= 60 ? "Standard" : "Low Impact"}
                </Badge>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;

