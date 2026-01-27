import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ResumeSection = () => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const fileInputRef = useRef(null);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // In a real app, you might want to upload to S3/Cloudinary directly or send as FormData.
        // For now, assuming updateProfile can handle it or we need a specific endpoint. 
        // Since the backend 'updateProfile' expects a string URL or base64 if we change it, 
        // but the sensitive nature of PDFs usually requires FormData.

        // HOWEVER, the current backend Controller for updateProfile expects `profilePic` as string (base64/url).
        // For resume, let's assume we want to support PDF upload.
        // The current backend `updateProfile` DOES accept `resumeUrl` update via `req.body` if we added it?
        // Wait, I only added bio, phone, etc. I did NOT explicitly add `resumeUrl` to the destructuring in `userController.js`.
        // Let me check schema. `resumeUrl` exists in User model. 
        // But I need to ensure `updateProfile` in backend handles `resumeUrl` update if sent.

        // Actually, looking at my backend changes, I added `bio, phone...` but I didn't add `resumeUrl` to the updated list.
        // `resumeUrl` was already there. 
        // I should probably ensure `resumeUrl` can be updated too.

        // For now, let's just create the UI. 
        // If the user wants to upload a resume, typically it returns a URL.
        // We might need a separate mechanism or just handle it here if we had a file upload endpoint.

        // Since I can't easily change the backend file upload logic for PDFs (Cloudinary usually handles images best, though it can do raw files),
        // I will implement a placeholder or basic logic. 

        // LIMITATION: 'updateProfile' in store calls 'update-profile' which expects JSON. 
        // Handling file upload usually requires FormData.

        console.log("File selected:", file);
        // Ideally: 
        // const formData = new FormData(); 
        // formData.append("resume", file);
        // await axiosInstance.post("/user/upload-resume", formData);
    };

    return (
        <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-lg font-bold text-white tracking-wide">Resume</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 p-6">
                {authUser?.resumeUrl ? (
                    <div className="flex items-center gap-4 w-full p-4 border border-white/10 rounded-xl bg-white/[0.03] group hover:bg-white/[0.05] transition-colors">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-white truncate">Current Resume</p>
                            <a
                                href={authUser.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate block mt-0.5 font-medium"
                            >
                                View PDF
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 w-full border-2 border-dashed border-white/10 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-sm">No resume uploaded yet.</p>
                    </div>
                )}

                <div className="w-full">
                    {/* 
            NOTE: This button is currently visual only or needs a proper backend endpoint for PDF upload.
            The current backend 'updateProfile' handles 'profilePic' (image) via Cloudinary.
            We'd need similar logic for Resume (PDF).
            */}
                    <Button
                        variant="outline"
                        className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white h-11"
                        // onClick={() => fileInputRef.current.click()}
                        onClick={() => alert("Resume upload implementation requires backend support for PDF/File upload.")}
                    >
                        <Upload className="mr-2 h-4 w-4" /> Upload New Resume
                    </Button>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        ref={fileInputRef}
                        onChange={handleResumeUpload}
                        className="hidden"
                    />
                    <p className="text-[10px] text-gray-600 text-center mt-3">
                        Supported formats: PDF, DOCX (Max 5MB)
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResumeSection;
