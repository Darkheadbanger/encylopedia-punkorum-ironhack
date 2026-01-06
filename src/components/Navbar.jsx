import React, { useState } from "react";
import logoImage from "../assets/encyclopedia-punkorum-logo.png";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [selectSearch, setSelectSearch] = useState("Bands");

  const handleSelect = (event) => {
    const searchValues = event.target.value;
    setSelectSearch(searchValues);
    console.log("searchValues", event.target.value);
  };

  return (
    <>
      <div className="punkArchive-logo">
        <Link to="/" ><img src={logoImage} alt="Encyclopedia Punkorum logo" /></Link>
      </div>
      <div className="info-container">
        <form className="search-container">
          <label htmlFor="search">Search:</label>
          <div className="formsSearch-container">
            <input
              type="text"
              name="search"
              id="search"
              placeholder={"Select the " + selectSearch}
            />
            <select value={selectSearch} onChange={handleSelect}>
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
          <p>Help</p>
          <p>Rules</p>
          <p>Store</p>
          <p>Forum</p>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
