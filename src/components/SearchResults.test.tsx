import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { ReactNode } from "react";
import SearchResults from "./SearchResults";
import { upstreamAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { makeBand, makeCandidate, makeIngestedBand, axiosResponse } from "../test/fixtures";
import { session } from "../test/renderPage";

vi.mock("../services/api", () => ({
  upstreamAPI: { search: vi.fn(), import: vi.fn() },
}));

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

const renderSearch = (
  query: string,
  { bands = [makeBand()], setBands = vi.fn(), loggedIn = true } = {},
) => {
  vi.mocked(useAuth).mockReturnValue(session(loggedIn) as never);
  return render(
    <MemoryRouter initialEntries={[`/search${query}`]}>
      <Routes>
        <Route path="/search" element={<SearchResults bands={bands} setBands={setBands} />} />
        <Route path="/bands/:bandsId" element={<p>Band page</p>} />
      </Routes>
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.mocked(upstreamAPI.search).mockResolvedValue(axiosResponse([makeCandidate()]));
});

describe("SearchResults — no search yet", () => {
  it("invites the visitor to type instead of searching for nothing", () => {
    renderSearch("");

    expect(screen.getByText(/type a band name/i)).toBeInTheDocument();
    expect(upstreamAPI.search).not.toHaveBeenCalled();
  });

  it("ignores a term made of spaces", () => {
    renderSearch("?q=%20%20");
    expect(upstreamAPI.search).not.toHaveBeenCalled();
  });
});

describe("SearchResults — what we already have", () => {
  it("lists the matching bands of the encyclopedia first", async () => {
    renderSearch("?q=pistols");

    const ours = screen.getByRole("region", { name: /in the encyclopedia/i });
    expect(ours).toHaveTextContent("Sex Pistols");
  });

  it("links each of them to its page", async () => {
    renderSearch("?q=pistols");

    expect(screen.getByRole("link", { name: "Sex Pistols" }))
      .toHaveAttribute("href", "/bands/band-1");
  });

  it("matches on the genre too, not only the name", async () => {
    renderSearch("?q=proto-punk");
    expect(screen.getByRole("region", { name: /in the encyclopedia/i }))
      .toHaveTextContent("Sex Pistols");
  });

  it("says so when we have nothing, rather than showing an empty box", async () => {
    renderSearch("?q=cro-mags");

    expect(screen.getByRole("region", { name: /in the encyclopedia/i }))
      .toHaveTextContent(/no band/i);
  });
});

describe("SearchResults — candidates from MusicBrainz", () => {
  it("asks our own backend, never MusicBrainz directly", async () => {
    renderSearch("?q=cro-mags");

    await waitFor(() => expect(upstreamAPI.search).toHaveBeenCalledWith("cro-mags"));
  });

  it("shows what the backend returns, already in our shape", async () => {
    renderSearch("?q=cro-mags");

    expect(await screen.findByText("Cro-Mags")).toBeInTheDocument();
    const upstream = screen.getByRole("region", { name: /on musicbrainz/i });
    expect(upstream).toHaveTextContent("US");
    expect(upstream).toHaveTextContent("1981");
    expect(upstream).toHaveTextContent("hardcore punk");
  });

  it("says so when MusicBrainz knows nobody by that name", async () => {
    vi.mocked(upstreamAPI.search).mockResolvedValue(axiosResponse([]));
    renderSearch("?q=zzzz");

    expect(await screen.findByText(/nothing on musicbrainz/i)).toBeInTheDocument();
  });

  // The search page may fail without taking the rest of the site with it: that is
  // the whole point of keeping MusicBrainz out of the band list.
  it("reports a failure in this panel only", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(upstreamAPI.search).mockRejectedValue(new Error("502"));
    renderSearch("?q=cro-mags");

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not reach musicbrainz/i);
    // our own results are still there
    expect(screen.getByRole("region", { name: /in the encyclopedia/i })).toBeInTheDocument();
  });
});

describe("SearchResults — importing", () => {
  it("imports the band, adds it to the list and offers its page", async () => {
    const imported = makeIngestedBand();
    vi.mocked(upstreamAPI.import).mockResolvedValue(axiosResponse(imported));
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderSearch("?q=cro-mags", { setBands });

    await user.click(await screen.findByRole("button", { name: /import/i }));

    expect(upstreamAPI.import).toHaveBeenCalledWith("7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae");
    await waitFor(() => expect(setBands).toHaveBeenCalled());
    // The band is added at the top, without dropping the others
    const existing = makeBand();
    expect(setBands.mock.calls[0][0]([existing])).toEqual([imported, existing]);

    expect(await screen.findByRole("link", { name: /view it/i }))
      .toHaveAttribute("href", "/bands/band-2");
  });

  it("offers no Import button for a band we already hold", async () => {
    vi.mocked(upstreamAPI.search).mockResolvedValue(
      axiosResponse([makeCandidate({ alreadyImported: true })])
    );
    renderSearch("?q=cro-mags");

    expect(await screen.findByText(/already in the encyclopedia/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });

  // POST /bands/import answers 401 without a token, so the button would only fail.
  it("asks a visitor to log in instead of showing a button that cannot work", async () => {
    renderSearch("?q=cro-mags", { loggedIn: false });

    expect(await screen.findByText(/log in to import/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });

  it("keeps the candidate and says so when the import fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(upstreamAPI.import).mockRejectedValue(new Error("409"));
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderSearch("?q=cro-mags", { setBands });

    await user.click(await screen.findByRole("button", { name: /import/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be imported/i);
    expect(setBands).not.toHaveBeenCalled();
  });
});
