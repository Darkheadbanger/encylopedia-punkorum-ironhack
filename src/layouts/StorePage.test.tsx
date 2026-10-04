import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import StorePage from "./StorePage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("StorePage", () => {
  it("is titled and announces the store as not built yet", () => {
    renderPage(<StorePage />);

    expectShell();
    expect(screen.getByRole("heading", { level: 2, name: "Store" })).toBeInTheDocument();
    expect(screen.getByText(/The store is not available yet/)).toBeInTheDocument();
  });
});
