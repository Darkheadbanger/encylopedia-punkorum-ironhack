import { useState } from "react";
import logoImage from "../assets/encyclopedia-punkorum-logo.png";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Must match an <option value>, otherwise the controlled <select> has no matching option
  const [selectSearch, setSelectSearch] = useState("bands");
  const [term, setTerm] = useState("");

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSearch(event.target.value);
  };

  // preventDefault stops the browser from reloading the whole app; the router
  // takes it from there. An empty term goes nowhere: /search?q= searches nothing.
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <>
      <div className="punk-archive-logo">
        <Link to="/" ><img src={logoImage} alt="Encyclopedia Punkorum logo" /></Link>
      </div>
      <div className="info-container">
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <label htmlFor="search">Search:</label>
          <div className="forms-search-container">
            <input
              type="text"
              name="search"
              id="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder={"Select the " + selectSearch}
            />
            <select value={selectSearch} onChange={handleSelect} aria-label="Search category">
              <option value="bands">Bands</option>
              <option value="genres">Music Genre</option>
              <option value="themes">Themes</option>
              <option value="albums">Albums Title</option>
              <option value="songs">Songs Title</option>
              <option value="labels">Label</option>
              <option value="artists">Artist</option>
              <option value="google">Google</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
        <nav className="info-list">
          <div className="create-band">
            <Link to="/addBand" className="add-band">Submit new band</Link>
          </div>
          <ul className="info-list-site">
            {[["Help", "/help"], ["Rules", "/rules"], ["Store", "/store"], ["Forum", "/forum"]].map(
              ([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              )
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
