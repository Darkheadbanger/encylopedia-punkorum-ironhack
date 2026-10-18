import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BandReviews from "./BandReviews";
import { AuthProvider } from "../context/AuthContext";
import { makeReview } from "../test/fixtures";
import { signedIn } from "../test/renderPage";
import { answers, captures, deletes, refuses, watches } from "../test/server";

// Nothing in this file is faked above the wire. The real axios sends the real
// request that the real api.ts built, and MSW answers it — so a test can check
// the query string and the body that actually went out, which replacing
// reviewsAPI with vi.fn()s could never do.
//
// "Logged in" means a token the real provider accepts, as in the browser.

const renderReviews = ({ loggedIn = true } = {}) => {
  signedIn(loggedIn);
  return render(
    <MemoryRouter>
      <AuthProvider>
        <BandReviews bandId="band-1" />
      </AuthProvider>
    </MemoryRouter>
  );
};

beforeEach(() => answers("/reviews", [makeReview()]));

describe("BandReviews — reading", () => {
  it("asks only for this band's reviews", async () => {
    const urls = watches("/reviews", [makeReview()]);
    renderReviews();

    expect(await screen.findByText(/three chords and the truth/i)).toBeInTheDocument();
    expect(urls[0]).toContain("band=band-1");
  });

  it("shows the review, its author and its date", async () => {
    renderReviews();

    expect(await screen.findByText(/three chords and the truth/i)).toBeInTheDocument();
    expect(screen.getByText("joey")).toBeInTheDocument();
    expect(screen.getByText("17/10/2026")).toBeInTheDocument();
  });

  it("reads the rating out as a number, not as punctuation", async () => {
    renderReviews();

    expect((await screen.findAllByLabelText("5 out of 5")).length).toBeGreaterThan(0);
  });

  it("averages the ratings", async () => {
    answers("/reviews", [makeReview({ rating: 5 }), makeReview({ id: "review-2", rating: 2 })]);
    renderReviews();

    expect(await screen.findByText("3.5 / 5")).toBeInTheDocument();
  });

  it("says so when nobody has reviewed the band", async () => {
    answers("/reviews", []);
    renderReviews();

    expect(await screen.findByText(/no one has reviewed this band yet/i)).toBeInTheDocument();
  });

  // Reading is public, like the bands themselves.
  it("shows the reviews to a visitor who is not logged in", async () => {
    renderReviews({ loggedIn: false });

    expect(await screen.findByText(/three chords and the truth/i)).toBeInTheDocument();
  });
});

describe("BandReviews — writing", () => {
  it("offers no form to a visitor, and invites them to log in", async () => {
    renderReviews({ loggedIn: false });

    expect(await screen.findByRole("link", { name: /create an account/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /post review/i })).not.toBeInTheDocument();
  });

  it("posts a review and puts it at the top of the list", async () => {
    const posted = makeReview({ id: "review-2", content: "Louder than anything in 1977." });
    const sent = captures("post", "/reviews", posted);
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "Louder than anything in 1977.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    const [first] = await screen.findAllByRole("listitem");
    expect(within(first).getByText("Louder than anything in 1977.")).toBeInTheDocument();
    // The body that really went over the wire, not the arguments of a stand-in.
    expect(sent[0]).toEqual({
      band: "band-1",
      rating: 5,
      content: "Louder than anything in 1977.",
    });
  });

  // The schema refuses it too; refusing here saves a pointless round trip.
  it("refuses a one-word review without calling the server", async () => {
    const sent = captures("post", "/reviews", makeReview());
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "Great.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 10 characters/i);
    expect(sent).toHaveLength(0); // nothing left the browser
  });

  it("keeps what was typed when the server refuses it", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    refuses("post", "/reviews", "Token missing or invalid.", 401);
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "A record that still bites.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    // The server's own sentence, which is what errorMessage() is for. Asserting
    // only that "an alert exists" would pass on the LOAD error just as happily.
    expect(await screen.findByRole("alert")).toHaveTextContent(/token missing or invalid/i);
    expect(screen.getByLabelText("Your review")).toHaveValue("A record that still bites.");
  });
});

// The rule the whole model exists for: a token says who you are, not that this
// review is yours. The API answers 403; the page does not offer the button.
describe("BandReviews — whose review it is", () => {
  it("offers Edit and Delete on your own review", async () => {
    renderReviews();

    expect(await screen.findByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("offers neither on someone else's", async () => {
    answers("/reviews", [makeReview({ author: { id: "999", username: "sid" } })]);
    renderReviews();

    await screen.findByText("sid");
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("offers neither to a visitor", async () => {
    renderReviews({ loggedIn: false });

    await screen.findByText("joey");
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });
});

describe("BandReviews — editing and deleting", () => {
  it("loads your review into the form and saves the change", async () => {
    const updated = makeReview({ rating: 3, content: "On reflection, the bass does the work." });
    const sent = captures("put", "/reviews/review-1", updated);
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Edit" }));

    const textarea = screen.getByLabelText("Your review");
    expect(textarea).toHaveValue("Three chords and the truth, still the loudest record of 1977.");

    await userEvent.clear(textarea);
    await userEvent.type(textarea, "On reflection, the bass does the work.");
    await userEvent.selectOptions(screen.getByLabelText("Rating"), "3");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText("On reflection, the bass does the work.")).toBeInTheDocument();
    // The band is NOT sent on an edit: a review stays about the band it was written for.
    expect(sent[0]).toEqual({ rating: 3, content: "On reflection, the bass does the work." });
  });

  it("lets you back out of an edit", async () => {
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Edit" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByLabelText("Your review")).toHaveValue("");
    expect(screen.getByRole("button", { name: /post review/i })).toBeInTheDocument();
  });

  it("deletes your review once you confirm", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    deletes("/reviews/review-1");
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByText(/no one has reviewed this band yet/i)).toBeInTheDocument();
  });

  it("keeps the review when you change your mind", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(screen.getByText(/three chords and the truth/i)).toBeInTheDocument();
  });

  // The server is the one that decides: a refused deletion must not make the
  // review disappear from the page.
  it("keeps the review on screen when the server refuses the deletion", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    refuses("delete", "/reviews/review-1", "This review belongs to someone else.", 403);
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/belongs to someone else/i);
    expect(screen.getByText(/three chords and the truth/i)).toBeInTheDocument();
  });
});

describe("BandReviews — when the API is down", () => {
  it("says so instead of pretending the band has no reviews", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    refuses("get", "/reviews", "Something went wrong on the server.", 500);
    renderReviews();

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be loaded/i);
    expect(screen.queryByText(/no one has reviewed this band yet/i)).not.toBeInTheDocument();
  });
});
