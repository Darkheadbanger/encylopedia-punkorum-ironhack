import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import ReviewsList from "../components/ReviewsList";
import type { Band } from "../types";

function ReviewsPage({ bands }: { bands: Band[] }) {
  return (
    <div className="header-login-panel">
      <div className="aside-container">
        <LoginPanel />
        <RandomInfos />
      </div>
      <Navbar />
      <div className="genres-page">
        <h2>Reviews</h2>
        <ReviewsList bands={bands} />
      </div>
    </div>
  );
}

export default ReviewsPage;
