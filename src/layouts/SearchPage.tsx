import type { Band, SetBands } from "../types";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import SearchResults from "../components/SearchResults";

function SearchPage({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <div className="header-connexion">
      <div className="aside-container">
        <Connexion />
        <RandomInfos />
      </div>
      <Navbar />
      <div className="main-page">
        <SearchResults bands={bands} setBands={setBands} />
      </div>
    </div>
  );
}

export default SearchPage;
