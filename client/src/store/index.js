import { create } from "zustand";
import { createAUthSlice } from "./slices/auth-slice";

export const useAppStore = create()((...a) => ({
  ...createAUthSlice(...a),
}));
