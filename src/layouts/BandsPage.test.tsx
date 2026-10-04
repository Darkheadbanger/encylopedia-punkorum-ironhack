import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { renderPage, session, expectShell } from "../test/renderPage";
import { makeBand, makeIngestedBand } from "../test/fixtures";
import BandsPage from "./BandsPage";

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

beforeEach(() => vi.mocked(useAuth).mockReturnValue(session() as never));

describe("BandsPage", () => {
  it("builds the table with its four column headers", () => {
    renderPage(<BandsPage bands={[makeBand()]} />);

    expectShell();
    for (const column of ["Bands", "Country", "Genre", "Status"]) {
      expect(screen.getByRole("columnheader", { name: column })).toBeInTheDocument();
    }
  });

  it("renders one row per band, hand-written or ingested", () => {
    renderPage(<BandsPage bands={[makeBand(), makeIngestedBand()]} />);

    expect(screen.getByRole("link", { name: "Sex Pistols" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cro-Mags" })).toBeInTheDocument();
    // one header row + two band rows
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("keeps the table and its headers when there is no band", () => {
    renderPage(<BandsPage bands={[]} />);

    expect(screen.getByText(/currently 0 bands/)).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});

// Sortable columns, as on Encyclopaedia Metallum: with 80 bands and growing, a
// fixed order makes the table hard to read.
describe("BandsPage — sorting", () => {
  const three = [
    makeBand({ id: "b1", name: "Ramones", country: "US", status: "Split-up", genre: ["punk rock"] }),
    makeBand({ id: "b2", name: "Amebix", country: "GB", status: "Active", genre: ["crust punk"] }),
    makeBand({ id: "b3", name: "Crass", country: "GB", status: "Split-up", genre: ["anarcho-punk"] }),
  ];

  /** The band names, in the order the table shows them. */
  const shownNames = () =>
    screen.getAllByRole("row").slice(1).map((row) => row.querySelector("a")?.textContent);

  it("keeps the order the API sent until a column is clicked", () => {
    renderPage(<BandsPage bands={three} />);
    expect(shownNames()).toEqual(["Ramones", "Amebix", "Crass"]);
  });

  it("sorts by name, then reverses on a second click", async () => {
    const user = userEvent.setup();
    renderPage(<BandsPage bands={three} />);

    await user.click(screen.getByRole("button", { name: /Bands/ }));
    expect(shownNames()).toEqual(["Amebix", "Crass", "Ramones"]);

    await user.click(screen.getByRole("button", { name: /Bands/ }));
    expect(shownNames()).toEqual(["Ramones", "Crass", "Amebix"]);
  });

  it("sorts by country, by genre and by status", async () => {
    const user = userEvent.setup();
    renderPage(<BandsPage bands={three} />);

    await user.click(screen.getByRole("button", { name: /Country/ }));
    expect(shownNames()?.slice(2)).toEqual(["Ramones"]); // US last

    await user.click(screen.getByRole("button", { name: /Genre/ }));
    expect(shownNames()).toEqual(["Crass", "Amebix", "Ramones"]); // anarcho, crust, punk

    await user.click(screen.getByRole("button", { name: /Status/ }));
    expect(shownNames()?.[0]).toBe("Amebix"); // Active first
  });

  // Without aria-sort a screen reader cannot tell the table is sorted at all.
  it("announces which column is sorted, and which way", async () => {
    const user = userEvent.setup();
    renderPage(<BandsPage bands={three} />);

    const nameHeader = screen.getByRole("columnheader", { name: /Bands/ });
    expect(nameHeader).toHaveAttribute("aria-sort", "none");

    await user.click(screen.getByRole("button", { name: /Bands/ }));
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await user.click(screen.getByRole("button", { name: /Bands/ }));
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("sorts case-insensitively, so 'the Damned' is not exiled to the end", async () => {
    const user = userEvent.setup();
    renderPage(<BandsPage bands={[
      makeBand({ id: "b1", name: "Zounds" }),
      makeBand({ id: "b2", name: "the Damned" }),
    ]} />);

    await user.click(screen.getByRole("button", { name: /Bands/ }));

    expect(shownNames()).toEqual(["the Damned", "Zounds"]);
  });

  it("never mutates the bands it was given", async () => {
    const user = userEvent.setup();
    const bands = [...three];
    renderPage(<BandsPage bands={bands} />);

    await user.click(screen.getByRole("button", { name: /Bands/ }));

    expect(bands.map((band) => band.name)).toEqual(["Ramones", "Amebix", "Crass"]);
  });
});
