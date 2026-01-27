import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";  // Ensure this component exists
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <Card className="mb-6 bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-[2rem] overflow-hidden">
      <CardContent className="pt-8 px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white/10 ring-4 ring-white/5 shadow-2xl">
                  <AvatarImage src={authUser.profilePic || defaultAvatar} className="object-cover" />
                  <AvatarFallback className="bg-gray-800 text-gray-400">
                    <img
                      src={defaultAvatar}
                      alt="default avatar"
                      className="h-full w-full object-cover rounded-full opacity-50"
                    />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  onClick={handleButtonClick}
                >
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Change</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <div className="space-y-3 max-w-md animate-in fade-in slide-in-from-left-4 duration-500">
                    <Input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Full Name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Phone Number"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Location"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h4 className="text-3xl font-black text-white tracking-tight mb-1">
                      {authUser.username}
                    </h4>
                    <p className="text-gray-400 font-medium text-lg">{authUser.email}</p>
                    {authUser.phone && (
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {authUser.phone}
                      </p>
                    )}
                    {authUser.location && (
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {authUser.location}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <h5 className="font-bold text-gray-400 uppercase tracking-widest text-xs">About</h5>
              {isEditing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                />
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {authUser.bio || <span className="text-gray-600 italic">No bio added yet.</span>}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isUpdatingProfile} className="bg-white text-black hover:bg-gray-200">
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdatingProfile}
                    className="border-white/10 text-white hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-white">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* ATS Score Card */}
          <div className="w-full md:w-auto">
            <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10 backdrop-blur-md rounded-[1.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-bl-[4rem] translate-x-8 -translate-y-8 blur-2xl group-hover:bg-purple-500/20 transition-colors duration-700" />
              <CardContent className="p-8 relative z-10">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                  ATS Score
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={
                          atsScore > 80
                            ? "#34d399" // emerald-400
                            : atsScore > 60
                              ? "#fbbf24" // amber-400
                              : "#f87171" // red-400
                        }
                        strokeWidth="3"
                        strokeDasharray={`${authUser.atsScore}, 100`}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white">
                        {authUser.atsScore}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Resume strength</p>
                    <p className={`text-xl font-bold ${atsScore >= 80 ? "text-emerald-400" :
                      atsScore >= 60 ? "text-amber-400" : "text-red-400"
                      }`}>
                      {authUser.atsScore >= 80
                        ? "Excellent"
                        : authUser.atsScore >= 70
                          ? "Good"
                          : authUser.atsScore >= 60
                            ? "Average"
                            : "Needs Work"}
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

export default PersonalInfo;
