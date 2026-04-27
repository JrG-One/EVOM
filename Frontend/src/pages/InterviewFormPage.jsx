"use client";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Sparkles, Wand2 } from "lucide-react";
import { useInterviewStore } from "../store/useInterviewStore";

const COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Uber", "Airbnb", "Standard Chartered", "JP Morgan", "Goldman Sachs", "Other"
];

const ROLES = [
  "Software Engineer (SDE I)", "Senior Software Engineer (SDE II)", "Staff Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "DevOps Engineer", "Data Scientist", "Other"
];

const EXPERIENCE_LEVELS = [
  "Fresher", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6-9 Years", "10+ Years"
];

const formSchema = z.object({
  company: z.string().min(1, { message: "Please select a company." }),
  manualCompany: z.string().optional(),
  role: z.string().min(1, { message: "Please select a job role." }),
  manualRole: z.string().optional(),
  experience: z.string().min(1, { message: "Experience is required." }),
  interviewType: z.string({ required_error: "Please select an interview type." }),
  preferredLanguage: z.string().optional(),
}).refine((data) => {
  if (data.company === "Other" && (!data.manualCompany || data.manualCompany.trim().length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Please enter the company name.",
  path: ["manualCompany"],
}).refine((data) => {
  if (data.role === "Other" && (!data.manualRole || data.manualRole.trim().length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Please enter the job role.",
  path: ["manualRole"],
}).refine((data) => {
  if ((data.interviewType === "Technical" || data.interviewType === "System Design") && (!data.preferredLanguage || data.preferredLanguage.length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Preferred language is required for Technical and System Design interviews.",
  path: ["preferredLanguage"],
});

const InterviewForm = () => {
  const navigate = useNavigate();
  const { setFormData } = useInterviewStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      manualCompany: "",
      role: "",
      manualRole: "",
      experience: "",
      preferredLanguage: "",
      interviewType: "",
    },
  });

  const watchInterviewType = form.watch("interviewType");
  const watchCompany = form.watch("company");
  const watchRole = form.watch("role");

  const showLanguageInput = watchInterviewType === "Technical" || watchInterviewType === "System Design";
  const showManualCompany = watchCompany === "Other";
  const showManualRole = watchRole === "Other";

  async function onSubmit(values) {
    const finalCompany = values.company === "Other" ? values.manualCompany : values.company;
    const finalRole = values.role === "Other" ? values.manualRole : values.role;

    const updatedValues = {
      ...values,
      company: finalCompany,
      role: finalRole,
      codingRound: values.interviewType === "Technical" || values.interviewType === "System Design",
    };
    await setFormData(updatedValues);
    navigate("/interview");
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-10 font-sans selection:bg-primary/30 flex items-center justify-center relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-card border border-border backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="p-8 pb-12">
          <Button
            onClick={() => navigate("/portal")}
            variant="ghost"
            size="icon"
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="text-center mb-8 mt-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/20 text-primary mb-4 ring-1 ring-border shadow-lg">
              <Wand2 className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Configure Session</h2>
            <p className="text-muted-foreground text-sm">Customize your AI mock interview parameters</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Company */}
              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-muted-foreground ml-1">Target Company</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border text-popover-foreground max-h-[280px]">
                      {COMPANIES.map(comp => (
                        <SelectItem key={comp} value={comp} className="focus:bg-primary/20 focus:text-foreground cursor-pointer">{comp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive text-xs ml-1" />
                </FormItem>
              )} />

              {/* Manual Company (Conditional) */}
              {showManualCompany && (
                <FormField control={form.control} name="manualCompany" render={({ field }) => (
                  <FormItem className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
                        className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs ml-1" />
                  </FormItem>
                )} />
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Role */}
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-muted-foreground ml-1">Job Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border text-popover-foreground max-h-[280px]">
                        {ROLES.map(role => (
                          <SelectItem key={role} value={role} className="focus:bg-primary/20 focus:text-foreground cursor-pointer">{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-xs ml-1" />
                  </FormItem>
                )} />

                {/* Experience */}
                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-muted-foreground ml-1">Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80">
                          <SelectValue placeholder="Select exp" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border text-popover-foreground">
                        {EXPERIENCE_LEVELS.map(exp => (
                          <SelectItem key={exp} value={exp} className="focus:bg-primary/20 focus:text-foreground cursor-pointer">{exp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-xs ml-1" />
                  </FormItem>
                )} />
              </div>

              {/* Manual Role (Conditional) */}
              {showManualRole && (
                <FormField control={form.control} name="manualRole" render={({ field }) => (
                  <FormItem className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <FormControl>
                      <Input
                        placeholder="Enter job role"
                        className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs ml-1" />
                  </FormItem>
                )} />
              )}

              {/* Interview Type */}
              <FormField control={form.control} name="interviewType" render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-muted-foreground ml-1">Interview Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      <SelectItem value="Technical" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">Technical</SelectItem>
                      <SelectItem value="System Design" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">System Design</SelectItem>
                      <SelectItem value="Behavioural" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">Behavioural</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive text-xs ml-1" />
                </FormItem>
              )} />

              {/* Language (Conditional) */}
              {showLanguageInput && (
                <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
                  <FormItem className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <FormLabel className="text-sm font-medium text-muted-foreground ml-1">Programming Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 rounded-xl h-12 px-4 transition-all hover:bg-accent/80">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="python" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">Python</SelectItem>
                        <SelectItem value="javascript" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">JavaScript</SelectItem>
                        <SelectItem value="java" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">Java</SelectItem>
                        <SelectItem value="cpp" className="focus:bg-primary/20 focus:text-foreground cursor-pointer">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-xs ml-1" />
                  </FormItem>
                )} />
              )}

              <Button
                type="submit"
                className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 h-12 rounded-xl font-bold text-lg shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Simulation
              </Button>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default InterviewForm;
