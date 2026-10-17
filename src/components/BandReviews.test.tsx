import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import BandReviews from "./BandReviews";
import { reviewsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { makeReview, axiosResponse } from "../test/fixtures";
import { session } from "../test/renderPage";

vi.mock("../services/api", () => ({
  reviewsAPI: { forBand: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}));

const renderReviews = ({ loggedIn = true } = {}) => {
  vi.mocked(useAuth).mockReturnValue(session(loggedIn) as never);
  return render(
    <MemoryRouter>
      <BandReviews bandId="band-1" />
    </MemoryRouter>
  );
};

beforeEach(() => {
  vi.mocked(reviewsAPI.forBand).mockResolvedValue(axiosResponse([makeReview()]));
});

afterEach(() => vi.restoreAllMocks());

describe("BandReviews — reading", () => {
  it("asks only for this band's reviews", async () => {
    renderReviews();

    await waitFor(() => expect(reviewsAPI.forBand).toHaveBeenCalledWith("band-1"));
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
    vi.mocked(reviewsAPI.forBand).mockResolvedValue(
      axiosResponse([makeReview({ rating: 5 }), makeReview({ id: "review-2", rating: 2 })])
    );
    renderReviews();

    expect(await screen.findByText("3.5 / 5")).toBeInTheDocument();
  });

  it("says so when nobody has reviewed the band", async () => {
    vi.mocked(reviewsAPI.forBand).mockResolvedValue(axiosResponse([]));
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

    expect(await screen.findByRole("link", { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /post review/i })).not.toBeInTheDocument();
  });

  it("posts a review and puts it at the top of the list", async () => {
    const posted = makeReview({ id: "review-2", content: "Louder than anything in 1977." });
    vi.mocked(reviewsAPI.create).mockResolvedValue(axiosResponse(posted));
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "Louder than anything in 1977.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    expect(reviewsAPI.create).toHaveBeenCalledWith({
      band: "band-1",
      rating: 5,
      content: "Louder than anything in 1977.",
    });
    const [first] = await screen.findAllByRole("listitem");
    expect(within(first).getByText("Louder than anything in 1977.")).toBeInTheDocument();
  });

  // The schema refuses it too; refusing here saves a pointless round trip.
  it("refuses a one-word review without calling the server", async () => {
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "Great.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least 10 characters/i);
    expect(reviewsAPI.create).not.toHaveBeenCalled();
  });

  it("keeps what was typed when the server refuses it", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(reviewsAPI.create).mockRejectedValue(new Error("401"));
    renderReviews();
    await screen.findByText(/three chords and the truth/i);

    await userEvent.type(screen.getByLabelText("Your review"), "A record that still bites.");
    await userEvent.click(screen.getByRole("button", { name: /post review/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be saved/i);
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
    vi.mocked(reviewsAPI.forBand).mockResolvedValue(
      axiosResponse([makeReview({ author: { id: "999", username: "sid" } })])
    );
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
    vi.mocked(reviewsAPI.update).mockResolvedValue(axiosResponse(updated));
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Edit" }));

    const textarea = screen.getByLabelText("Your review");
    expect(textarea).toHaveValue("Three chords and the truth, still the loudest record of 1977.");

    await userEvent.clear(textarea);
    await userEvent.type(textarea, "On reflection, the bass does the work.");
    await userEvent.selectOptions(screen.getByLabelText("Rating"), "3");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(reviewsAPI.update).toHaveBeenCalledWith("review-1", {
      rating: 3,
      content: "On reflection, the bass does the work.",
    });
    expect(await screen.findByText("On reflection, the bass does the work.")).toBeInTheDocument();
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
    vi.mocked(reviewsAPI.delete).mockResolvedValue(axiosResponse(undefined as never));
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(reviewsAPI.delete).toHaveBeenCalledWith("review-1");
    expect(await screen.findByText(/no one has reviewed this band yet/i)).toBeInTheDocument();
  });

  it("keeps the review when you change your mind", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(reviewsAPI.delete).not.toHaveBeenCalled();
    expect(screen.getByText(/three chords and the truth/i)).toBeInTheDocument();
  });

  // The server is the one that decides: a refused deletion must not make the
  // review disappear from the page.
  it("keeps the review on screen when the server refuses the deletion", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(reviewsAPI.delete).mockRejectedValue(new Error("403"));
    renderReviews();

    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be deleted/i);
    expect(screen.getByText(/three chords and the truth/i)).toBeInTheDocument();
  });
});

describe("BandReviews — when the API is down", () => {
  it("says so instead of pretending the band has no reviews", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(reviewsAPI.forBand).mockRejectedValue(new Error("500"));
    renderReviews();

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be loaded/i);
    expect(screen.queryByText(/no one has reviewed this band yet/i)).not.toBeInTheDocument();
  });
});
