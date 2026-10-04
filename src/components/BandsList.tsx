import "../styles/BandsList.css";
import { Link } from "react-router-dom";
import type { Band } from "../types";

// Genres are multi-word ("punk rock", "New York Punk"), so a space alone would
// run them together into one unreadable line.
const GENRE_SEPARATOR = " · ";

// A row is a summary and nothing else: editing and deleting live on the band's own
// page, where the buttons can be labelled instead of being two tiny icons.
//
// There used to be a second branch here for bands coming straight from MusicBrainz,
// which had a different shape. They are ingested into our database now, so every
// band reaching this component looks the same.
function BandsList({band}: { band: Band }) {
  const genres = band.genre.length ? band.genre.join(GENRE_SEPARATOR) : "N/A";
  const isActive = band.status === "Active";

  // One table row: the <table> and <tbody> are in BandsPage
  return (
    <tr className="band-list-container">
      <td className="band-id">
        <div className="band-name">
          <Link to={`/bands/${band.id}`} >
            <p>{band.name}</p>
          </Link>
        </div>
      </td>
      <td>{band.country || "N/A"}</td>
      <td className="genre">{genres}</td>
      <td className={isActive ? "still-active" : "not-active"}>{band.status || "N/A"}</td>
    </tr>
  );
}

export default BandsList;
