import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";

function HelpPage() {
  return (
    <StaticPage title="Help">
      <p className="static-intro">
        Everything you need to know to browse and contribute to Encyclopedia Punkorum.
      </p>

      <section>
        <h3>Where do the bands come from?</h3>
        <p>
          The encyclopedia mixes two sources. Bands added by the community are stored in
          our own database and can be edited or deleted. The rest come from{" "}
          <strong>MusicBrainz</strong>, an open music database — those are read-only, so
          they show no edit or delete button.
        </p>
      </section>

      <section>
        <h3>How do I add a band?</h3>
        <p>
          Use <Link to="/addBand">Submit new band</Link> in the top menu. Only the band
          name is required, but an entry with a country, a formation year and a
          discography is far more useful to everyone. Read the{" "}
          <Link to="/rules">Rules</Link> before submitting.
        </p>
      </section>

      <section>
        <h3>Why can't I edit some bands?</h3>
        <p>
          Bands imported from MusicBrainz belong to their project, not ours. To correct
          one of them, edit it on MusicBrainz — the change will appear here on the next
          load.
        </p>
      </section>

      <section>
        <h3>What do the discography categories mean?</h3>
        <dl className="static-list">
          <dt>Main</dt>
          <dd>Full-length albums and EPs — the core of a band's work.</dd>
          <dt>Lives</dt>
          <dd>Live albums and bootlegs.</dd>
          <dt>Demos</dt>
          <dd>Early recordings, usually self-released on tape.</dd>
          <dt>Misc</dt>
          <dd>Singles, compilations, splits, videos and boxed sets.</dd>
        </dl>
      </section>

      <section>
        <h3>A band is missing or wrong. What now?</h3>
        <p>
          Add it yourself, or fix the existing entry with the ✏️ button in the band list.
          Every change is immediate — there is no moderation queue yet.
        </p>
      </section>

      <section>
        <h3>Still stuck?</h3>
        <p>
          The <Link to="/forum">Forum</Link> is where questions will be answered once it
          opens. Until then, the <Link to="/rules">Rules</Link> page covers most cases.
        </p>
      </section>
    </StaticPage>
  );
}

export default HelpPage;
