import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import defaultAvatar from "@/assets/profile.png";

const PersonalInfo = ({ atsScore }) => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [_, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

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

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={authUser.profilePic || defaultAvatar} />
                <AvatarFallback>
                  <img
                    src={defaultAvatar}
                    alt="default avatar"
                    className="h-full w-full object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-lg font-semibold">{authUser.username}</h4>
                <p className="text-md">{authUser.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleButtonClick}
                disabled={isUpdatingProfile}
                className="hover:cursor-pointer"
              >
                {isUpdatingProfile ? "Uploading..." : "Upload Photo"}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              {/* <Button>upload resume</Button> */}
              <Button
                onClick={() => window.open(authUser.resumeUrl, "_blank")}
                className="hover:cursor-pointer"
              >
                view resume
              </Button>
            </div>
          </div>

          {/* ATS Score Card */}
          <div className="mt-4 md:mt-0">
            <Card className="bg-blue-50">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-700">
                  ATS Score
                </h2>
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
                        stroke={
                          atsScore > 80
                            ? "#48bb78"
                            : atsScore > 60
                              ? "#f6ad55"
                              : "#f56565"
                        }
                        strokeWidth="4"
                        strokeDasharray={`${authUser.atsScore}, 100`}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {authUser.atsScore}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">
                      Resume strength is{" "}
                      {authUser.atsScore >= 80
                        ? "excellent"
                        : authUser.atsScore >= 70
                          ? "good"
                          : authUser.atsScore >= 60
                            ? "average"
                            : "needs improvement"}
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
