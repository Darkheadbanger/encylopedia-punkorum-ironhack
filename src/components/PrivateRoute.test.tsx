import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({ useAuth: vi.fn() }));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>the home page</p>} />
        <Route
          path="/addBand"
          element={
            <PrivateRoute>
              <p>the protected form</p>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

const state = (over = {}) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  ...over,
});

beforeEach(() => vi.mocked(useAuth).mockReturnValue(state() as never));

describe("PrivateRoute", () => {
  it("shows the page to a logged-in visitor", () => {
    vi.mocked(useAuth).mockReturnValue(state({ isLoggedIn: true }) as never);
    renderAt("/addBand");
    expect(screen.getByText("the protected form")).toBeInTheDocument();
  });

  it("sends a logged-out visitor home", () => {
    renderAt("/addBand");
    expect(screen.queryByText("the protected form")).not.toBeInTheDocument();
    expect(screen.getByText("the home page")).toBeInTheDocument();
  });

  it("waits instead of redirecting while the session is being restored", () => {
    // Redirecting here would throw out a visitor who IS logged in, just because
    // the token check had not come back yet.
    vi.mocked(useAuth).mockReturnValue(state({ isLoading: true }) as never);
    renderAt("/addBand");
    expect(screen.queryByText("the home page")).not.toBeInTheDocument();
    expect(screen.queryByText("the protected form")).not.toBeInTheDocument();
  });
});
