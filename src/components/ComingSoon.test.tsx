import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ComingSoon from "./ComingSoon";

const renderPlaceholder = (what: string) =>
  render(
    <MemoryRouter>
      <ComingSoon what={what} />
    </MemoryRouter>
  );

describe("ComingSoon", () => {
  it("names the feature that is missing", () => {
    renderPlaceholder("store");
    expect(screen.getByText(/The store is not available yet/)).toBeInTheDocument();
  });

  it("is reused as is for another feature", () => {
    renderPlaceholder("forum");
    expect(screen.getByText(/The forum is not available yet/)).toBeInTheDocument();
  });

  // A dead end is worse than a missing page: the visitor must be able to leave.
  it("points to what does work", () => {
    renderPlaceholder("store");

    expect(screen.getByRole("link", { name: "bands" })).toHaveAttribute("href", "/bands");
    expect(screen.getByRole("link", { name: "add one" })).toHaveAttribute("href", "/addBand");
  });

  it("is labelled as a placeholder, not as a broken page", () => {
    renderPlaceholder("store");
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });
});
