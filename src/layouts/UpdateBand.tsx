import type { Band, SetBands } from "../types";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import "../styles/BandForm.css";
import UpdateBandForm from "../components/UpdateBandForm";

function UpdateBand({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="update-page">
          <UpdateBandForm bands={bands} setBands={setBands}/>
        </div>
      </div>
    </>
  );
}

export default UpdateBand;
