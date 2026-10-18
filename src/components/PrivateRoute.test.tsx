import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../context/AuthContext";
import { http } from "msw";
import { API, answers, server } from "../test/server";
import { signedIn, settleAuth, MEMBER } from "../test/renderPage";

// This file used to replace useAuth with a fake and hand PrivateRoute whatever
// state it wanted to test. It now drives the REAL provider the way a browser
// does — a stored token the server accepts, or none — which is what makes the
// third test worth anything: "still loading" is not a value you set, it is the
// window between mounting and the server answering.
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
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
      </AuthProvider>
    </MemoryRouter>
  );

describe("PrivateRoute", () => {
  it("shows the page to a logged-in visitor", async () => {
    signedIn(true);
    renderAt("/addBand");

    await settleAuth();
    expect(screen.getByText("the protected form")).toBeInTheDocument();
  });

  it("sends a logged-out visitor home", async () => {
    signedIn(false);
    renderAt("/addBand");

    await settleAuth();
    expect(screen.queryByText("the protected form")).not.toBeInTheDocument();
    expect(screen.getByText("the home page")).toBeInTheDocument();
  });

  it("waits instead of redirecting while the session is being restored", async () => {
    // Redirecting here would throw out a visitor who IS logged in, just because
    // the token check had not come back yet. A token is stored and the server is
    // made to take its time, which is exactly that window — no state to fake.
    localStorage.setItem("authToken", "a-token-being-checked");
    server.use(http.get(`${API}/auth/verify`, () => new Promise(() => {})));

    renderAt("/addBand");
    await settleAuth();

    expect(screen.queryByText("the home page")).not.toBeInTheDocument();
    expect(screen.queryByText("the protected form")).not.toBeInTheDocument();
  });

  // The other half of the same race: once the server answers, the visitor lands
  // on the page they asked for rather than being bounced home first.
  it("lets the visitor through once the token comes back valid", async () => {
    localStorage.setItem("authToken", "a-token-the-server-accepts");
    answers("/auth/verify", MEMBER);

    renderAt("/addBand");
    await settleAuth();

    expect(await screen.findByText("the protected form")).toBeInTheDocument();
  });
});
