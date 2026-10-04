import { useEffect, useState } from "react";
import type { Band } from "./types";
import Routers from "./Routers"
import { getAllBands } from "./services/api";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBands()
      .then((allBands) => {
        setBands(allBands);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading bands:', error);
        // There is one source now, so a failure here means an empty site: say so
        // instead of showing nothing with no explanation.
        setError("Could not load the bands. Is the local server running?");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="app-loading">Loading Encyclopedia Punkorum...</div>;
  }

  return (
    <AuthProvider>
      {error && <p className="app-error" role="alert">{error}</p>}
      <Routers bands={bands} setBands={setBands}/>
    </AuthProvider>
  );
}

export default App;
