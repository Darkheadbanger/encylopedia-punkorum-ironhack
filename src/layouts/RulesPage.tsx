import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";

function RulesPage() {
  return (
    <StaticPage title="Rules">
      <p className="static-intro">
        An encyclopedia is only as good as its entries. These rules are strict on
        purpose: a database that accepts everything documents nothing.
      </p>

      <section>
        <h3>1. The only criterion</h3>
        <p className="static-highlight">
          The music must <strong>be</strong> punk or hardcore. Not be labelled punk —
          be punk.
        </p>
        <p>
          A genre tag, a record label, a scene, a festival line-up, a haircut or a
          Wikipedia infobox proves nothing. <strong>The releases decide.</strong> A band
          everyone calls punk but whose records are pop-rock with distorted guitars does
          not belong here. A band nobody calls punk but whose records are hardcore does.
        </p>
        <p>
          There is no list of genres that are accepted automatically. Every entry is
          judged on what it actually sounds like.
        </p>
      </section>

      <section>
        <h3>2. The scope</h3>
        <p>
          From the <strong>1977 first wave</strong> to every descendant it produced, all
          the way to the extreme end — including grindcore, powerviolence, metalcore,
          deathcore and beatdown — <strong>as long as the music leans core, not metal</strong>.
        </p>
        <p>
          Punk rock, hardcore punk, oi! and street punk, crust, d-beat, anarcho-punk,
          post-punk, garage punk, skate punk, ska punk, folk punk, screamo, emo,
          powerviolence, crossover thrash, mathcore, beatdown hardcore, post-hardcore,
          grindcore, metalcore, deathcore. Each of these is a <em>family</em>, not a
          free pass: rule 1 still applies to every single entry.
        </p>
      </section>

      <section>
        <h3>3. The one-release test</h3>
        <p>
          The further a band sits from 1977, the more the question matters. So the test
          is simple and it applies to everyone:
        </p>
        <p className="static-highlight">
          The band must have at least <strong>one full-length or one EP</strong> whose
          music leans closer to <strong>hardcore or punk</strong> than to metal.
        </p>
        <p>
          <strong>Pushes a band in:</strong> breakdowns, two-step and d-beat rhythms,
          shouted vocals, short songs, riffs built on rhythm rather than melody, a
          lineage running back to a hardcore or punk scene.
        </p>
        <p>
          <strong>Pushes a band out:</strong> sweep-picked and harmonised solos, blast
          beats used as melodic death metal, verse-chorus songwriting built on melody,
          and no hardcore lineage anywhere in the band's history.
        </p>
        <dl className="static-list">
          <dt>✅ Napalm Death</dt>
          <dd>Grindcore, but born out of the Birmingham crust and anarcho-punk scene. In.</dd>
          <dt>✅ Emmure</dt>
          <dd>Deathcore written on beatdown hardcore rhythms. In.</dd>
          <dt>❌ Carnifex</dt>
          <dd>Deathcore with no hardcore lineage — the writing is melodic death metal. Out.</dd>
          <dt>✅ Converge</dt>
          <dd>Mathcore that never left hardcore. In.</dd>
          <dt>✅ Integrity</dt>
          <dd>Metalcore, straight out of the Cleveland hardcore scene. In.</dd>
          <dt>❌ Cannibal Corpse</dt>
          <dd>Death metal. Not one punk or hardcore release. Out.</dd>
        </dl>
        <p>
          Borderline case? Name the release that justifies the entry in the{" "}
          <strong>History</strong> field. An entry that argues its own case is never
          deleted by mistake.
        </p>
      </section>

      <section>
        <h3>4. Rejected — including when the band is called punk</h3>
        <ul className="static-list">
          <li>Pop-rock and rock bands sold as punk. Distorted guitars are not a genre.</li>
          <li>Metal bands with a punk look but metal songwriting — rule 3 decides, not the merch.</li>
          <li>Bands whose only punk connection is a label, a tour or a scene.</li>
          <li>Bands with no release at all. A rehearsal room is not a discography.</li>
          <li>Joke entries, insults, and bands invented to test the form.</li>
          <li>Duplicates. Search first — use <strong>Disambiguation</strong> when two bands genuinely share a name.</li>
        </ul>
      </section>

      <section>
        <h3>5. How to fill an entry</h3>
        <dl className="static-list">
          <dt>Name</dt>
          <dd>The band's own spelling. No record label, no "The" unless the band uses it.</dd>
          <dt>Country</dt>
          <dd>Where the band formed, not where its members live now.</dd>
          <dt>Years</dt>
          <dd>Four digits. Leave "disbanded" empty for an active band.</dd>
          <dt>Genres</dt>
          <dd>Separated by commas, lowercase, most specific first: <em>hardcore punk, crust</em>. Describe what the records sound like, not how the band is marketed.</dd>
          <dt>Release type</dt>
          <dd>Pick the real type. A 3-track tape is a Demo, not a Full-length.</dd>
          <dt>History</dt>
          <dd>Facts, in your own words. Copying a Wikipedia article is not contributing.</dd>
        </dl>
      </section>

      <section>
        <h3>6. Editing someone else's entry</h3>
        <p>
          Correcting a date, a spelling or a missing release is welcome. Rewriting a
          history you disagree with is not — add the missing facts instead of deleting
          the existing ones.
        </p>
      </section>

      <section>
        <h3>7. Deleting</h3>
        <p>
          Delete only duplicates and entries that break rule 4. Deletion is permanent and
          there is no undo, so check twice before confirming.
        </p>
      </section>

      <p className="static-note">
        Ready? <Link to="/addBand">Submit a band</Link> — or read the{" "}
        <Link to="/help">Help</Link> page first.
      </p>
    </StaticPage>
  );
}

export default RulesPage;
