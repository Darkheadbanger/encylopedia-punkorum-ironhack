import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Routers from "./Routers";
import { makeLocalBand } from "./test/fixtures";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routers bands={[makeLocalBand()]} setBands={vi.fn()} />
    </MemoryRouter>
  );

// Each route renders a layout: sidebar (login + random infos) + navbar + page content
const expectLayout = () => {
  expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Random" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Encyclopedia Punkorum logo" })).toBeInTheDocument();
};

describe("Routers", () => {
  it("/ shows the home page", () => {
    renderAt("/");
    expectLayout();
    expect(screen.getByRole("link", { name: "Bands" })).toHaveAttribute("href", "/bands");
  });

  it("/bands shows the bands table", () => {
    renderAt("/bands");
    expectLayout();
    expect(screen.getByRole("columnheader", { name: "Country" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sex Pistols" })).toBeInTheDocument();
  });

  it("/bands/:bandsId shows the band details", () => {
    renderAt("/bands/local-1");
    expectLayout();
    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
  });

  it("/addBand shows the add form", () => {
    renderAt("/addBand");
    expectLayout();
    expect(
      screen.getByRole("heading", { name: "Add New Band to Encyclopedia Punkorum" })
    ).toBeInTheDocument();
  });

  it("/updateBand/:updateId shows the edit form", () => {
    renderAt("/updateBand/local-1");
    expectLayout();
    expect(screen.getByRole("heading", { name: "Edit Band: Sex Pistols" })).toBeInTheDocument();
  });

  it("/help shows the help page", () => {
    renderAt("/help");
    expectLayout();
    expect(screen.getByRole("heading", { level: 2, name: "Help" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How do I add a band?" })).toBeInTheDocument();
  });

  it("/rules shows the rules page", () => {
    renderAt("/rules");
    expectLayout();
    expect(screen.getByRole("heading", { level: 2, name: "Rules" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. The only criterion" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. The one-release test" })).toBeInTheDocument();
  });

  it.each([
    ["/store", "Store", "The store is not available yet — this feature is still being built."],
    ["/forum", "Forum", "The forum is not available yet — this feature is still being built."],
  ])("%s shows a coming-soon placeholder", (path, title, message) => {
    renderAt(path);
    expectLayout();
    expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("an unknown URL shows the 404 page", () => {
    renderAt("/this-page-does-not-exist");
    expectLayout();
    expect(screen.getByRole("heading", { name: "Page Not Found" })).toBeInTheDocument();
  });
});
