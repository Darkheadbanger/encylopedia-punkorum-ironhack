import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Routers from "./Routers";
import { makeLocalBand } from "./test/fixtures";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";

vi.mock("./context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

const session = (isLoggedIn: boolean) => ({
  user: isLoggedIn ? { id: "1", email: "joey@ramones.com", username: "joey" } : null,
  isLoggedIn,
  isLoading: false,
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
});

// Logged out unless a test says otherwise.
beforeEach(() => vi.mocked(useAuth).mockReturnValue(session(false) as never));

const logIn = () => vi.mocked(useAuth).mockReturnValue(session(true) as never);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routers bands={[makeLocalBand()]} setBands={vi.fn()} />
    </MemoryRouter>
  );

// Each route renders a layout: sidebar (login + random infos) + navbar + page content
const expectLayout = ({ loggedIn = false } = {}) => {
  // The sidebar shows the login form, or the logout button once signed in.
  const panel = loggedIn ? "Logout" : "Login";
  expect(screen.getByRole("button", { name: panel })).toBeInTheDocument();
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

  it("/addBand shows the add form to a logged-in visitor", () => {
    logIn();
    renderAt("/addBand");
    expectLayout({ loggedIn: true });
    expect(
      screen.getByRole("heading", { name: "Add New Band to Encyclopedia Punkorum" })
    ).toBeInTheDocument();
  });

  it("/addBand sends a logged-out visitor home", () => {
    renderAt("/addBand");
    expect(
      screen.queryByRole("heading", { name: "Add New Band to Encyclopedia Punkorum" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bands" })).toBeInTheDocument(); // the home page
  });

  it("/updateBand/:updateId shows the edit form to a logged-in visitor", () => {
    logIn();
    renderAt("/updateBand/local-1");
    expectLayout({ loggedIn: true });
    expect(screen.getByRole("heading", { name: "Edit Band: Sex Pistols" })).toBeInTheDocument();
  });

  it("/updateBand/:updateId sends a logged-out visitor home", () => {
    renderAt("/updateBand/local-1");
    expect(screen.queryByRole("heading", { name: "Edit Band: Sex Pistols" })).not.toBeInTheDocument();
  });

  it("/genres shows the genres page", () => {
    renderAt("/genres");
    expectLayout();
    expect(screen.getByRole("heading", { name: "Punk Genres" })).toBeInTheDocument();
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
