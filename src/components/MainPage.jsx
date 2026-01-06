import React from "react";
import "../styles/RandomInfo.css";

function MainPage() {
  // const [count, setCount] = useState(0)
  //  const [selectSearch, setSelectSearch] = useState("Bands");
  return (
    <aside className="randominfos-container">
      <div className="randominfos-info">
        <h3>Bands</h3>
        {/* Links */}
        <p>Alphabetical</p>
        <p>Country</p>
        <p>Genre</p>
        <h3>Labels</h3>
        {/* links */}
        <p>Alphabetical</p>
        <p>Country</p>
        <h3>Reviews</h3>

        <p>Random bands</p>
      </div>
    </aside>
  );
}

export default MainPage;
