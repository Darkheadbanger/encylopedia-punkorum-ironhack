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
  // The token is read ONCE, at mount, and both the initial isLoading and the
  // effect below use that same value.
  //
  // Reading it twice is a trap: isLoading starts true because a token was there
  // at render, then the effect re-reads at commit time, finds it gone — another
  // tab logged out in between — returns early, and isLoading stays true forever.
  // The page then shows "Checking your session..." until a reload.
  const [storedToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  // Loading only while there is a token to check. Starting at true and switching
  // it off inside the effect meant one extra render with the app held behind a
  // spinner for a visitor who was never logged in.
  const [isLoading, setIsLoading] = useState(Boolean(storedToken));

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
    // The same value isLoading was initialised from, so the two can never disagree.
    if (!storedToken) return; // nothing stored, nothing to ask

    // Asking the server who a stored token belongs to is a real side effect — a
    // network call on mount — not state derived from props. Nothing is set
    // synchronously: every setState here runs when the request comes back, which
    // the linter cannot see through loadUser().
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser()
      .catch(forget) // expired, forged, or the account is gone
      .finally(() => setIsLoading(false));
    // storedToken is read once at mount and never changes: this runs exactly once.
  }, [storedToken]);

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

// react-refresh wants a file to export components OR other things, never both,
// because mixing them makes hot reloading fall back to a full page reload. The
// textbook fix is to move this hook to its own file — but 28 files import it,
// including every test that mocks "../context/AuthContext", and the only thing
// gained is a faster refresh while editing this one file. The provider and its
// hook belong together; the cost of separating them does not pay for itself.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside an <AuthProvider>.");
  return value;
}
