import React from "react";
import "../styles/BandsList.css";

function BandsList({band}) {
  const genreMusic = band.tags.map((genre) => genre.name).filter((genre) => genre.match("punk") || genre.match("hardcore") || genre.match("grindcore") || genre.match("emo") || genre.match("powerviolene")).join(" ")
  const status = band["life-span"].ended === null ? "Still Active" : `Split-up`
  const isActiveClass = band["life-span"].ended === null ? "still-active" : "not-active";

  return (
    <>
      <thead>
      <tr className="band-list-container">
          <th scope="col" className="band-head-list">Bands</th>
          <th scope="col" className="band-head-list">Country</th>
          <th scope="col" className="band-head-list">Genre</th>
          <th scope="col" className="band-head-list">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr className="band-list-container">
          <td scope="col" className="band-name">{band.name}</td>
          <td scope="col">{band.country}</td>
          <td scope="col" className="genre">{genreMusic}</td>
          <td scope="col" className={isActiveClass}>{status}</td>
        </tr>
      </tbody>
    </>
  );
}

export default BandsList;
