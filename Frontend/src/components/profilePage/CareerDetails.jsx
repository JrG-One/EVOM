import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";

const CareerDetails = ({ experience = [], education = [], onUpdate }) => {
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [isAddingEdu, setIsAddingEdu] = useState(false);

    const [newExp, setNewExp] = useState({
        company: "",
        role: "",
        duration: "",
        description: "",
    });

    const [newEdu, setNewEdu] = useState({
        institution: "",
        degree: "",
        year: "",
    });

    const handleAddExperience = () => {
        if (!newExp.company || !newExp.role) return;
        const updatedExp = [...experience, newExp];
        onUpdate({ experience: updatedExp });
        setNewExp({ company: "", role: "", duration: "", description: "" });
        setIsAddingExp(false);
    };

    const handleRemoveExperience = (index) => {
        const updatedExp = experience.filter((_, i) => i !== index);
        onUpdate({ experience: updatedExp });
    };

    const handleAddEducation = () => {
        if (!newEdu.institution || !newEdu.degree) return;
        const updatedEdu = [...education, newEdu];
        onUpdate({ education: updatedEdu });
        setNewEdu({ institution: "", degree: "", year: "" });
        setIsAddingEdu(false);
    };

    const handleRemoveEducation = (index) => {
        const updatedEdu = education.filter((_, i) => i !== index);
        onUpdate({ education: updatedEdu });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Experience Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full" />
                        Experience
                    </h3>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsAddingExp(true)}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus className="mr-2 h-3 w-3" /> Add Entry
                    </Button>
                </div>

                {isAddingExp && (
                    <Card className="bg-card border-border p-6 space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Company"
                                value={newExp.company}
                                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                className="bg-background border-border text-foreground text-xs h-10"
                            />
                            <Input
                                placeholder="Role"
                                value={newExp.role}
                                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                                className="bg-background border-border text-foreground text-xs h-10"
                            />
                        </div>
                        <Input
                            placeholder="Duration (e.g., 2020 - 2022)"
                            value={newExp.duration}
                            onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                            className="bg-background border-border text-foreground text-xs h-10"
                        />
                        <Textarea
                            placeholder="Briefly describe your achievements..."
                            value={newExp.description}
                            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                            className="bg-background border-border text-foreground text-xs min-h-[80px] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsAddingExp(false)} className="text-muted-foreground">Cancel</Button>
                            <Button size="sm" onClick={handleAddExperience} className="bg-primary text-primary-foreground font-bold px-4 hover:opacity-90">Add</Button>
                        </div>
                    </Card>
                )}

                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
                    {experience?.map((exp, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 shadow-[0_0_10px_rgba(139,92,246,0.2)]" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                                        {exp.company?.charAt(0) || "C"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-foreground leading-none truncate">{exp.role}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveExperience(index)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary mt-1">
                                            <span className="truncate">{exp.company}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-muted-foreground whitespace-nowrap">{exp.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pt-3 pl-14">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {experience?.length === 0 && !isAddingExp && (
                        <p className="text-muted-foreground text-xs italic py-4">No professional experience recorded.</p>
                    )}
                </div>
            </div>

            {/* Education Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                        Education
                    </h3>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsAddingEdu(true)}
                        className="text-muted-foreground hover:text-foreground hover:bg-accent text-[10px] font-black uppercase tracking-widest"
                    >
                        <Plus className="mr-2 h-3 w-3" /> Add Entry
                    </Button>
                </div>

                {isAddingEdu && (
                    <Card className="bg-card border-border p-6 space-y-4 animate-in zoom-in-95 duration-300">
                        <Input
                            placeholder="Institution"
                            value={newEdu.institution}
                            onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                            className="bg-background border-border text-foreground text-xs h-10"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Degree"
                                value={newEdu.degree}
                                onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                                className="bg-background border-border text-foreground text-xs h-10"
                            />
                            <Input
                                placeholder="Year"
                                value={newEdu.year}
                                onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                                className="bg-background border-border text-foreground text-xs h-10"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsAddingEdu(false)} className="text-muted-foreground">Cancel</Button>
                            <Button size="sm" onClick={handleAddEducation} className="bg-blue-600 text-white hover:opacity-90 font-bold px-4">Add</Button>
                        </div>
                    </Card>
                )}

                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-600/50 before:via-border before:to-transparent">
                    {education?.map((edu, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-blue-600 z-10 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                            <div className="space-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-black text-sm shrink-0">
                                        {edu.institution?.charAt(0) || "E"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-foreground leading-none truncate">{edu.institution}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveEducation(index)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 mt-1">
                                            <span className="truncate">{edu.degree}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-muted-foreground whitespace-nowrap">{edu.year}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {education?.length === 0 && !isAddingEdu && (
                        <p className="text-muted-foreground text-xs italic py-4">No educational history recorded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerDetails;
