import type { Band } from "../types";
import "../styles/BandsList.css";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import BandsId from "../components/BandsId";

function BandsIdPage({bands}: { bands: Band[] }) {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
           <BandsId bands={bands}></BandsId>
        </div>
      </div>
    </>
  );
}

export default BandsIdPage;
