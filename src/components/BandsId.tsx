import { useEffect, useState } from "react";
import "../styles/bandsId.css"
import { useParams } from "react-router-dom";
import misfitsImage from "../assets/misfits.jpg";
import { APIFromMusicBrainz } from "../services/api";
import { DISCOGRAPHY_FILTERS } from "../types";
import type {
  Album,
  Band,
  DiscographyFilter,
  Member,
  MusicBrainzDetails,
} from "../types";

// An album (or a member) can come from our own data or from MusicBrainz, and the two
// shapes differ. These little functions are TYPE GUARDS: the `x is Album` return type
// tells TypeScript that inside the if-branch, the value really is a local Album.
type AlbumEntry = Album | NonNullable<MusicBrainzDetails["release-groups"]>[number];
type MemberEntry = Member | NonNullable<MusicBrainzDetails["relations"]>[number];

const isLocalAlbum = (album: AlbumEntry): album is Album => "year" in album;
const isLocalMember = (member: MemberEntry): member is Member => "instrument" in member;

/** One row of the discography table, whatever the source. */
interface Release {
  key: string;
  title: string;
  type: string;
  year: string;
}

// MusicBrainz has its own vocabulary. Translate it into ours so both sources land in
// the same discography categories.
const MUSICBRAINZ_TYPES: Record<string, string> = {
  Album: "Full-length",
  Live: "Live album",
  Bootleg: "Bootleg",
  Compilation: "Compilation",
  Demo: "Demo",
  EP: "EP",
  Single: "Single",
};

const musicBrainzType = (
  album: Exclude<AlbumEntry, Album>,
): string => {
  // A secondary type ("Live", "Compilation") is more specific than the primary one.
  const raw = album["secondary-types"]?.[0] ?? album["primary-type"];
  if (!raw) return "Unknown";
  return MUSICBRAINZ_TYPES[raw] ?? raw;
};

const toRelease = (album: AlbumEntry, index: number): Release =>
  isLocalAlbum(album)
    ? {
        key: album.title || String(index),
        title: album.title,
        type: album.type || "Unknown",
        year: album.year || "?",
      }
    : {
        key: album.id || String(index),
        title: album.title,
        type: musicBrainzType(album),
        year: album["first-release-date"]?.slice(0, 4) || "?",
      };

const HISTORY_PREVIEW_LENGTH = 400;

function BandsId({bands}: { bands: Band[] }) {
  const {bandsId} = useParams();

  const band = bands.find(band => band.id === bandsId);

  const [bandsDetails, setBandsDetails] = useState<MusicBrainzDetails | null>(null);
  const [loading, setLoading] = useState(band?.source !== 'local');
  const [tab, setTab] = useState<"discography" | "members">("discography");
  const [discographyFilter, setDiscographyFilter] = useState<DiscographyFilter>("Complete");
  const [historyExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    // Si le groupe n'existe pas ou si c'est local, ne rien faire
    if (!band || band.source === 'local') return;

    // Si c'est MusicBrainz, faire la requête API
    const timer = setTimeout(() => {
      APIFromMusicBrainz.getBandDetails(band.id)
        .then((res) => {
          setBandsDetails(res.data);
          setLoading(false);
        }).catch((error) => {
          console.error(error);
          setLoading(false);
        })
    }, 1000);

    return () => clearTimeout(timer);
  }, [band]);

  // Si le groupe n'existe pas
  if (!band) {
    return <p>Band not found</p>;
  }

  // Préparer les données selon la source
  let members: MemberEntry[] = [];
  let albums: AlbumEntry[] = [];

  if (band.source === 'local') {
    members = band.members || [];
    albums = band.albums || [];
  } else {
    members = bandsDetails?.relations?.filter(
      (member) => member.type === "member of band"
    ) || [];
    // Everything MusicBrainz has: the discography tabs do the filtering now.
    albums = bandsDetails?.['release-groups'] || [];
  }

  const releases = albums.map(toRelease);
  const allowedTypes = DISCOGRAPHY_FILTERS[discographyFilter];
  const shownReleases = allowedTypes
    ? releases.filter((release) => (allowedTypes as readonly string[]).includes(release.type))
    : releases;

  const history = band.source === 'local' ? band.description : undefined;
  const needsReadMore = !!history && history.length > HISTORY_PREVIEW_LENGTH;
  const shownHistory = needsReadMore && !historyExpanded
    ? `${history.slice(0, HISTORY_PREVIEW_LENGTH)}…`
    : history;

  return (
    <>
      <div className="bands-info-container">
        <h2>
          <span>{band.name}</span>
        </h2>
        <div className="band-info">
            <ul className="band-info-list">
                <li><span>Country of origin : </span>{band.country || "N/A"}</li>
                <li><span>Location : </span>
                  {band.source === 'local'
                    ? (band.location || "N/A")
                    : (band["begin-area"]?.name || "N/A")
                  }
                </li>
                <li><span>Status : </span>
                  {band.source === 'local'
                    ? (band.status || "N/A")
                    : (band["life-span"]?.ended ? "Disbanded" : "Active")
                  }
                </li>
                <li><span>Formed in : </span>
                  {band.source === 'local'
                    ? (band.formed || "N/A")
                    : (band["life-span"]?.begin || "N/A")
                  }
                </li>
                <li><span>Years active : </span>
                  {band.source === 'local'
                    ? `${band.formed || "?"} - ${band.disbanded || "Present"}`
                    : `${band["life-span"]?.begin || "?"} - ${band["life-span"]?.end || "Present"}`
                  }
                </li>
            </ul>
            <ul className="band-info-list">
                <li><span>Genre : </span>
                  {band.source === 'local'
                    ? (band.genre.length ? band.genre.join(", ") : "N/A")
                    : (band.tags?.map((tag) => tag.name).join(", ") || "N/A")
                  }
                </li>
                {band.source === 'local' && band.themes && (
                  <li><span>Themes : </span>{band.themes}</li>
                )}
                {band.source === 'local' && band.label && (
                  <li><span>Current label : </span>{band.label}</li>
                )}
                <li><span>Type : </span>{band.type || "Group"}</li>
                <li><span>Disambiguation : </span>{band.disambiguation || "N/A"}</li>
            </ul>
        </div>
        <div className="bands-photos-container">
            {band.name === "Misfits" ? (
              <img src={misfitsImage} alt="Misfits punk band" className="bands-photos"/>
            ) : band.source === 'local' && band.image ? (
              <img src={band.image} alt={`${band.name} punk band`} className="bands-photos"/>
            ) : (
              <p>Photos coming soon</p>
            )}
        </div>
      </div>

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

            {loading ? (
              <p>Loading discography...</p>
            ) : shownReleases.length > 0 ? (
              <table className="discography-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {shownReleases.map((release) => (
                    <tr key={release.key}>
                      <td>{release.title}</td>
                      <td>{release.type}</td>
                      <td>{release.year}</td>
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
            {loading ? (
              <p>Loading members...</p>
            ) : members.length > 0 ? (
              <ul className="members-list">
                {members.map((member, index) => {
                  if (isLocalMember(member)) {
                    return (
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
                    );
                  }
                  return (
                    <li key={member.artist?.id || index}>
                      <strong>{member.artist?.name || 'Unknown'}</strong>
                      {member.attributes && member.attributes.length > 0
                        && ` — ${member.attributes.join(', ')}`}
                      {member.begin && ` (${member.begin} - ${member.end || 'Present'})`}
                    </li>
                  );
                })}
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
