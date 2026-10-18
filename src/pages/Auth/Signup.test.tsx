import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Signup from "./Signup";
import { AuthProvider } from "../../context/AuthContext";
import { accepts, answers, captures, refuses } from "../../test/server";
import { MEMBER } from "../../test/renderPage";

// The real <AuthProvider> runs here. Creating an account goes through the whole
// chain — POST /auth/signup, then the login it triggers, then GET /auth/verify —
// so only those three HTTP calls are stubbed.
let sent: unknown[];
const signup = {
  succeeds() {
    sent = captures("post", "/auth/signup", MEMBER);
    accepts("/auth/login", { authToken: "a-real-token" });
    answers("/auth/verify", MEMBER);
  },
  // No captures() here: server.use prepends, so the refusal would always win and
  // the recorder would stay empty — an assertion on it could only pass vacuously.
  fails(message: string) {
    refuses("post", "/auth/signup", message, 400);
  },
};

const fill = async () => {
  await userEvent.type(screen.getByLabelText("Username"), "joey");
  await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
  await userEvent.type(screen.getByLabelText("Password"), "hey-ho-lets-go");
};

const renderSignup = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Signup />
    </AuthProvider>
    </MemoryRouter>
  );

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Signup", () => {
  it("asks for a username, an email and a password", () => {
    renderSignup();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("warns that the password is too short before calling the server", async () => {
    signup.succeeds(); // spied, so "never called" means something
    renderSignup();
    await userEvent.type(screen.getByLabelText("Username"), "joey");
    await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
    await userEvent.type(screen.getByLabelText("Password"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/8/);
    expect(sent).toHaveLength(0); // a pointless round trip avoided
  });

  it("sends the account on submit", async () => {
    signup.succeeds();
    renderSignup();
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(sent[0]).toEqual({
      email: "joey@ramones.com",
      password: "hey-ho-lets-go",
      username: "joey",
    });
  });

  it("shows the reason the server refused", async () => {
    signup.fails("This email is already in use.");
    renderSignup();
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("This email is already in use.");
  });

  it("papers the page with a wall of punk flyers", () => {
    renderSignup();
    const wall = screen.getByRole("list", { name: "Punk flyer wall" });
    expect(wall).toBeInTheDocument();
    expect(within(wall).getByText("Ramones")).toBeInTheDocument();
    expect(within(wall).getByText("Dead Kennedys")).toBeInTheDocument();
  });

  // Freepik's free licence requires visible credit. A test keeps it from being
  // quietly deleted during a redesign.
  it("credits the artwork", () => {
    renderSignup();
    expect(screen.getByRole("link", { name: /freepik/i })).toHaveAttribute(
      "href",
      "https://www.freepik.com/"
    );
  });

  it("links back to the login page", () => {
    renderSignup();
    expect(screen.getByRole("link", { name: /already have an account/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});

// The page used to stay exactly as it was after a successful signup — same form,
// same empty space, no word of confirmation — even though the account had been
// created and the member logged in. A visitor could only conclude it had failed.
describe("Signup — where it leaves you", () => {
  /** Signup at /signup, with a recognisable home page to land on. */
  const renderWithHome = () =>
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <AuthProvider>
          <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<p>The encyclopedia</p>} />
        </Routes>
      </AuthProvider>
      </MemoryRouter>
    );

  it("sends the new member to the encyclopedia", async () => {
    signup.succeeds();
    renderWithHome();
    await fill();

    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("The encyclopedia")).toBeInTheDocument();
  });

  it("keeps them on the form when the account could not be created", async () => {
    signup.fails("This email is already in use.");
    renderWithHome();
    await fill();

    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("This email is already in use.");
    expect(screen.queryByText("The encyclopedia")).not.toBeInTheDocument();
  });
});
