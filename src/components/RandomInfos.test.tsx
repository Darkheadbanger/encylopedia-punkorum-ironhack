import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RandomInfos from "./RandomInfos";

describe("RandomInfos", () => {
  it("shows the 4 sections", () => {
    render(<RandomInfos />);
    for (const title of ["Bands", "Labels", "Reviews", "Random"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("links are placeholders: clicking them does not navigate", () => {
    render(<RandomInfos />);
    // fireEvent returns false when the click handler called preventDefault()
    const notPrevented = fireEvent.click(screen.getByRole("link", { name: "Random Band" }));
    expect(notPrevented).toBe(false);
  });
});
