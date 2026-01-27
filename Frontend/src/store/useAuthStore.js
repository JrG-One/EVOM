import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  atsScore: 0,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    // Check for demo user first
    const demoUser = localStorage.getItem("demo-user");
    if (demoUser) {
      set({ authUser: JSON.parse(demoUser), isCheckingAuth: false });
      return;
    }

    try {
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in  checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    console.log("data in signup:", data);
    try {
      await axiosInstance.post("/user/signup", data);
      toast("Account created! You can now login.");
    } catch (error) {
      console.log("Error in signup:", error.message);
      toast(error.response.data.error || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    // Frontend Bypass for Demo User
    if (data.email === "demo@entervue.ai") {
      const mockUser = {
        _id: "demo-id",
        username: "Demo User",
        email: "demo@entervue.ai",
        profilePic: "",
        atsScore: 85,
        isAdmin: false,
      };
      set({ authUser: mockUser });
      localStorage.setItem("demo-user", JSON.stringify(mockUser));
      toast("Logged in as Demo User");
      set({ isLoggingIn: false });
      return;
    }

    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ authUser: res.data });
      toast("Logged in successfully");
    } catch (error) {
      toast(error.response?.data?.error || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("demo-user"); // Clear demo session
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      // Even if backend fails, clear local state
      set({ authUser: null });
      toast("Logged out successfully");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast({ title: error.response.data.error, variant: "destructive" });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateScore: async (data) => {
    try {
      const res = await axiosInstance.put("/user/update-ats-score", data);
      set((state) => ({
        authUser: {
          ...state.authUser,
          atsScore: res.data.atsScore,
        },
      }));
    } catch (error) {
      console.log("Error updating score:", error);
      toast({
        title: error?.response?.data?.error || "Failed to update ATS score",
        variant: "destructive",
      });
    }
  },
}));
