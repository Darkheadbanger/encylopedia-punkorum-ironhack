import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import ForumPage from "./ForumPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("ForumPage", () => {
  it("is titled and announces the forum as not built yet", () => {
    renderPage(<ForumPage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Forum" })).toBeInTheDocument();
    expect(screen.getByText(/The forum is not available yet/)).toBeInTheDocument();
  });
});
