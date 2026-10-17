import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reviewsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Review } from "../types";
import "../styles/Reviews.css";

// What members think of a band, under the band itself.
//
// Reading needs no account. Writing needs one. Editing or deleting needs to BE
// the author — the API answers 403 otherwise, so the buttons only appear on your
// own review. That rule lives on the server; this file merely stops offering an
// action that could only fail.

const MIN_CONTENT = 10; // must match the Review schema on the backend
const MAX_RATING = 5;

/** "★★★★☆" — read aloud as "4 out of 5" rather than as five pieces of punctuation. */
const Stars = ({ rating }: { rating: number }) => (
  <span className="review-stars" aria-label={`${rating} out of ${MAX_RATING}`}>
    {"★".repeat(rating)}
    <span aria-hidden="true" className="review-stars-empty">
      {"★".repeat(MAX_RATING - rating)}
    </span>
  </span>
);

const averageOf = (reviews: Review[]) =>
  reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;

function BandReviews({ bandId }: { bandId: string }) {
  const { isLoggedIn, user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // The form doubles as the edit form: editing loads a review into it, and
  // `editing` is what decides between POST and PUT on submit.
  const [editing, setEditing] = useState<string | null>(null);
  const [rating, setRating] = useState(MAX_RATING);
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    reviewsAPI.forBand(bandId)
      .then(({ data }) => setReviews(data))
      .catch((error) => {
        console.error(error);
        setLoadError("The reviews could not be loaded.");
      });
  }, [bandId]);

  const resetForm = () => {
    setEditing(null);
    setRating(MAX_RATING);
    setContent("");
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    // The schema checks this too; catching it here saves a pointless round trip.
    if (content.trim().length < MIN_CONTENT) {
      setFormError(`A review must be at least ${MIN_CONTENT} characters long.`);
      return;
    }

    setBusy(true);
    try {
      if (editing) {
        const { data } = await reviewsAPI.update(editing, { rating, content });
        setReviews((all) => all.map((review) => (review.id === editing ? data : review)));
      } else {
        const { data } = await reviewsAPI.create({ band: bandId, rating, content });
        setReviews((all) => [data, ...all]); // newest first, like the list itself
      }
      resetForm();
    } catch (error) {
      console.error(error);
      setFormError("This review could not be saved. Are you still logged in?");
    } finally {
      setBusy(false);
    }
  };

  // Removed from the list only once the server said yes, so a refused deletion
  // never makes a review disappear from the page.
  const handleDelete = (review: Review) => {
    if (!window.confirm("Delete your review?")) return;

    reviewsAPI.delete(review.id)
      .then(() => {
        setReviews((all) => all.filter((one) => one.id !== review.id));
        if (editing === review.id) resetForm();
      })
      .catch((error) => {
        console.error(error);
        setFormError("This review could not be deleted.");
      });
  };

  const startEditing = (review: Review) => {
    setEditing(review.id);
    setRating(review.rating);
    setContent(review.content);
    setFormError(null);
  };

  return (
    <section className="band-reviews" aria-labelledby="reviews-heading">
      <h3 id="reviews-heading">
        Reviews{reviews.length > 0 && ` (${reviews.length})`}
      </h3>

      {reviews.length > 0 && (
        <p className="reviews-average">
          <Stars rating={Math.round(averageOf(reviews))} />
          <span>{averageOf(reviews).toFixed(1)} / {MAX_RATING}</span>
        </p>
      )}

      {loadError && <p className="review-error" role="alert">{loadError}</p>}

      {isLoggedIn ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <label htmlFor="review-rating">Rating</label>
          <select
            id="review-rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {Array.from({ length: MAX_RATING }, (_unused, index) => MAX_RATING - index).map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "star" : "stars"}
              </option>
            ))}
          </select>

          <label htmlFor="review-content">Your review</label>
          <textarea
            id="review-content"
            rows={4}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What does this band actually sound like?"
            required
          />

          <div className="review-form-actions">
            <button type="submit" disabled={busy}>
              {editing ? "Save changes" : "Post review"}
            </button>
            {editing && (
              <button type="button" className="review-cancel" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {formError && <p className="review-error" role="alert">{formError}</p>}
        </form>
      ) : (
        <p className="reviews-locked">
          <Link to="/signup">Log in</Link> to review this band.
        </p>
      )}

      {reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review">
              <div className="review-head">
                <Stars rating={review.rating} />
                <span className="review-author">{review.author?.username ?? "Unknown"}</span>
                <time dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString("en-GB")}
                </time>
              </div>

              <p className="review-content">{review.content}</p>

              {/* Only on your own: the API answers 403 for anyone else's. */}
              {user?.id === review.author?.id && (
                <div className="review-actions">
                  <button type="button" onClick={() => startEditing(review)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(review)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loadError && <p className="reviews-none">No one has reviewed this band yet.</p>
      )}
    </section>
  );
}

export default BandReviews;
