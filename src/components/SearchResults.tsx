import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { upstreamAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Band, SetBands, UpstreamCandidate } from "../types";
import "../styles/Search.css";

// The search page, and the only place MusicBrainz is mentioned at all.
//
// Even here the browser does not call MusicBrainz: it asks our backend, which
// searches, translates and — on Import — stores the band. A candidate becomes an
// ordinary band of the site, editable and deletable, and is read from our own
// database from then on.

/** Does this band of ours match what was typed, in its name, genres or label? */
const matches = (band: Band, term: string) =>
  [band.name, band.label ?? "", ...band.genre].join(" ").toLowerCase().includes(term);

function SearchResults({ bands, setBands }: { bands: Band[]; setBands: SetBands }) {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();

  const term = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [candidates, setCandidates] = useState<UpstreamCandidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  /** musicBrainzId -> the band once imported, so the row can link to it. */
  const [imported, setImported] = useState<Record<string, Band>>({});
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (!term) return; // nothing typed: no request

    setIsSearching(true);
    setSearchError(null);

    upstreamAPI.search(term)
      .then(({ data }) => setCandidates(data))
      .catch((error) => {
        console.error(error);
        // Said here and nowhere else: the rest of the site does not depend on it.
        setSearchError("Could not reach MusicBrainz. Our own results are below.");
        setCandidates([]);
      })
      .finally(() => setIsSearching(false));
  }, [term]);

  const ours = term ? bands.filter((band) => matches(band, term)) : [];

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
        setImportError("This band could not be imported. It may already be here.");
      });
  };

  if (!term) {
    return (
      <p className="search-empty">
        Type a band name in the search box above to look it up — here and on MusicBrainz.
      </p>
    );
  }

  return (
    <>
      <h2 className="search-title">Search: "{searchParams.get("q")}"</h2>

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
                ) : isLoggedIn ? (
                  <button
                    type="button"
                    className="search-import"
                    onClick={() => handleImport(candidate)}
                  >
                    Import
                  </button>
                ) : (
                  <span className="search-note">Log in to import this band</span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

export default SearchResults;
