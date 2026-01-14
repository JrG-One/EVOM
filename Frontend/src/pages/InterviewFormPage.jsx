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
// import { useFormStore } from "../store/useFormStore";
import { ChevronLeft } from "lucide-react";
import { useInterviewStore } from "../store/useInterviewStore";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Job role must be at least 2 characters." }),
  experience: z.string().min(1, { message: "Experience is required." }),
  prefferedLanguage: z.string().min(2, { message: "Preferred language must be at least 2 characters." }),
  interviewType: z.string({ required_error: "Please select an interview type." }),
});

const InterviewForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      role: "",
      experience: "",
      prefferedLanguage: "",
      interviewType: "",
    },
  });

  const { setFormData } = useInterviewStore();

  function onSubmit(values) {
    const updatedValues = {
      ...values,
      codingRound: values.interviewType === "Technical",
    };
    setFormData(updatedValues);
    navigate("/interview");
  }

  return (
    <>
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <Button
        onClick={() => navigate("/portal")}
        variant="outline"
        size="icon"
        className="absolute top-4 left-4"
        >
            <ChevronLeft />
        </Button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Interview Form</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/** Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/** Company */}
            <FormField control={form.control} name="company" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Company</FormLabel>
                <FormControl>
                  <Input placeholder="Google" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/** Role */}
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Job Role</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/** Experience */}
            <FormField control={form.control} name="experience" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Years of Experience</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/** Language */}
            <FormField control={form.control} name="prefferedLanguage" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Preferred Language</FormLabel>
                <FormControl>
                  <Input placeholder="JavaScript" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/** Interview Type */}
            <FormField control={form.control} name="interviewType" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Interview Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Behavioural">Behavioural</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <Button
              type="submit"
              className="w-full mt-4"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
    </>
  );
};

export default InterviewForm;
