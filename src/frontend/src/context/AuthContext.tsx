import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  name: string;
  email: string;
}

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isInitializing: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem("openhealth_users");
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  try {
    localStorage.setItem("openhealth_users", JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("openhealth_user");
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed.name && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore
    }
    setIsInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    const passwordHash = simpleHash(password);

    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email === email && u.passwordHash === passwordHash,
    );

    if (!found) {
      throw new Error("Invalid email or password. Try registering first.");
    }

    const authUser: AuthUser = { name: found.name, email };
    setUser(authUser);
    localStorage.setItem("openhealth_user", JSON.stringify(authUser));
  };

  const register = async (name: string, email: string, password: string) => {
    const passwordHash = simpleHash(password);

    const users = getStoredUsers();
    const existing = users.find((u) => u.email === email);
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    users.push({ name, email, passwordHash });
    saveStoredUsers(users);

    const authUser: AuthUser = { name, email };
    setUser(authUser);
    localStorage.setItem("openhealth_user", JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("openhealth_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isInitializing, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
