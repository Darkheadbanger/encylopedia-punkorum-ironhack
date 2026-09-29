import { useState } from "react";
import { FAMILIES } from "../data/genres";
import "../styles/Genres.css";

/** Does this family mention the term anywhere — name, genre, band or tag? */
const matches = (family: (typeof FAMILIES)[number], term: string) => {
  const haystack = [
    family.name,
    family.summary,
    ...family.related,
    ...family.genres.flatMap((genre) => [genre.name, genre.description, ...genre.bands]),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
};

function GenresList() {
  const [filter, setFilter] = useState("");

  const term = filter.trim().toLowerCase();
  const shown = term ? FAMILIES.filter((family) => matches(family, term)) : FAMILIES;

  return (
    <>
      <p role="note" className="genres-note">
        Hard-coded for now — not stored in the database yet. Not every label below is a
        genre: some are scenes, fusions or fan labels.
      </p>

      {/* 14 families and a few hundred labels: without a filter this page is a wall. */}
      <div className="genres-filter">
        <label htmlFor="genre-filter">Filter genres</label>
        <input
          type="search"
          id="genre-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="crust, screamo, Sweden, Crass..."
        />
      </div>

      {shown.length === 0 && (
        <p role="status" className="genres-empty">
          No genre matches "{filter}".
        </p>
      )}

      {shown.map((family) => (
        <section key={family.name} className="genre-family">
          <h3>{family.name}</h3>
          <p className="family-summary">{family.summary}</p>

          <ul className="genres-grid" aria-label={`${family.name} genres`}>
            {family.genres.map((genre) => (
              <li key={genre.name} className="genre-card">
                <h4>{genre.name}</h4>
                <p className="genre-meta">
                  {genre.years} · {genre.origin}
                </p>
                <p className="genre-description">{genre.description}</p>
                <p className="genre-bands">{genre.bands.join(" · ")}</p>
              </li>
            ))}
          </ul>

          {/* Labels the encyclopedia knows without giving them a card. */}
          <ul className="related-tags" aria-label={`${family.name} related labels`}>
            {family.related.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export default GenresList;
