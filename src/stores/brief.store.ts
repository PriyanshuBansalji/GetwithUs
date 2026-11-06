import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BriefDraft = {
  services: string[];
  description: string;
  existingUrl: string;
  budgetRange: string;
  timeline: string;
  contact: { name: string; email: string; company: string; phone: string; referral: string };
};

/** Where the brief is: steps 1 to 4 edit the draft, 5 verifies, then done. */
export type BriefStep = 1 | 2 | 3 | 4 | 5;

type Pending = { leadId: string; email: string; resendAvailableAt: string };

type BriefState = {
  draft: BriefDraft;
  step: BriefStep;
  /** Set after "Send and verify" succeeds, until the code is confirmed. */
  pending: Pending | null;
  done: boolean;
  update: (
    patch: Partial<Omit<BriefDraft, "contact">> & { contact?: Partial<BriefDraft["contact"]> },
  ) => void;
  goTo: (step: BriefStep) => void;
  submitted: (pending: Pending) => void;
  resent: (resendAvailableAt: string) => void;
  editEmail: () => void;
  finish: () => void;
};

const emptyDraft: BriefDraft = {
  services: [],
  description: "",
  existingUrl: "",
  budgetRange: "",
  timeline: "",
  contact: { name: "", email: "", company: "", phone: "", referral: "" },
};

// Server rendering has no sessionStorage; persist is rehydrated on the client after mount.
const noStorage = { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };

/**
 * The project brief draft. Persisted to sessionStorage under `gw-brief-v1`, so a
 * refresh keeps the answers; cleared once the brief is confirmed.
 */
export const useBriefStore = create<BriefState>()(
  persist(
    (set) => ({
      draft: emptyDraft,
      step: 1,
      pending: null,
      done: false,
      update: ({ contact, ...rest }) =>
        set((state) => ({
          draft: { ...state.draft, ...rest, contact: { ...state.draft.contact, ...contact } },
        })),
      goTo: (step) => set({ step }),
      submitted: (pending) => set({ pending, step: 5 }),
      resent: (resendAvailableAt) =>
        set((state) => ({
          pending: state.pending ? { ...state.pending, resendAvailableAt } : null,
        })),
      editEmail: () => set({ pending: null, step: 4 }),
      finish: () => set({ draft: emptyDraft, step: 1, pending: null, done: true }),
    }),
    {
      name: "gw-brief-v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noStorage : window.sessionStorage,
      ),
      partialize: ({ draft, step, pending }) => ({ draft, step, pending }),
      skipHydration: true,
    },
  ),
);
