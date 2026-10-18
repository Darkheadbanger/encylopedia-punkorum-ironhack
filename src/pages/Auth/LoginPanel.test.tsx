import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPanel from "./LoginPanel";
import { AuthProvider } from "../../context/AuthContext";
import { accepts, answers, captures, refuses } from "../../test/server";
import { signedIn, settleAuth, MEMBER } from "../../test/renderPage";

// The panel used to be tested against a fake useAuth: login() was a vi.fn() and
// asserting it had been called proved only that the form called a function. The
// real <AuthProvider> runs here, so signing in goes through the whole chain —
// POST /auth/login, the token into localStorage, GET /auth/verify — and the
// panel flipping to "Logged in as joey" is the proof that it worked.
//
// Only the two HTTP calls are stubbed; everything between them is real.
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

const renderLoginPanel = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPanel />
      </AuthProvider>
    </MemoryRouter>
  );

/** The server accepts the credentials and then recognises the token. */
let sent: unknown[];
const serverAccepts = () => {
  sent = captures("post", "/auth/login", { authToken: "a-real-token" });
  answers("/auth/verify", MEMBER);
};

const fillIn = async (password: string) => {
  await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
  await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.click(screen.getByRole("button", { name: "Login" }));
};

describe("LoginPanel, logged out", () => {
  it("shows an email field and a password field", () => {
    signedIn(false);
    renderLoginPanel();

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("offers a real link to create an account", () => {
    signedIn(false);
    renderLoginPanel();

    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("signs the member in, token and all", async () => {
    signedIn(false);
    serverAccepts();
    renderLoginPanel();

    await fillIn("hey-ho-lets-go");

    expect(sent[0]).toEqual({
      email: "joey@ramones.com",
      password: "hey-ho-lets-go",
    });
    // The panel only says this once the provider has a verified user.
    expect(await screen.findByRole("button", { name: "Logout" })).toBeInTheDocument();
    expect(localStorage.getItem("authToken")).toBe("a-real-token");
  });

  it("shows the server's own words when the credentials are refused", async () => {
    signedIn(false);
    refuses("post", "/auth/login", "Incorrect email or password.", 401);
    renderLoginPanel();

    await fillIn("wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect/i);
    expect(localStorage.getItem("authToken")).toBeNull(); // nothing stored on failure
  });

  // The token is written before verify() runs, because the request interceptor
  // reads it from there. A token the server then refuses must not survive.
  it("throws the token away if the server refuses it right after", async () => {
    signedIn(false);
    accepts("/auth/login", { authToken: "a-stale-token" });
    refuses("get", "/auth/verify", "Token missing or invalid.", 401);
    renderLoginPanel();

    await fillIn("hey-ho-lets-go");

    await waitFor(() => expect(localStorage.getItem("authToken")).toBeNull());
    expect(screen.getByLabelText("Email")).toBeInTheDocument(); // still the form
  });

  it("shows no logout button", () => {
    signedIn(false);
    renderLoginPanel();

    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });
});

describe("LoginPanel, logged in", () => {
  it("greets the member and offers to log out", async () => {
    signedIn(true);
    renderLoginPanel();

    await settleAuth();
    expect(screen.getByText(/joey/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("hides the login form entirely", async () => {
    signedIn(true);
    renderLoginPanel();

    await settleAuth();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Create an account" })).not.toBeInTheDocument();
  });

  it("really logs out: the token goes, and the form comes back", async () => {
    signedIn(true);
    renderLoginPanel();
    await settleAuth();

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(localStorage.getItem("authToken")).toBeNull();
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
  });
});
