import { useEffect, useState } from "react";
import "../styles/bandsId.css"
import { useParams, Link } from "react-router-dom";
import misfitsImage from "../assets/misfits.jpg";
import { musicBrainzAPI } from "../services/api";


function BandsId({bands}) {
  const {bandsId} = useParams();
  
  const band = bands.find(band => band.id === bandsId);

  const [bandsDetails, setBandsDetails] = useState(null);
  const [loading, setLoading] = useState(band?.source !== 'local');

  useEffect(() => {
    // Si le groupe n'existe pas ou si c'est local, ne rien faire
    if (!band || band.source === 'local') return;
    
    // Si c'est MusicBrainz, faire la requête API
    const timer = setTimeout(() => {
      musicBrainzAPI.getBandDetails(band.id)
        .then((res) => {
          setBandsDetails({
            ...res.data,
            isLocal: false
          });
          setLoading(false);
        }).catch((error) => {
          console.error(error);
          setLoading(false);
        })
    }, 1000);

    return () => clearTimeout(timer);
  }, [band]);
  
  // Si le groupe n'existe pas
  if (!band) {
    return <p>Groupe non trouvé</p>;
  }

  // Préparer les données selon la source
  let members = [];
  let albums = [];

  if (band?.source === 'local') {
    // Structure locale
    members = band.members || [];
    albums = band.albums || [];
  } else {
    // Structure MusicBrainz
    members = bandsDetails?.relations?.filter(
      member => member.type === "member of band"
    ) || [];
    
    albums = bandsDetails?.['release-groups']?.filter(
      releasse => releasse['primary-type'] === "Album" && releasse['secondary-types']?.length === 0
    ) || [];
  }

  return (
    <>
      <div className="bands-info-container">
        <h2>
          <span>{band.name}</span>
          {band.editable && (
            <Link to={`/bands/edit/${band.id}`} style={{marginLeft: '10px', fontSize: '0.8em'}}>
              ✏️ Edit
            </Link>
          )}
        </h2>
        <div className="band-info">
            <ul className="band-info-list">
                <li><span>Country of origins : </span>{band.country || "N/A"}</li>
                <li><span>Location : </span>
                  {band.source === 'local' 
                    ? (band.location || "N/A")
                    : (band["begin-area"]?.name || "N/A")
                  }
                </li>
                <li><span>Status : </span>
                  {band.source === 'local'
                    ? (band.status || "N/A")
                    : (band["life-span"]?.ended ? "Disbanded" : "Active")
                  }
                </li>
                <li><span>Formed in : </span>
                  {band.source === 'local'
                    ? (band.formed || "N/A")
                    : (band["life-span"]?.begin || "N/A")
                  }
                </li>
                <li><span>Years active : </span>
                  {band.source === 'local'
                    ? `${band.formed || "?"} - ${band.disbanded || "Present"}`
                    : `${band["life-span"]?.begin || "?"} - ${band["life-span"]?.end || "Present"}`
                  }
                </li>
            </ul>
            <ul className="band-info-list">
                <li><span>Genre : </span>
                  {band.source === 'local'
                    ? (Array.isArray(band.genre) ? band.genre.join(", ") : band.genre || "N/A")
                    : (band.tags?.map(tag => tag.name).join(", ") || "N/A")
                  }
                </li>
                <li><span>Type : </span>{band.type || "Group"}</li>
                <li><span>Disambiguation : </span>{band.disambiguation || "N/A"}</li>
            </ul>
        </div>
        <div className="bands-photos-container">
            {band.name === "Misfits" ? (
              <img src={misfitsImage} alt="Misfits punk band" className="bands-photos"/>
            ) : band.source === 'local' && band.image ? (
              <img src={band.image} alt={`${band.name} punk band`} className="bands-photos"/>
            ) : (
              <p>Photos coming soon</p>
            )}
        </div>
      </div>

      <table className="band-details-table">
        <thead>
          <tr>
            <th>Main Discography</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {loading ? (
                <p>Loading discography...</p>
              ) : albums.length > 0 ? (
                <ul>
                  {albums.map((album, index) => {
                    // Structure locale vs MusicBrainz
                    if (band?.source === 'local') {
                      return (
                        <li key={index}>
                          <strong>{album.title}</strong> ({album.year || 'N/A'})
                          {album.type && ` - ${album.type}`}
                        </li>
                      );
                    } else {
                      return (
                        <li key={album.id || index}>
                          <strong>{album.title}</strong> ({album['first-release-date']?.slice(0, 4) || 'N/A'})
                        </li>
                      );
                    }
                  })}
                </ul>
              ) : (
                <p>No albums available</p>
              )}
            </td>
            <td>
              {loading ? (
                <p>Loading members...</p>
              ) : members.length > 0 ? (
                <ul>
                  {members.map((member, index) => {
                    // Structure locale vs MusicBrainz
                    if (band?.source === 'local') {
                      return (
                        <li key={index}>
                          <strong>{member.name}</strong>
                          {member.period && ` (${member.period})`}
                          {member.instrument && ` - ${member.instrument}`}
                        </li>
                      );
                    } else {
                      return (
                        <li key={index}>
                          <strong>{member.artist?.name || 'Unknown'}</strong>
                          {member.begin && ` (${member.begin} - ${member.end || 'Present'})`}
                          {member.attributes?.length > 0 && ` - ${member.attributes.join(', ')}`}
                        </li>
                      );
                    }
                  })}
                </ul>
              ) : (
                <p>No members information</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default BandsId;