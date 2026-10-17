import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { reviewsAPI } from "../services/api";
import type { Band, Review } from "../types";
import "../styles/Reviews.css";

// Every review on the site, in one place — what the sidebar's "Latest" and
// "Top Rated" have always pointed at, and never reached.
//
// Reading needs no account, like the bands. Writing one happens on the band's own
// page, where the band is: a review of nothing in particular is not a thing.

const MAX_RATING = 5;

const SORTS = {
  latest: { label: "Latest", compare: () => 0 }, // the API already sends newest first
  rating: {
    label: "Top Rated",
    compare: (one: Review, other: Review) => other.rating - one.rating,
  },
} as const;

type Sort = keyof typeof SORTS;

const isSort = (value: string | null): value is Sort => value === "latest" || value === "rating";

function ReviewsList({ bands }: { bands: Band[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sortParam = searchParams.get("sort");
  const sort: Sort = isSort(sortParam) ? sortParam : "latest";

  useEffect(() => {
    reviewsAPI.getAll()
      .then(({ data }) => setReviews(data))
      .catch((error) => {
        console.error(error);
        setLoadError("The reviews could not be loaded.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // A review carries its band's id, not its name. The bands are already in memory,
  // so naming them here costs nothing and spares the API a second query.
  const bandName = (id: string) => bands.find((band) => band.id === id)?.name;

  // [...reviews] because sort() works in place, and this is our own state.
  const shown = [...reviews].sort(SORTS[sort].compare);

  return (
    <section className="reviews-page">
      <div className="reviews-sorts" role="tablist" aria-label="Sort the reviews">
        {(Object.keys(SORTS) as Sort[]).map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={sort === name}
            className={sort === name ? "filter-btn is-active" : "filter-btn"}
            onClick={() => setSearchParams(name === "latest" ? {} : { sort: name })}
          >
            {SORTS[name].label}
          </button>
        ))}
      </div>

      {loadError && <p className="review-error" role="alert">{loadError}</p>}

      {isLoading && !loadError && <p className="reviews-none">Loading the reviews…</p>}

      {!isLoading && !loadError && shown.length === 0 && (
        <p className="reviews-none">
          Nobody has reviewed anything yet. Open a <Link to="/bands">band</Link> and be the first.
        </p>
      )}

      <ul className="reviews-list">
        {shown.map((review) => {
          const name = bandName(review.band);

          return (
            <li key={review.id} className="review">
              <div className="review-head">
                <span className="review-stars" aria-label={`${review.rating} out of ${MAX_RATING}`}>
                  {"★".repeat(review.rating)}
                  <span aria-hidden="true" className="review-stars-empty">
                    {"★".repeat(MAX_RATING - review.rating)}
                  </span>
                </span>
                {/* A review whose band was deleted keeps its text but loses its link. */}
                {name ? (
                  <Link to={`/bands/${review.band}`} className="review-band">{name}</Link>
                ) : (
                  <span className="review-band">A band that is no longer here</span>
                )}
                <span className="review-author">{review.author?.username ?? "Unknown"}</span>
                <time dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleDateString("en-GB")}
                </time>
              </div>

              <p className="review-content">{review.content}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ReviewsList;
