import { Link } from "react-router-dom";

/** Placeholder for a page that is planned but not built yet. */
function ComingSoon({ what }: { what: string }) {
  return (
    <div className="coming-soon">
      <p className="coming-soon-badge">Coming soon</p>
      <p>
        The {what} is not available yet — this feature is still being built.
      </p>
      <p>
        In the meantime, browse the <Link to="/bands">bands</Link> or{" "}
        <Link to="/addBand">add one</Link>.
      </p>
    </div>
  );
}

export default ComingSoon;
