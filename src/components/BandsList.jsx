import React from "react";
import "../styles/BandsList.css";

function BandsList({band}) {
  const genreMusic = band.tags.map((genre) => genre.name).filter((genre) => genre.match("punk") || genre.match("hardcore") || genre.match("grindcore") || genre.match("emo") || genre.match("powerviolene")).join(" ")
  const status = band["life-span"].ended === null ? "Still Active" : `Split-up`
  const isActiveClass = band["life-span"].ended === null ? "still-active" : "not-active";

  return (
    <tr className="band-list-container">
      <td className="band-name">{band.name}</td>
      <td>{band.country}</td>
      <td className="genre">{genreMusic}</td>
      <td className={isActiveClass}>{status}</td>
    </tr>
  );
}

export default BandsList;
