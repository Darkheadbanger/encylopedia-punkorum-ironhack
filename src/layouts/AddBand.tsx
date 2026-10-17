import type { SetBands } from "../types";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import "../styles/BandForm.css";
import AddBandForm from "../components/AddBandForm";

function AddBand({setBands}: { setBands: SetBands }) {
  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
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
