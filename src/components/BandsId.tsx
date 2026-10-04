import { useState } from "react";
import "../styles/bandsId.css"
import { Link, useNavigate, useParams } from "react-router-dom";
import misfitsImage from "../assets/misfits.jpg";
import { bandsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { DISCOGRAPHY_FILTERS } from "../types";
import type { Band, DiscographyFilter, SetBands } from "../types";

// This file used to hold two of everything — two album shapes, two member shapes,
// a MusicBrainz request, a loading state and a pair of type guards — because half
// the bands came straight from MusicBrainz. They are ingested into our database
// now, so there is one shape, no request, and nothing to wait for.

const HISTORY_PREVIEW_LENGTH = 400;

function BandsId({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  const {bandsId} = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const band = bands.find(band => band.id === bandsId);

  const [tab, setTab] = useState<"discography" | "members">("discography");
  const [discographyFilter, setDiscographyFilter] = useState<DiscographyFilter>("Complete");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // The Cover Art Archive answers 404 when it has no sleeve for a release, and a
  // hand-pasted URL can rot. Either way, a broken image icon is worse than none.
  const [imageFailed, setImageFailed] = useState(false);

  if (!band) {
    return <p>Band not found</p>;
  }

  // The band is deleted on the server first: the list is only updated once the
  // server said yes, so a refused deletion never makes the band disappear.
  const handleDelete = () => {
    if (!window.confirm(`Delete ${band.name}?`)) return;

    bandsAPI.delete(band.id)
      .then(() => {
        setBands((theBands) => theBands.filter((theBand) => theBand.id !== band.id));
        navigate("/bands");
      })
      .catch((error) => {
        console.error(error);
        setDeleteError("This band could not be deleted. Are you still logged in?");
      });
  };

  const releases = band.albums ?? [];
  const members = band.members ?? [];

  const allowedTypes = DISCOGRAPHY_FILTERS[discographyFilter];
  const shownReleases = allowedTypes
    ? releases.filter((release) => (allowedTypes as readonly string[]).includes(release.type))
    : releases;

  const history = band.description;
  const needsReadMore = !!history && history.length > HISTORY_PREVIEW_LENGTH;
  const shownHistory = needsReadMore && !historyExpanded
    ? `${history.slice(0, HISTORY_PREVIEW_LENGTH)}…`
    : history;

  return (
    <>
      <div className="bands-info-container">
        <div className="band-heading">
          <h2>
            <span>{band.name}</span>
          </h2>

          {/* The API answers 401 to a write without a token: showing these to a
              visitor would only offer an action that cannot work. */}
          {isLoggedIn ? (
            <div className="band-actions">
              <Link to={`/updateBand/${band.id}`} className="band-action is-edit">
                Edit this band
              </Link>
              <button
                type="button"
                className="band-action is-delete"
                onClick={handleDelete}
              >
                Delete this band
              </button>
            </div>
          ) : (
            <p className="band-actions-locked">
              <Link to="/signup">Log in</Link> to edit or delete this band.
            </p>
          )}
        </div>

        {deleteError && <p className="band-action-error" role="alert">{deleteError}</p>}

        <div className="band-info">
            <ul className="band-info-list">
                <li><span>Country of origin : </span>{band.country || "N/A"}</li>
                <li><span>Location : </span>{band.location || "N/A"}</li>
                <li><span>Status : </span>{band.status || "N/A"}</li>
                <li><span>Formed in : </span>{band.formed || "N/A"}</li>
                <li><span>Years active : </span>
                  {`${band.formed || "?"} - ${band.disbanded || "Present"}`}
                </li>
            </ul>
            <ul className="band-info-list">
                <li><span>Genre : </span>{band.genre.length ? band.genre.join(", ") : "N/A"}</li>
                {band.themes && <li><span>Themes : </span>{band.themes}</li>}
                {band.label && <li><span>Current label : </span>{band.label}</li>}
                <li><span>Type : </span>{band.type || "Group"}</li>
                <li><span>Disambiguation : </span>{band.disambiguation || "N/A"}</li>
            </ul>
        </div>
        <div className="bands-photos-container">
            {band.name === "Misfits" ? (
              <img src={misfitsImage} alt="Misfits punk band" className="bands-photos"/>
            ) : band.image && !imageFailed ? (
              <>
                <img
                  src={band.image}
                  alt={`${band.name} punk band`}
                  className="bands-photos"
                  onError={() => setImageFailed(true)}
                />
                {/* Credit where it is due, and a hint that this is a sleeve
                    rather than a photograph of the band. */}
                {band.image.includes("coverartarchive.org") && (
                  <p className="photo-credit">Sleeve from the Cover Art Archive</p>
                )}
              </>
            ) : (
              <p className="photo-placeholder">Photos coming soon</p>
            )}
        </div>
      </div>

      {/* MusicBrainz data is public domain, but crediting the source is both
          honest and useful: it says where to go to correct it upstream. */}
      {band.source === "musicbrainz" && (
        <p className="band-credit">
          Imported from{" "}
          <a
            href={`https://musicbrainz.org/artist/${band.musicBrainzId}`}
            target="_blank"
            rel="noreferrer"
          >
            MusicBrainz
          </a>
          , then stored and edited here.
        </p>
      )}

      {shownHistory && (
        <section className="band-history">
          <h3>History</h3>
          <p>{shownHistory}</p>
          {needsReadMore && (
            <button
              type="button"
              className="read-more-btn"
              onClick={() => setHistoryExpanded(!historyExpanded)}
            >
              {historyExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </section>
      )}

      <section className="band-details">
        {/* role="tablist" tells a screen reader these buttons switch panels */}
        <div className="band-tabs" role="tablist" aria-label="Band details">
          {(["discography", "members"] as const).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`tab-${name}`}
              aria-selected={tab === name}
              aria-controls={`panel-${name}`}
              className={tab === name ? "band-tab is-active" : "band-tab"}
              onClick={() => setTab(name)}
            >
              {name === "discography" ? "Discography" : "Members"}
            </button>
          ))}
        </div>

        {tab === "discography" && (
          <div role="tabpanel" id="panel-discography" aria-labelledby="tab-discography">
            <div className="discography-filters">
              {(Object.keys(DISCOGRAPHY_FILTERS) as DiscographyFilter[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={discographyFilter === name}
                  className={discographyFilter === name ? "filter-btn is-active" : "filter-btn"}
                  onClick={() => setDiscographyFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {shownReleases.length > 0 ? (
              <table className="discography-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {shownReleases.map((release, index) => (
                    <tr key={release.title || index}>
                      <td>{release.title}</td>
                      <td>{release.type || "Unknown"}</td>
                      <td>{release.year || "?"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No releases in this category</p>
            )}
          </div>
        )}

        {tab === "members" && (
          <div role="tabpanel" id="panel-members" aria-labelledby="tab-members">
            {members.length > 0 ? (
              <ul className="members-list">
                {members.map((member, index) => (
                  <li key={member.name || index}>
                    <strong>{member.name}</strong>
                    {member.instrument && ` — ${member.instrument}`}
                    {member.period && ` (${member.period})`}
                    {member.otherBands && member.otherBands.length > 0 && (
                      <span className="member-other-bands">
                        Also in: {member.otherBands.join(", ")}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members information</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default BandsId;
