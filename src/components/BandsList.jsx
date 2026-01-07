import React from "react";
import "../styles/BandsList.css";
import { Link } from "react-router-dom";

function BandsList({band}) {
  
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

  return (
    <>
      <tbody>
          <tr className="band-list-container">
            <Link to={`/bands/${band.id}`} className="bandId">
              <td scope="col" className="band-name">
                {band.name}
                {band.editable && <span style={{marginLeft: '5px', fontSize: '0.8em'}}>✏️</span>}
              </td>
            </Link>
            <td scope="col">{band.country || "N/A"}</td>
            <td scope="col" className="genre">{genreMusic}</td>
            <td scope="col" className={isActiveClass}>{status}</td>
          </tr>
      </tbody>
    </>
  );
}

export default BandsList;
