import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PokerUser, PokerSession } from '../types/common';

interface StoreState {
  user: PokerUser | null;
  session: PokerSession | null;
  setUser: (user: PokerUser | null) => void;
  setSession: (session: PokerSession | null) => void;
  clear: () => void;
}

export const usePokerStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      clear: () => set({ user: null, session: null }),
    }),
    {
      name: 'poker-storage', // localStorage key
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);
