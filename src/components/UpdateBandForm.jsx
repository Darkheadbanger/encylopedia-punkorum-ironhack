import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { localBandsAPI } from "../services/api";
import "../styles/AddBandForm.css";

function UpdateBandForm({ bands, setBands }) {
  const navigate = useNavigate();
  const { updateId } = useParams();
  
  const band = bands.find((band) => band.id === updateId);

  const [formData, setFormData] = useState(() => {
    if (band && band.source === 'local') {
      return {
        name: band.name || "",
        country: band.country || "",
        location: band.location || "",
        status: band.status || "Active",
        formed: band.formed || "",
        disbanded: band.disbanded || "",
        genre: Array.isArray(band.genre) ? band.genre.join(", ") : "",
        type: band.type || "Group",
        disambiguation: band.disambiguation || ""
      };
    }else{
        return {
        name: "",
        country: "",
        location: "",
        status: "Active",
        formed: "",
        disbanded: "",
        genre: "",
        type: "Group",
        disambiguation: ""
        };
    }
  });

  const [albums, setAlbums] = useState(() => {
    if (band && band.source === 'local') {
      return band.albums;
    }
    return []
  });

  const [members, setMembers] = useState(() => {
    if (band && band.source === 'local') {
      return band.members;
    }
    return []
  });

  if (!band) {
    return <p>Band not found</p>;
  }

  if (band.source !== 'local') {
    return (
      <div className="addband-container">
        <h2>Cannot Edit MusicBrainz Bands</h2>
        <p>This band is from MusicBrainz and cannot be edited.</p>
        <button onClick={() => navigate("/bands")} className="cancel-btn">
          Back to Bands
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const albumChange = (indexAlbums, categoryName, value) => {
    const newAlbums = [...albums];
    newAlbums[indexAlbums][categoryName] = value;
    setAlbums(newAlbums);
  };

  const memberChange = (indexMember, categoryName, value) => {
    const newMembers = [...members];
    newMembers[indexMember][categoryName] = value;
    setMembers(newMembers);
  };

  const albumEmpty = { title: "", year: "", type: "Album" };
  const addAlbum = () => {
    setAlbums([...albums, albumEmpty]);
  };

  const removeAlbum = (indexToRemove) => {
    setAlbums(albums.filter((album, i) => i !== indexToRemove));
  };

  const memberEmpty = { name: "", instrument: "", period: "" };
  const addMember = () => {
    setMembers([...members, memberEmpty]);
  };

  const removeMember = (indexToRemove) => {
    setMembers(members.filter((member, i) => i !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("You must enter the band name!");
      return;
    }

    const bandToUpdate = {
      ...band,
      ...formData,
      genre: formData.genre.split(",").map(genreStyle => genreStyle).filter(genreStyle => genreStyle),
      disbanded: formData.disbanded || null,
      albums: albums.filter(album => album.title),
      members: members.filter(member => member.name)
    };

    localBandsAPI.update(band.id, bandToUpdate)
      .then(() => {
        setBands(existedBands => existedBands.map(thisBand => thisBand.id === band.id ? bandToUpdate : thisBand));
        alert(`${bandToUpdate.name} has been updated!`);
        navigate(`/bands/${band.id}`);
      })
      .catch((error) => {
        console.error(error);
        alert("There is something wrong when you updated the band. Try again!");
      });
  };

  return (
    <>
      <div className="addband-container">
        <h2>Edit Band: {band.name}</h2>

        <form onSubmit={handleSubmit} className="addband-forms">
          {/* Basic Info */}
          <section className="info-section">
            <h3>Basic Information</h3>

            <div className="input-group">
              <label htmlFor="name">Band Name *</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Sex Pistols"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="GB, US, FR..."
                />
              </div>

              <div className="input-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="London, New York..."
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="formed">Year Formed</label>
                <input
                  type="text"
                  name="formed"
                  id="formed"
                  value={formData.formed}
                  onChange={handleChange}
                  placeholder="1975"
                />
              </div>

              <div className="input-group">
                <label htmlFor="disbanded">Year Disbanded (if the band dosen't active anymore)</label>
                <input
                  type="text"
                  name="disbanded"
                  id="disbanded"
                  value={formData.disbanded}
                  onChange={handleChange}
                  placeholder="1978"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Split-up">Split-up</option>
                <option value="On hiatus">On hiatus</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="genre">Genres (always use comma to separate)</label>
              <input
                type="text"
                name="genre"
                id="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="punk rock, proto-punk, hardcore"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="type">Type</label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Group">Group</option>
                  <option value="Person">Person</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="disambiguation">Disambiguation</label>
                <input
                  type="text"
                  name="disambiguation"
                  id="disambiguation"
                  value={formData.disambiguation}
                  onChange={handleChange}
                  placeholder="English punk rock band"
                />
              </div>
            </div>
          </section>

          {/* Albums */}
          <section className="info-section">
            <h3>Main Discography</h3>
            {albums.map((album, index) => (
              <div key={index} className="list-item">
                <div className="input-row">
                  <div className="input-group bigger-input">
                    <input
                      type="text"
                      placeholder="Album title"
                      value={album.title}
                      onChange={(e) =>
                        albumChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Year"
                      value={album.year}
                      onChange={(e) =>
                        albumChange(index, "year", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <select
                      value={album.type}
                      onChange={(e) =>
                        albumChange(index, "type", e.target.value)
                      }
                    >
                      <option value="Album">Album</option>
                      <option value="EP">EP</option>
                      <option value="Single">Single</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeAlbum(index)}
                    disabled={albums.length === 1}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="addmore-btn" onClick={addAlbum}>
              + Add Album
            </button>
          </section>

          {/* Members */}
          <section className="info-section">
            <h3>Members</h3>
            {members.map((member, index) => (
              <div key={index} className="list-item">
                <div className="input-row">
                  <div className="input-group bigger-input">
                    <input
                      type="text"
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) =>
                        memberChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Instrument"
                      value={member.instrument}
                      onChange={(e) =>
                        memberChange(index, "instrument", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Period (e.g. 1975-1978)"
                      value={member.period}
                      onChange={(e) =>
                        memberChange(index, "period", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeMember(index)}
                    disabled={members.length === 1}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="addmore-btn" onClick={addMember}>
              + Add Member
            </button>
          </section>

          {/* Submit Buttons */}
          <div className="buttons-container">
            <button type="submit" className="create-btn">
              Update Band
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/bands/${band.id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateBandForm;
