import "../styles/BandsList.css";
import { Link } from "react-router-dom";
import { localBandsAPI } from "../services/api";
import type { Band, SetBands } from "../types";

function BandsList({band, setBands}: { band: Band; setBands: SetBands }) {
  
  // Gérer les deux structures : locale (JSON Server) et MusicBrainz
  let genreMusic: string;
  let status: string;
  let isActiveClass: string;
  
  if (band.source === 'local') {
    // Structure locale
    genreMusic = band.genre.length ? band.genre.join(" ") : "N/A";
    status = band.status || "N/A";
    isActiveClass = band.status === "Active" ? "still-active" : "not-active";
  } else {
    // Structure MusicBrainz
    genreMusic = band.tags 
      ? band.tags.map((genre) => genre.name)
          .filter((genre) => genre.match("punk") || genre.match("hardcore") || genre.match("grindcore") || genre.match("emo") || genre.match("powerviolene"))
          .join(" ")
      : "N/A";
    status = band["life-span"]?.ended === null ? "Still Active" : "Split-up";
    isActiveClass = band["life-span"]?.ended === null ? "still-active" : "not-active";
  }

  const deleteButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if(window.confirm(`Delete ${band.name}`)){
      localBandsAPI.delete(band.id)
      .then(() => setBands((theBands) => theBands.filter((theBand) => theBand.id !== band.id)))
      .catch(error => console.error(error))
    }
  }

  // One table row: the <table> and <tbody> are in BandsPage
  return (
    <tr className="band-list-container">
      <td className="band-id">
        <div className="band-name">
          <Link to={`/bands/${band.id}`} >
            <p>{band.name}</p>
          </Link>
          {band.editable && <Link to={`/updateBand/${band.id}`} className="edit-table" aria-label={`Edit ${band.name}`}>✏️</Link>}
          {band.editable && <button type="button" className="delete-table" onClick={deleteButton} aria-label={`Delete ${band.name}`}>🗑️</button>}
        </div>
      </td>
      <td>{band.country || "N/A"}</td>
      <td className="genre">{genreMusic}</td>
      <td className={isActiveClass}>{status}</td>
    </tr>
  );
}

export default BandsList;
