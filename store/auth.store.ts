import { getCurrentUser } from '@/lib/auth';
import { User } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null | any) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: any) => set({ user }),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ user });
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.log(error);
      set({ user: null });
      set({ isAuthenticated: false, setUser: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
