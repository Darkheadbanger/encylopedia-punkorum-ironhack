import React, { useState } from "react"

function Navbar() {
  // const [count, setCount] = useState(0)
  const [selectSearch, setSelectSearch] = useState("Bands");
  const handleSelect = (event) => {
    const searchValues = event.target.value;
    setSelectSearch(searchValues);

    console.log("searchValues", event.target.value)
  }
  return (
    <div className="navbar-container">
        <div className="punkArchive-logo">
            <img src="./assets/encyclopedia-punkorum-logo.png" alt="Encyclopedia Punkorum logo"/>
        </div>
        <form>
            <label>Search:</label>
            <div className="formsSearch-container">
                <input type="text" name="search" id="search" />
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
    </div>
  )
}

export default Navbar
