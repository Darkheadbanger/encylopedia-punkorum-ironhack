import React from "react";
import "../styles/BandsList.css";

function BandsList({band}) {
  const genreMusic = band.tags.map((genre) => genre.name).filter((genre) => genre.match("punk") || genre.match("hardcore") || genre.match("grindcore") || genre.match("emo") || genre.match("powerviolene")).join(" ")
  const status = band["life-span"].ended === null ? "Still Active" : `Split-up`
  const isActiveClass = band["life-span"].ended === null ? "still-active" : "not-active";
  /*.still-active{
    color: green;
}

.not-active{
    color: red;
}*/
  return (
    <div className="band-list-container">
      <h3 className="band-name">{band.name}</h3>
      <p>{band.country}</p>
      <p>{genreMusic}</p>
      <p className={isActiveClass}> {status}</p>
    </div>
  );
}

export default BandsList;
