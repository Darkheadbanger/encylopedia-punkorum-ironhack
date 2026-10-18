import { Link } from "react-router-dom";
import "../styles/RandomInfo.css";

// Encyclopaedia Metallum's sidebar, which this one copies, is a browse menu.
// Most of ours is not built yet, and used to pretend otherwise: every entry
// looked like a link, and clicking one did nothing at all.
//
// An entry that leads nowhere is no longer a link. It is greyed out and carries
// a title, so hovering says why rather than leaving the visitor to guess. The
// ones that do lead somewhere stay ordinary links.

const SOON = "Coming soon";

/** A browse entry that is not built yet: visibly inactive, and says so on hover. */
const Soon = ({ label }: { label: string }) => (
  <li>
    <span className="info-link-soon" title={SOON}>{label}</span>
  </li>
);

function RandomInfos() {
  return (
    <aside className="randominfos-container">
      <div className="randominfos-info">
        <section className="info-section">
          <h3>Bands</h3>
          <ul className="info-links">
            <Soon label="Alphabetical" />
            <Soon label="Country" />
            <Soon label="Genre" />
          </ul>
        </section>

        <section className="info-section">
          <h3>Labels</h3>
          <ul className="info-links">
            <Soon label="Alphabetical" />
            <Soon label="Country" />
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
            <Soon label="Random Band" />
            <Soon label="Random Album" />
          </ul>
        </section>
      </div>
    </aside>
  );
}

export default RandomInfos;
