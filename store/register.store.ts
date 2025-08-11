import { create } from 'zustand';
type RegisterState = {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  name: '',
  email: '',
  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
}));
