import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useFormStore = create((set,get) => ({
  formData: {
    name: "",
    company: "",
    role: "",
    experience: "",
    prefferedLanguage: "",
    codingRound:false,
  },

  interviewId:null,

  setFormData: async(data) => {

    console.log("Sending data:", data);
    const response = await axiosInstance.post("/interview/", data);
    console.log("Response received:", response.data);

    set((state) => ({
      formData: { ...state.formData, ...data },
      interviewId: response.data.interviewId,  // Store interview ID
    }));

    
  },
}));