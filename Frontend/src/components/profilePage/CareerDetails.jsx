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
        <div className="space-y-6">
            {/* Experience Section */}
            <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                    <CardTitle className="text-lg font-bold text-white tracking-wide">Experience</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingExp(true)}
                        disabled={isAddingExp}
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {isAddingExp && (
                        <div className="border border-white/10 p-6 rounded-xl space-y-4 bg-white/[0.03] animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider">New Experience</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddingExp(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Company"
                                    value={newExp.company}
                                    onChange={(e) =>
                                        setNewExp({ ...newExp, company: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                                />
                                <Input
                                    placeholder="Role"
                                    value={newExp.role}
                                    onChange={(e) =>
                                        setNewExp({ ...newExp, role: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                                />
                                <Input
                                    placeholder="Duration (e.g., 2020 - 2022)"
                                    value={newExp.duration}
                                    onChange={(e) =>
                                        setNewExp({ ...newExp, duration: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 md:col-span-2"
                                />
                            </div>
                            <Textarea
                                placeholder="Description"
                                value={newExp.description}
                                onChange={(e) =>
                                    setNewExp({ ...newExp, description: e.target.value })
                                }
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 min-h-[100px]"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleAddExperience} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Save Experience
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {experience?.map((exp, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start border-b border-white/5 pb-6 last:border-0 last:pb-0 group"
                            >
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white text-lg">{exp.role}</h4>
                                    <p className="text-sm text-purple-400 font-medium">
                                        {exp.company} <span className="text-gray-600 mx-2">•</span> <span className="text-gray-400">{exp.duration}</span>
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2 whitespace-pre-wrap leading-relaxed max-w-2xl">
                                        {exp.description}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveExperience(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {experience?.length === 0 && !isAddingExp && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No experience added yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[1.5rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                    <CardTitle className="text-lg font-bold text-white tracking-wide">Education</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingEdu(true)}
                        disabled={isAddingEdu}
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Education
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {isAddingEdu && (
                        <div className="border border-white/10 p-6 rounded-xl space-y-4 bg-white/[0.03] animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm text-gray-300 uppercase tracking-wider">New Education</h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddingEdu(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Institution"
                                    value={newEdu.institution}
                                    onChange={(e) =>
                                        setNewEdu({ ...newEdu, institution: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 md:col-span-2"
                                />
                                <Input
                                    placeholder="Degree"
                                    value={newEdu.degree}
                                    onChange={(e) =>
                                        setNewEdu({ ...newEdu, degree: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                                <Input
                                    placeholder="Year"
                                    value={newEdu.year}
                                    onChange={(e) =>
                                        setNewEdu({ ...newEdu, year: e.target.value })
                                    }
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleAddEducation} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Save Education
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {education?.map((edu, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start border-b border-white/5 pb-6 last:border-0 last:pb-0 group"
                            >
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white text-lg">{edu.institution}</h4>
                                    <p className="text-sm text-blue-400 font-medium">
                                        {edu.degree} <span className="text-gray-600 mx-2">•</span> <span className="text-gray-400">{edu.year}</span>
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveEducation(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {education?.length === 0 && !isAddingEdu && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No education added yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CareerDetails;
