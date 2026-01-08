import React from "react";
import "../styles/BandsList.css";
import { Link } from "react-router-dom";
import { localBandsAPI } from "../services/api";

function BandsList({band, setBands}) {
  
  // Gérer les deux structures : locale (JSON Server) et MusicBrainz
  let genreMusic, status, isActiveClass;
  
  if (band.source === 'local') {
    // Structure locale
    genreMusic = Array.isArray(band.genre) ? band.genre.join(" ") : band.genre || "N/A";
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

  const deleteButton = (event) => {
    event.preventDefault();

    if(window.confirm(`Delete ${band.name}`)){
      localBandsAPI.delete(band.id)
      .then(() => setBands(theBands => theBands.filter((theBand) => theBand.id !== band.id)))
      .catch(error => console.error(error))
    }
  }

  return (
    <>
      <tbody>
          <tr className="band-list-container">
            <div className="bandId">
                <td scope="col" className="band-name">
                  <Link to={`/bands/${band.id}`} >
                    <p>{band.name}</p>
                  </Link>
                  {band.editable && <div className="edit-table">✏️</div>}
                  {band.editable && <div className="delete-table" onClick={deleteButton}>🗑️</div>}
                </td>
            </div>
            <td scope="col">{band.country || "N/A"}</td>
            <td scope="col" className="genre">{genreMusic}</td>
            <td scope="col" className={isActiveClass}>{status}</td>
          </tr>
      </tbody>
    </>
  );
}

export default BandsList;
