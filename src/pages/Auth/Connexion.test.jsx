import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Connexion from "./Connexion";

describe("Connexion", () => {
  it("shows a username field and a password field", () => {
    render(<Connexion />);
    expect(screen.getByLabelText("Username or email")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("shows the login button and the register / forgot links", () => {
    render(<Connexion />);
    expect(screen.getByRole("button", { name: "Login" })).toHaveAttribute("type", "submit");
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot login?" })).toBeInTheDocument();
  });
});
