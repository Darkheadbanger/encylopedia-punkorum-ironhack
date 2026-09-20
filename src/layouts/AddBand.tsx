import type { SetBands } from "../types";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import "../styles/BandForm.css";
import AddBandForm from "../components/AddBandForm";

function AddBand({setBands}: { setBands: SetBands }) {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <AddBandForm setBands={setBands}/>
        </div>
      </div>
    </>
  );
}

export default AddBand;
