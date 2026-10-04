import { useState } from "react";
import type { Band } from "../types";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import BandsList from "../components/BandsList";
import "../styles/BandsPage.css"

// The four columns, and what each one sorts on. Encyclopaedia Metallum sorts its
// band lists the same way: one click to sort, a second to reverse.
const COLUMNS = [
  { label: "Bands", value: (band: Band) => band.name },
  { label: "Country", value: (band: Band) => band.country },
  { label: "Genre", value: (band: Band) => band.genre[0] ?? "" },
  { label: "Status", value: (band: Band) => band.status },
] as const;

type ColumnLabel = (typeof COLUMNS)[number]["label"];

function BandsPage({bands}: { bands: Band[] }) {
  // No column sorted at first: the API order is newest first, which is useful too.
  const [sortBy, setSortBy] = useState<ColumnLabel | null>(null);
  const [ascending, setAscending] = useState(true);

  const handleSort = (label: ColumnLabel) => {
    if (label === sortBy) {
      setAscending(!ascending);
      return;
    }
    setSortBy(label);
    setAscending(true);
  };

  const column = COLUMNS.find((candidate) => candidate.label === sortBy);
  // [...bands] because sort() works in place, and these are the parent's bands.
  const shownBands = column
    ? [...bands].sort((one, other) => {
        const comparison = column.value(one).localeCompare(column.value(other), undefined, {
          sensitivity: "base", // "the Damned" sorts with the D's, not after Z
        });
        return ascending ? comparison : -comparison;
      })
    : bands;

  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="bands-list-page">
          <p className="bands-count">
            There are currently {bands.length} bands in Encyclopaedia Punkorum.
          </p>
          <table className="bands-table">
            <thead>
              <tr className="band-list-container">
                {COLUMNS.map(({ label }) => (
                  <th
                    key={label}
                    scope="col"
                    className="band-head-list"
                    // Without aria-sort, a screen reader cannot tell the table is sorted
                    aria-sort={
                      label !== sortBy ? "none" : ascending ? "ascending" : "descending"
                    }
                  >
                    <button type="button" className="sort-btn" onClick={() => handleSort(label)}>
                      {label}
                      <span aria-hidden="true" className="sort-arrow">
                        {label !== sortBy ? "↕" : ascending ? "↑" : "↓"}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shownBands.map((band) => <BandsList key={band.id} band={band} />)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default BandsPage;
