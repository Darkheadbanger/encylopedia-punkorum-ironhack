import { Link } from 'react-router-dom';
import "../styles/ErrorPage.css";

function ErrorPage() {
  return (
    <div className="error-page">
      <h1 className="error-page-title">404</h1>
      <h2 className="error-page-subtitle">Page Not Found</h2>
      <p className="error-page-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="error-page-link">
        Go Back Home
      </Link>
    </div>
  );
}

export default ErrorPage;
