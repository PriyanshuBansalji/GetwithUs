import { create } from "zustand";

export type Quality = "high" | "medium" | "low" | "none";

type SceneState = {
  /** Undecided until a panel picks a tier as it mounts. */
  quality: Quality | null;
  setQuality: (quality: Quality) => void;
};

/** The 3D quality tier for this visit, shared by every model panel on the page. */
export const useSceneStore = create<SceneState>()((set) => ({
  quality: null,
  setQuality: (quality) => set({ quality }),
}));
