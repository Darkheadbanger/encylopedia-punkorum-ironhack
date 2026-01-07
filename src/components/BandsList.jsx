import React from "react";
import "../styles/BandsList.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function BandsList({band}) {
  const { bandId } = useParams();
  console.log("band id", bandId)
  const genreMusic = band.tags.map((genre) => genre.name).filter((genre) => genre.match("punk") || genre.match("hardcore") || genre.match("grindcore") || genre.match("emo") || genre.match("powerviolene")).join(" ")
  const status = band["life-span"].ended === null ? "Still Active" : `Split-up`
  const isActiveClass = band["life-span"].ended === null ? "still-active" : "not-active";

  return (
    <>

      <tbody>
          <tr className="band-list-container">
            <Link to={`/bands/${band.id}`} className="bandId">
              <td scope="col" className="band-name">{band.name}</td>
            </Link>
            <td scope="col">{band.country}</td>
            <td scope="col" className="genre">{genreMusic}</td>
            <td scope="col" className={isActiveClass}>{status}</td>
          </tr>
      </tbody>
    </>
  );
}

export default BandsList;
