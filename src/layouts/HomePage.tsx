import type { Band } from "../types";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import MainPage from "../components/MainPage";

function HomePage({bands}: { bands: Band[] }) {
  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <MainPage bands={bands}/>
        </div>
      </div>
    </>
  );
}

export default HomePage;
