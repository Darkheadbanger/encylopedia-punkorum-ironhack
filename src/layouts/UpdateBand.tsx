import type { Band, SetBands } from "../types";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import "../styles/BandForm.css";
import UpdateBandForm from "../components/UpdateBandForm";

function UpdateBand({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
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
