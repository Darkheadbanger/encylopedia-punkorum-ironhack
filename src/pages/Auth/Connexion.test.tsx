import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Connexion from "./Connexion";

describe("Connexion", () => {
  it("shows a username field and a password field", () => {
    render(<Connexion />);
    expect(screen.getByLabelText("Username or email")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("shows the login button and the register / forgot placeholders", () => {
    render(<Connexion />);
    expect(screen.getByRole("button", { name: "Login" })).toHaveAttribute("type", "submit");
    // Not links yet: those pages do not exist, so they must not look clickable
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText("Forgot login?")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
