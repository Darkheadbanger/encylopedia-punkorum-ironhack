import { Link } from "react-router-dom";
import "../styles/RandomInfo.css";

// Encyclopaedia Metallum's sidebar, which this one copies, is a browse menu. Most
// of ours is still a promise: the links that lead nowhere call preventDefault
// rather than pretending. The Reviews pair is the first to actually lead somewhere.

function RandomInfos() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Placeholder: these browse links are not built yet
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
            <li><Link to="/reviews">Latest</Link></li>
            <li><Link to="/reviews?sort=rating">Top Rated</Link></li>
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
