import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import { answers, captures, refuses, watches } from "../test/server";
import { AuthProvider } from "../context/AuthContext";
import { makeBand, makeCandidate, makeIngestedBand } from "../test/fixtures";
import { signedIn, settleAuth } from "../test/renderPage";

const renderSearch = (
  query: string,
  { bands = [makeBand()], setBands = vi.fn(), loggedIn = true } = {},
) => {
  // "Logged in" means a token the server accepts, as in the browser.
  signedIn(loggedIn);
  return render(
    <MemoryRouter initialEntries={[`/search${query}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/search" element={<SearchResults bands={bands} setBands={setBands} />} />
          <Route path="/bands/:bandsId" element={<p>Band page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

// Every test can read what actually went out: watches() records the URLs, which
// is how "the browser never asked" is now proved — no request, not an uncalled stub.
//
// Absence always needs a settle step first. The recorder is filled a tick after
// the render, so checking it synchronously could never fail, whatever the code did.
let asked: string[];
beforeEach(() => {
  asked = watches("/bands/upstream", [makeCandidate()]);
});

describe("SearchResults — no search yet", () => {
  it("invites the visitor to type instead of searching for nothing", async () => {
    renderSearch("");

    expect(screen.getByText(/type a band name/i)).toBeInTheDocument();
    await settleAuth();
    expect(asked).toHaveLength(0);
  });

  it("ignores a term made of spaces", async () => {
    renderSearch("?q=%20%20");
    await settleAuth();
    expect(asked).toHaveLength(0);
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

    await waitFor(() => expect(asked).toHaveLength(1));
    expect(asked[0]).toContain("q=cro-mags");
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
    answers("/bands/upstream", []);
    renderSearch("?q=zzzz");

    expect(await screen.findByText(/nothing on musicbrainz/i)).toBeInTheDocument();
  });

  // The search page may fail without taking the rest of the site with it: that is
  // the whole point of keeping MusicBrainz out of the band list.
  it("reports a failure in this panel only", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    refuses("get", "/bands/upstream", "MusicBrainz could not be reached.", 502);
    renderSearch("?q=cro-mags");

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not reach musicbrainz/i);
    // our own results are still there
    expect(screen.getByRole("region", { name: /in the encyclopedia/i })).toBeInTheDocument();
  });
});

describe("SearchResults — importing", () => {
  it("imports the band, adds it to the list and offers its page", async () => {
    const imported = makeIngestedBand();
    const sent = captures("post", "/bands/import", imported);
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderSearch("?q=cro-mags", { setBands });

    await user.click(await screen.findByRole("button", { name: /import/i }));

    expect(sent[0]).toEqual({ musicBrainzId: "7a2e6b55-f149-4e74-be6a-30a1b1a3e5ae" });
    await waitFor(() => expect(setBands).toHaveBeenCalled());
    // The band is added at the top, without dropping the others
    const existing = makeBand();
    expect(setBands.mock.calls[0][0]([existing])).toEqual([imported, existing]);

    expect(await screen.findByRole("link", { name: /view it/i }))
      .toHaveAttribute("href", "/bands/band-2");
  });

  it("offers no Import button for a band we already hold", async () => {
    answers("/bands/upstream", [makeCandidate({ alreadyImported: true })]);
    renderSearch("?q=cro-mags");

    expect(await screen.findByText(/already in the encyclopedia/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });

  // Searching MusicBrainz is a contribution tool: both /bands/upstream and
  // /bands/import answer 401 without a token, and every query spends one of the
  // requests MusicBrainz allows us. So a visitor never sees the panel at all.
  it("hides the MusicBrainz panel from a visitor and invites them to log in", async () => {
    renderSearch("?q=cro-mags", { loggedIn: false });

    expect(await screen.findByText(/log in/i)).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /on musicbrainz/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /import/i })).not.toBeInTheDocument();
  });

  // The 401 it would answer must never be reported as a MusicBrainz outage.
  it("does not even ask the API when nobody is logged in", async () => {
    renderSearch("?q=cro-mags", { loggedIn: false });

    expect(await screen.findByText(/log in/i)).toBeInTheDocument();
    await settleAuth();
    expect(asked).toHaveLength(0);
    expect(screen.queryByText(/could not reach musicbrainz/i)).not.toBeInTheDocument();
  });

  it("keeps the candidate and says so when the import fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    refuses("post", "/bands/import", "This band is already in the encyclopedia.", 409);
    const setBands = vi.fn();
    const user = userEvent.setup();
    renderSearch("?q=cro-mags", { setBands });

    await user.click(await screen.findByRole("button", { name: /import/i }));

    // The server now gets the last word: its own sentence, not our fallback.
    expect(await screen.findByRole("alert")).toHaveTextContent(/already in the encyclopedia/i);
    expect(setBands).not.toHaveBeenCalled();
  });
});
