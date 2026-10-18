import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ReviewsList from "./ReviewsList";
import { answers, refuses } from "../test/server";
import { makeBand, makeReview } from "../test/fixtures";

const renderList = (query = "", bands = [makeBand()]) =>
  render(
    <MemoryRouter initialEntries={[`/reviews${query}`]}>
      <Routes>
        <Route path="/reviews" element={<ReviewsList bands={bands} />} />
        <Route path="/bands/:bandsId" element={<p>Band page</p>} />
      </Routes>
    </MemoryRouter>
  );

const harsh = makeReview({ id: "r-harsh", rating: 2, content: "Overrated and overplayed." });
const kind = makeReview({ id: "r-kind", rating: 5, content: "Still the loudest record of 1977." });

beforeEach(() => {
  answers("/reviews", [harsh, kind]);
});

afterEach(() => vi.restoreAllMocks());

describe("ReviewsList", () => {
  it("shows every review, whoever wrote it", async () => {
    renderList();

    expect(await screen.findByText("Overrated and overplayed.")).toBeInTheDocument();
    expect(screen.getByText("Still the loudest record of 1977.")).toBeInTheDocument();
  });

  // A review carries its band's id; the name comes from the list already in memory.
  it("names the band and links to it", async () => {
    renderList();

    const link = await screen.findAllByRole("link", { name: "Sex Pistols" });
    expect(link[0]).toHaveAttribute("href", "/bands/band-1");
  });

  it("does not break on a review whose band is gone", async () => {
    renderList("", []); // no bands in memory at all

    expect(await screen.findByText("Overrated and overplayed.")).toBeInTheDocument();
    expect(screen.getAllByText(/no longer here/i).length).toBe(2);
  });

  it("keeps the API's order by default: newest first", async () => {
    renderList();

    const [first] = await screen.findAllByRole("listitem");
    expect(within(first).getByText("Overrated and overplayed.")).toBeInTheDocument();
  });

  it("puts the best rated first when asked", async () => {
    renderList("?sort=rating");

    const [first] = await screen.findAllByRole("listitem");
    expect(within(first).getByText("Still the loudest record of 1977.")).toBeInTheDocument();
  });

  it("switches order from the tabs, and says which one is on", async () => {
    renderList();
    await screen.findByText("Overrated and overplayed.");

    await userEvent.click(screen.getByRole("tab", { name: "Top Rated" }));

    expect(screen.getByRole("tab", { name: "Top Rated" })).toHaveAttribute("aria-selected", "true");
    const [first] = screen.getAllByRole("listitem");
    expect(within(first).getByText("Still the loudest record of 1977.")).toBeInTheDocument();
  });

  it("ignores a sort nobody asked for", async () => {
    renderList("?sort=loudest");

    expect(await screen.findByRole("tab", { name: "Latest" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("invites the first review when there is none", async () => {
    answers("/reviews", []);
    renderList();

    expect(await screen.findByText(/nobody has reviewed anything yet/i)).toBeInTheDocument();
  });

  it("says so when the API is down, instead of pretending there are none", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    refuses("get", "/reviews", "Something went wrong on the server.", 500);
    renderList();

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be loaded/i);
    expect(screen.queryByText(/nobody has reviewed anything yet/i)).not.toBeInTheDocument();
  });
});
