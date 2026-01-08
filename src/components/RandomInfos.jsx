import React from "react";
import "../styles/RandomInfo.css";

function RandomInfos() {
  const handleClick = (e) => {
    e.preventDefault();
    // Placeholder pour les futurs liens
  };

  return (
    <aside className="randominfos-container">
      <div className="randominfos-info">
        <section className="info-section">
          <h3>Bands</h3>
          <ul className="info-links">
            <li><a href="#" onClick={handleClick}>Alphabetical</a></li>
            <li><a href="#" onClick={handleClick}>Country</a></li>
            <li><a href="#" onClick={handleClick}>Genre</a></li>
          </ul>
        </section>

        <section className="info-section">
          <h3>Labels</h3>
          <ul className="info-links">
            <li><a href="#" onClick={handleClick}>Alphabetical</a></li>
            <li><a href="#" onClick={handleClick}>Country</a></li>
          </ul>
        </section>

        <section className="info-section">
          <h3>Reviews</h3>
          <ul className="info-links">
            <li><a href="#" onClick={handleClick}>Latest</a></li>
            <li><a href="#" onClick={handleClick}>Top Rated</a></li>
          </ul>
        </section>

        <section className="info-section">
          <h3>Random</h3>
          <ul className="info-links">
            <li><a href="#" onClick={handleClick}>Random Band</a></li>
            <li><a href="#" onClick={handleClick}>Random Album</a></li>
          </ul>
        </section>
      </div>
    </aside>
  );
}

export default RandomInfos;
