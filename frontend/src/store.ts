import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  telegram_id?: string;
  telegram_username?: string;
}

interface Meal {
  id: string;
  name: string;
  description?: string;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  calories: number;
  prep_day?: string;
  servings: number;
  image_url?: string;
}

interface BotStatus {
  botConnected: boolean;
  telegramId?: string;
  telegramUsername?: string;
  status: string;
}

interface Store {
  user: User | null;
  token: string | null;
  meals: Meal[];
  botStatus: BotStatus | null;
  loading: boolean;
  error: string | null;

  // Auth actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Meal actions
  setMeals: (meals: Meal[]) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  removeMeal: (id: string) => void;

  // Bot actions
  setBotStatus: (status: BotStatus) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),
  meals: [],
  botStatus: null,
  loading: false,
  error: null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  logout: () => {
    set({ user: null, token: null, meals: [] });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  setMeals: (meals) => set({ meals }),

  addMeal: (meal) =>
    set((state) => ({ meals: [...state.meals, meal] })),

  updateMeal: (id, updates) =>
    set((state) => ({
      meals: state.meals.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeMeal: (id) =>
    set((state) => ({
      meals: state.meals.filter((m) => m.id !== id),
    })),

  setBotStatus: (status) => set({ botStatus: status }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
