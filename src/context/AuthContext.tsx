// Who is logged in, for the whole app.
//
// The token lives in localStorage so a refresh does not log the visitor out. It is
// never trusted on its own: on startup we ask the server to validate it, and a token
// the server refuses is thrown away.

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authAPI } from "../services/api";
import type { AuthUser } from "../types";

const TOKEN_KEY = "authToken";

interface AuthValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** True until the stored token has been checked. Routes must wait for it. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

/** Turns an axios failure into an Error carrying the server's own message. */
const toError = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return new Error(message || fallback);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const forget = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // Ask the server who this token belongs to. Also proves it is still valid.
  const loadUser = async () => {
    const { data } = await authAPI.verify();
    setUser(data);
  };

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setIsLoading(false); // nothing stored, nothing to ask the server
      return;
    }
    loadUser()
      .catch(forget) // expired, forged, or the account is gone
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    let token: string;
    try {
      ({ data: { authToken: token } } = await authAPI.login({ email, password }));
    } catch (error) {
      throw toError(error, "Incorrect email or password.");
    }
    // Stored before verify(), because the request interceptor reads it from there.
    localStorage.setItem(TOKEN_KEY, token);
    try {
      await loadUser();
    } catch (error) {
      forget();
      throw toError(error, "Could not start the session.");
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      await authAPI.signup({ email, password, username });
    } catch (error) {
      throw toError(error, "Could not create the account.");
    }
    await login(email, password); // straight in, no second form to fill
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: user !== null, isLoading, login, signup, logout: forget }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside an <AuthProvider>.");
  return value;
}
