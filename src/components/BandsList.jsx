import React from "react";
import "../styles/MainPage.css";

function BandsList({band}) {
  return (
    <div className="band-item">
      <h3>{band.name}</h3>
      <p>Country: {band.country || 'Unknown'}</p>
      <p>Type: {band.type}</p>
    </div>
  );
}

export default BandsList;
