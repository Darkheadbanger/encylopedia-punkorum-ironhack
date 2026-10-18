import { useState } from "react";
import logoImage from "../assets/encyclopedia-punkorum-logo.png";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import {
  DEFAULT_CATEGORY,
  GOOGLE,
  SEARCH_CATEGORIES,
  isSearchCategory,
} from "../searchCategories";

function Navbar() {
  const navigate = useNavigate();

  // Must match an <option value>, otherwise the controlled <select> has no matching option
  const [selectSearch, setSelectSearch] = useState<string>(DEFAULT_CATEGORY);
  const [term, setTerm] = useState("");

  // The placeholder used to print the raw key — "Select the bands", "Select the
  // labels" — instead of the label shown in the dropdown.
  const placeholderFor = (value: string) => {
    if (value === GOOGLE) return "Search Google for a punk band";
    return "Search by " + (isSearchCategory(value) ? SEARCH_CATEGORIES[value].label : "name");
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectSearch(event.target.value);
  };

  // preventDefault stops the browser from reloading the whole app; the router
  // takes it from there. An empty term goes nowhere: /search?q= searches nothing.
  //
  // The chosen category travels with the term. It used to be dropped here, so
  // every option searched band names and the dropdown was decoration.
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;

    // Google is not one of our categories: it leaves the site, in a new tab so
    // the encyclopedia stays where it was.
    if (selectSearch === GOOGLE) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(`${query} punk band`)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}&in=${selectSearch}`);
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
              placeholder={placeholderFor(selectSearch)}
            />
            {/* "Songs Title" is gone: we hold no songs, and an option that can
                only ever return nothing is the same lie in another place. */}
            <select value={selectSearch} onChange={handleSelect} aria-label="Search category">
              {Object.entries(SEARCH_CATEGORIES).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
              <option value={GOOGLE}>Google</option>
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
