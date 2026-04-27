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
        console.log("File selected:", file);
    };

    return (
        <div className="h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                <h3 className="text-xl font-black text-foreground tracking-tight">Intelligence Vault</h3>
            </div>

            <div className="p-8 rounded-[2rem] bg-card/50 border border-border backdrop-blur-xl relative overflow-hidden group min-h-[300px] flex flex-col justify-center shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl" />
                
                {authUser?.resumeUrl ? (
                    <div className="space-y-6 text-center">
                        <div className="relative inline-block">
                            <div className="p-6 rounded-2xl bg-background border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <FileText className="h-12 w-12" />
                            </div>
                            <div className="absolute -right-2 -bottom-2 bg-emerald-500 text-slate-950 rounded-full p-1 border-4 border-card">
                                <div className="w-2 h-2 rounded-full bg-slate-950" />
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-lg font-black text-foreground mb-1">Resume_Final_v1.pdf</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Verified Document</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={authUser.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                Preview Document
                            </a>
                            <Button
                                variant="ghost"
                                className="h-12 text-muted-foreground hover:text-foreground hover:bg-accent font-black text-[10px] uppercase tracking-widest rounded-xl"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <Upload className="mr-2 h-3 w-3" /> Replace Version
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-background border border-dashed border-border flex items-center justify-center mx-auto group-hover:border-emerald-500/50 transition-colors shadow-inner">
                            <Upload className="h-8 w-8 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Vault Empty</p>
                            <p className="text-[10px] text-muted-foreground/60 font-bold mt-2 leading-relaxed">
                                Upload your resume to calibrate<br />our AI interview intelligence.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-12 px-8 rounded-xl bg-card border border-border text-foreground hover:bg-accent font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Select Document
                        </Button>
                    </div>
                )}

                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    ref={fileInputRef}
                    onChange={handleResumeUpload}
                    className="hidden"
                />
                <p className="absolute bottom-6 left-0 right-0 text-[8px] text-muted-foreground font-bold text-center uppercase tracking-[0.2em]">
                    Encrypted · AES-256 Secured
                </p>
            </div>
        </div>
    );
};

export default ResumeSection;
