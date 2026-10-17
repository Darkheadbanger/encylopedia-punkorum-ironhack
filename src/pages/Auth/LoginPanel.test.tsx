import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPanel from "./LoginPanel";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({ useAuth: vi.fn() }));

const login = vi.fn();
const logout = vi.fn();

const loggedOut = { user: null, isLoggedIn: false, isLoading: false, login, logout };
const loggedIn = {
  user: { id: "1", email: "joey@ramones.com", username: "joey" },
  isLoggedIn: true,
  isLoading: false,
  login,
  logout,
};

const renderLoginPanel = () =>
  render(
    <MemoryRouter>
      <LoginPanel />
    </MemoryRouter>
  );

beforeEach(() => vi.mocked(useAuth).mockReturnValue(loggedOut as never));

describe("LoginPanel, logged out", () => {
  it("shows an email field and a password field", () => {
    renderLoginPanel();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("offers a real link to create an account", () => {
    renderLoginPanel();
    expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("sends the credentials on submit", async () => {
    login.mockResolvedValue(undefined);
    renderLoginPanel();

    await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
    await userEvent.type(screen.getByLabelText("Password"), "hey-ho-lets-go");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(login).toHaveBeenCalledWith("joey@ramones.com", "hey-ho-lets-go");
  });

  it("shows a message when the credentials are refused", async () => {
    login.mockRejectedValue(new Error("401"));
    renderLoginPanel();

    await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrect/i);
  });

  it("shows no logout button", () => {
    renderLoginPanel();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });
});

describe("LoginPanel, logged in", () => {
  beforeEach(() => vi.mocked(useAuth).mockReturnValue(loggedIn as never));

  it("greets the user and offers to log out", () => {
    renderLoginPanel();
    expect(screen.getByText(/joey/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("hides the login form entirely", () => {
    renderLoginPanel();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Create an account" })).not.toBeInTheDocument();
  });

  it("logs out when the button is clicked", async () => {
    renderLoginPanel();
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(logout).toHaveBeenCalled());
  });
});
