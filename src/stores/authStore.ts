import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'OPERATION_MANAGER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createUser: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
  removeUser: (id: string) => void;
  users: User[];
}

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN' as UserRole,
  },
  {
    id: '2',
    name: 'Operation Manager',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'OPERATION_MANAGER' as UserRole,
  },
  {
    id: '3',
    name: 'Staff User',
    email: 'staff@example.com',
    password: 'staff123',
    role: 'STAFF' as UserRole,
  },
];

// Helper to get/set users in localStorage
const USERS_KEY = 'thermal-scanner-users';

function loadUsers(): (User & { password: string })[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  // If not present, initialize with mock users
  localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  return [...MOCK_USERS];
}

function saveUsers(users: (User & { password: string })[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: loadUsers().map(({ password, ...rest }: { password: string; id: string; name: string; email: string; role: UserRole; avatar?: string }) => rest),
      login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const users = loadUsers();
        const user = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        const { password: _pw, ...userData } = user;
        set({
          user: userData as User,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      createUser: async (newUser) => {
        const users = loadUsers();
        if (users.some((u: { email: string }) => u.email === newUser.email)) {
          throw new Error('Email already exists');
        }
        const id = (Math.max(0, ...users.map((u: { id: string }) => Number(u.id) || 0)) + 1).toString();
        const userToAdd = { ...newUser, id };
        users.push(userToAdd);
        saveUsers(users);
        set({ users: users.map(({ password, ...rest }: { password: string; id: string; name: string; email: string; role: UserRole; avatar?: string }) => rest) });
      },
      removeUser: (id: string) => {
        const users = loadUsers();
        // Prevent removing self
        if (get().user?.id === id) {
          throw new Error('You cannot remove your own account while logged in.');
        }
        const filtered = users.filter((u: { id: string }) => u.id !== id);
        saveUsers(filtered);
        set({ users: filtered.map(({ password, ...rest }: { password: string; id: string; name: string; email: string; role: UserRole; avatar?: string }) => rest) });
      },
    }),
    {
      name: 'thermal-scanner-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);