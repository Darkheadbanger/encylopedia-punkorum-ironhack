import { useState } from "react";
import logoImage from "../assets/encyclopedia-punkorum-logo.png";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  // Must match an <option value>, otherwise the controlled <select> has no matching option
  const [selectSearch, setSelectSearch] = useState("bands");

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSearch(event.target.value);
  };

  // No search logic yet: stop the browser from reloading the whole app on submit
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
