import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({ useAuth: vi.fn() }));

const signup = vi.fn();

const fill = async () => {
  await userEvent.type(screen.getByLabelText("Username"), "joey");
  await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
  await userEvent.type(screen.getByLabelText("Password"), "hey-ho-lets-go");
};

const renderSignup = () =>
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

beforeEach(() =>
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    signup,
  } as never)
);

describe("Signup", () => {
  it("asks for a username, an email and a password", () => {
    renderSignup();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("warns that the password is too short before calling the server", async () => {
    renderSignup();
    await userEvent.type(screen.getByLabelText("Username"), "joey");
    await userEvent.type(screen.getByLabelText("Email"), "joey@ramones.com");
    await userEvent.type(screen.getByLabelText("Password"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/8/);
    expect(signup).not.toHaveBeenCalled(); // a pointless round trip avoided
  });

  it("sends the account on submit", async () => {
    signup.mockResolvedValue(undefined);
    renderSignup();
    await fill();
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(signup).toHaveBeenCalledWith("joey@ramones.com", "hey-ho-lets-go", "joey");
  });

  it("shows the reason the server refused", async () => {
    signup.mockRejectedValue(new Error("This email is already in use."));
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
