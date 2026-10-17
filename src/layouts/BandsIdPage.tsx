import type { Band, SetBands } from "../types";
import "../styles/BandsList.css";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import BandsId from "../components/BandsId";

function BandsIdPage({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
           <BandsId bands={bands} setBands={setBands}></BandsId>
        </div>
      </div>
    </>
  );
}

export default BandsIdPage;
