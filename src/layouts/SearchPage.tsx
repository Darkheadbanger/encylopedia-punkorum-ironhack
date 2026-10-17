import type { Band, SetBands } from "../types";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import SearchResults from "../components/SearchResults";

function SearchPage({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <div className="header-login-panel">
      <div className="aside-container">
        <LoginPanel />
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
