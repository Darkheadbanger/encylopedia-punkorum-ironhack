import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Page Not Found</h2>
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={styles.link}>
        Go Back Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: '8rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
  },
  subtitle: {
    fontSize: '2rem',
    color: '#666',
    marginTop: '10px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.2rem',
    color: '#888',
    marginBottom: '30px',
  },
  link: {
    padding: '12px 30px',
    backgroundColor: '#333',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
  },
};

export default ErrorPage;
