import { useEffect, useState } from "react";
import "../styles/bandsId.css"
import { useParams, Link } from "react-router-dom";
import misfitsImage from "../assets/misfits.jpg";
import axios from "axios";


function BandsId({bands}) {
  const {bandsId} = useParams();
  
  const band = bands.find(band => band.id === bandsId);

  const [bandsDetails, setBandsDetails] = useState(null);
  

  useEffect(() => {
    if (!band) return;
    
    const detailsUrl = `https://musicbrainz.org/ws/2/artist/${band.id}?inc=release-groups+artist-rels&fmt=json`;
    
    const timer = setTimeout(() => {
        axios.get(detailsUrl)
          .then(res => {
            setBandsDetails(res.data);
            console.log('Discographie:', res.data['release-groups']);
            console.log('Membres:', res.data.relations);
        }).catch((error) => {
            console.error(error);
        })
    }, 1000);

    return () => clearTimeout(timer);
  }, [band.id ? band.id : null]);

  
  // Si le groupe n'existe pas
  if (!band) {
    return <p>Groupe non trouvé</p>;
  }

  // Filtrer les membres (type: "member of band")
  const members = bandsDetails?.relations?.filter(
    rel => rel.type === "member of band"
  ) || [];

  // Filtrer les albums principaux (pas les compilations/live)
  const albums = bandsDetails?.['release-groups']?.filter(
    rg => rg['primary-type'] === "Album" && rg['secondary-types']?.length === 0
  ) || [];

  return (
    <>
      <div className="bands-info-container">
        <h2><span>{band.name}</span></h2>
        <div className="band-info">
            <ul className="band-info-list">
                <li><span>Country of origins : </span>{band.country || "N/A"}</li>
                <li><span>Location : </span>{band["begin-area"]?.name || "N/A"}</li>
                <li><span>Status : </span>{band["life-span"]?.ended ? "Disbanded" : "Active"}</li>
                <li><span>Formed in : </span>{band["life-span"]?.begin || "N/A"}</li>
                <li><span>Years active : </span>{band["life-span"]?.begin} - {band["life-span"]?.ended || "Present"}</li>
            </ul>
            <ul className="band-info-list">
                <li><span>Genre : </span>{band.tags?.map(tag => tag.name).join(", ") || "N/A"}</li>
                <li><span>Type : </span>{band.type || "N/A"}</li>
                <li><span>Disambiguation : </span>{band.disambiguation || "N/A"}</li>
            </ul>
        </div>
        <div className="bands-photos-container">
            {band.name === "Misfits" ? 
              <img src={misfitsImage} alt="Misfits punk band" className="bands-photos"/> : 
              <p>Photos coming soon</p>
            }
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
              {bandsDetails ? (
                <ul>
                  {albums.map(album => (
                    <li key={album.id}>
                      <strong>{album.title}</strong> ({album['first-release-date']?.slice(0, 4) || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading discography...</p>
              )}
            </td>
            <td>
              {bandsDetails ? (
                <ul>
                  {members.map((member, index) => (
                    <li key={index}>
                      <strong>{member.artist.name}</strong>
                      {member.begin && ` (${member.begin} - ${member.end || 'Present'})`}
                      {member.attributes?.length > 0 && ` - ${member.attributes.join(', ')}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading members...</p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default BandsId;