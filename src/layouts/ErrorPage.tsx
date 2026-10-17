import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
// Imported under another name: calling it <ErrorPage /> here would render this layout itself, forever
import NotFound from "../components/ErrorPage";

function ErrorPage() {
  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <NotFound />
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
