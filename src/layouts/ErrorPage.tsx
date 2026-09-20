import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
// Imported under another name: calling it <ErrorPage /> here would render this layout itself, forever
import NotFound from "../components/ErrorPage";

function ErrorPage() {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
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
