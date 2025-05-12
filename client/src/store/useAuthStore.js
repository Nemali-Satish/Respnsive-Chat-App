import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,

  isSigingUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      console.log(response.data);

      set({ authUser: response.data });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during sign up"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);

      set({ authUser: response.data.User });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during sign up"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      console.log(response.data);

      set({ authUser: response.data.User });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.error("Error Updating Progile:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during Uploading Profile"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
