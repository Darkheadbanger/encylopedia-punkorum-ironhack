import { useEffect, useState } from "react";
import type { Band } from "./types";
import Routers from "./Routers"
import { getAllBands } from "./services/api";
import { AuthProvider } from "./context/AuthContext";

// How long the wait may run before it stops looking like a frozen page.
//
// The API sleeps on Render's free plan and takes about a minute to wake up, and
// the whole site waits behind that one request. Measured at 59 s before the
// first useful pixel on a cold visit — long enough that someone opening the link
// concludes it is broken and closes the tab. Nothing here makes the server
// faster; what it does is stop the silence, and say what is happening.
const SLOW_AFTER_MS = 4000;
const VERY_SLOW_AFTER_MS = 15000;

function App() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** 0 while it is quick, then 1 and 2 as the wait drags on. */
  const [patience, setPatience] = useState(0);

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
        setError("Could not load the bands. Is the server running?");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) return;

    const timers = [
      setTimeout(() => setPatience(1), SLOW_AFTER_MS),
      setTimeout(() => setPatience(2), VERY_SLOW_AFTER_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading Encyclopedia Punkorum...</p>
        {patience >= 1 && (
          <p className="app-loading-note">
            The server is waking up. It sleeps when nobody is reading.
          </p>
        )}
        {patience >= 2 && (
          <p className="app-loading-note">
            This can take up to a minute on the first visit. It is worth the wait.
          </p>
        )}
      </div>
    );
  }

  return (
    <AuthProvider>
      {error && <p className="app-error" role="alert">{error}</p>}
      <Routers bands={bands} setBands={setBands}/>
    </AuthProvider>
  );
}

export default App;
