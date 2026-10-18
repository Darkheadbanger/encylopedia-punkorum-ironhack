import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { upstreamAPI } from "../services/api";
import { errorMessage } from "../services/errorMessage";
import { useAuth } from "../context/AuthContext";
import type { Band, SetBands, UpstreamCandidate } from "../types";
import {
  DEFAULT_CATEGORY,
  SEARCH_CATEGORIES,
  isSearchCategory,
  matchesIn,
} from "../searchCategories";
import "../styles/Search.css";

// The search page, and the only place MusicBrainz is mentioned at all.
//
// Even here the browser does not call MusicBrainz: it asks our backend, which
// searches, translates and — on Import — stores the band. A candidate becomes an
// ordinary band of the site, editable and deletable, and is read from our own
// database from then on.
//
// Searching the encyclopedia is public. Searching MusicBrainz is not: it is a
// contribution tool, only a member can import what it finds, and every query
// spends one of the requests MusicBrainz allows us (about one per second). So the
// whole panel is hidden from a visitor who is not logged in — which also means
// GET /bands/upstream is never called anonymously, where it would answer 401 and
// look like a MusicBrainz outage.

function SearchResults({ bands, setBands }: { bands: Band[]; setBands: SetBands }) {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  const term = (searchParams.get("q") ?? "").trim().toLowerCase();

  // Which fields to look in, from the dropdown beside the search box. An unknown
  // or missing value falls back to band names, so an old link still works.
  const inParam = searchParams.get("in");
  const category = isSearchCategory(inParam) ? inParam : DEFAULT_CATEGORY;

  // The answer carries the term it answers, so nothing has to be cleared when the
  // term changes: results for another term simply do not match and are not shown.
  // A MusicBrainz call takes about a second, so two searches in a row leave two in
  // flight and they can land out of order — the older one would otherwise overwrite
  // the newer, and stop the spinner while the real request was still running.
  const [answer, setAnswer] = useState<{
    term: string;
    candidates: UpstreamCandidate[];
    error: string | null;
  } | null>(null);
  /** musicBrainzId -> the band once imported, so the row can link to it. */
  const [imported, setImported] = useState<Record<string, Band>>({});
  const [importError, setImportError] = useState<string | null>(null);

  const fresh = answer?.term === term ? answer : null;
  const candidates = fresh?.candidates ?? [];
  const searchError = fresh?.error ?? null;
  const isSearching = Boolean(term) && isLoggedIn && !fresh;

  useEffect(() => {
    if (!term) return;        // nothing typed: no request
    if (!isLoggedIn) return;  // the panel is hidden anyway, and the API would say 401

    let current = true;

    upstreamAPI.search(term)
      .then(({ data }) => { if (current) setAnswer({ term, candidates: data, error: null }); })
      .catch((error) => {
        if (!current) return;
        console.error(error);
        // Said here and nowhere else: the rest of the site does not depend on it.
        setAnswer({
          term,
          candidates: [],
          error: "Could not reach MusicBrainz. Our own results are below.",
        });
      });

    return () => { current = false; };
  }, [term, isLoggedIn]);

  const ours = term ? bands.filter((band) => matchesIn(band, term, category)) : [];

  const handleImport = (candidate: UpstreamCandidate) => {
    const musicBrainzId = candidate.musicBrainzId;
    if (!musicBrainzId) return;

    setImportError(null);

    upstreamAPI.import(musicBrainzId)
      .then(({ data }) => {
        // Newest first, like the bands list itself.
        setBands((existing) => [data, ...existing]);
        setImported((already) => ({ ...already, [musicBrainzId]: data }));
      })
      .catch((error) => {
        console.error(error);
        setImportError(errorMessage(error, "This band could not be imported. It may already be here."));
      });
  };

  if (!term) {
    return (
      <p className="search-empty">
        Type a band name in the search box above to look it up
        {isLoggedIn ? " — here and on MusicBrainz." : " in the encyclopedia."}
      </p>
    );
  }

  return (
    <>
      {/* The category is named, so a search that finds nothing says which field
          it looked in rather than leaving the visitor to wonder. */}
      <h2 className="search-title">
        Search: "{searchParams.get("q")}"
        {category !== DEFAULT_CATEGORY && (
          <span className="search-category"> in {SEARCH_CATEGORIES[category].label}</span>
        )}
      </h2>

      <section className="search-panel" aria-label={`In the encyclopedia (${ours.length})`}>
        <h3>In the encyclopedia ({ours.length})</h3>
        {ours.length > 0 ? (
          <ul className="search-list">
            {ours.map((band) => (
              <li key={band.id}>
                <Link to={`/bands/${band.id}`}>{band.name}</Link>
                <span className="search-meta">
                  {[band.country, band.formed, band.genre[0]].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="search-none">No band matches "{searchParams.get("q")}" here yet.</p>
        )}
      </section>

      {!isLoggedIn ? (
        <p className="search-note search-members-only">
          Log in to also search MusicBrainz and import bands from it, or{" "}
          <Link to="/signup">create an account</Link>.
        </p>
      ) : (
      <section className="search-panel" aria-label="On MusicBrainz">
        <h3>On MusicBrainz</h3>

        {searchError && <p className="search-error" role="alert">{searchError}</p>}
        {importError && <p className="search-error" role="alert">{importError}</p>}

        {isSearching && <p className="search-none">Searching...</p>}

        {!isSearching && !searchError && candidates.length === 0 && (
          <p className="search-none">Nothing on MusicBrainz for "{searchParams.get("q")}".</p>
        )}

        <ul className="search-list">
          {candidates.map((candidate) => {
            const justImported = imported[candidate.musicBrainzId ?? ""];

            return (
              <li key={candidate.musicBrainzId}>
                <span className="search-name">{candidate.name}</span>
                <span className="search-meta">
                  {[
                    candidate.country,
                    candidate.formed,
                    candidate.status,
                    candidate.genre.join(", "),
                  ].filter(Boolean).join(" · ")}
                </span>
                {candidate.disambiguation && (
                  <span className="search-note">{candidate.disambiguation}</span>
                )}

                {justImported ? (
                  <Link to={`/bands/${justImported.id}`} className="search-imported">
                    Imported — view it
                  </Link>
                ) : candidate.alreadyImported ? (
                  <span className="search-imported">Already in the encyclopedia</span>
                ) : (
                  <button
                    type="button"
                    className="search-import"
                    onClick={() => handleImport(candidate)}
                  >
                    Import
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      )}
    </>
  );
}

export default SearchResults;
