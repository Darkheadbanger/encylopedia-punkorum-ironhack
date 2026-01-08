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

   // For security, edit button only exist on local API but can be put manually on the url for musicBrainz API
  if (band.source !== 'local') {
    return (
      <div className="add-band-container">
        <h2>Cannot Edit MusicBrainz Bands</h2>
        <p>This band is from MusicBrainz and cannot be edited.</p>
        <button onClick={() => navigate("/bands")} className="btn-cancel">
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

  const handleAlbumChange = (index, field, value) => {
    const newAlbums = [...albums];
    newAlbums[index][field] = value;
    setAlbums(newAlbums);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addAlbum = () => {
    setAlbums([...albums, { title: "", year: "", type: "Album" }]);
  };

  const removeAlbum = (index) => {
    setAlbums(albums.filter((_, i) => i !== index));
  };

  const addMember = () => {
    setMembers([...members, { name: "", instrument: "", period: "" }]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Band name is required!");
      return;
    }

    const updatedBand = {
      ...band,
      ...formData,
      genre: formData.genre.split(",").map(genreStyle => genreStyle.trim()).filter(genreStyle => genreStyle),
      disbanded: formData.disbanded || null,
      albums: albums.filter(album => album.title.trim()),
      members: members.filter(member => member.name.trim())
    };

    localBandsAPI.update(band.id, updatedBand)
      .then(() => {
        // Update bands list
        setBands(previousBands => previousBands.map(thisBand => thisBand.id === band.id ? updatedBand : thisBand));
        alert(`${updatedBand.name} has been updated!`);
        navigate(`/bands/${band.id}`);
      })
      .catch(error => {
        console.error("Error updating band:", error);
        alert("Error updating band. Please try again.");
      });
  };

  return (
    <>
      <div className="add-band-container">
        <h2>Edit Band: {band.name}</h2>

        <form onSubmit={handleSubmit} className="add-band-form">
          {/* Basic Info */}
          <section className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country of Origin</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="GB, US, FR..."
                />
              </div>

              <div className="form-group">
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

            <div className="form-row">
              <div className="form-group">
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

              <div className="form-group">
                <label htmlFor="disbanded">
                  Year Disbanded (if applicable)
                </label>
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

            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="genre">Genres (comma separated)</label>
              <input
                type="text"
                name="genre"
                id="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="punk rock, proto-punk, hardcore"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
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

              <div className="form-group">
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
          <section className="form-section">
            <h3>Main Discography</h3>
            {albums.map((album, index) => (
              <div key={index} className="dynamic-item">
                <div className="form-row">
                  <div className="form-group flex-2">
                    <input
                      type="text"
                      placeholder="Album title"
                      value={album.title}
                      onChange={(e) =>
                        handleAlbumChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Year"
                      value={album.year}
                      onChange={(e) =>
                        handleAlbumChange(index, "year", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={album.type}
                      onChange={(e) =>
                        handleAlbumChange(index, "type", e.target.value)
                      }
                    >
                      <option value="Album">Album</option>
                      <option value="EP">EP</option>
                      <option value="Single">Single</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeAlbum(index)}
                    disabled={albums.length === 1}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addAlbum}>
              + Add Album
            </button>
          </section>

          {/* Members */}
          <section className="form-section">
            <h3>Members</h3>
            {members.map((member, index) => (
              <div key={index} className="dynamic-item">
                <div className="form-row">
                  <div className="form-group flex-2">
                    <input
                      type="text"
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Instrument"
                      value={member.instrument}
                      onChange={(e) =>
                        handleMemberChange(index, "instrument", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Period (e.g. 1975-1978)"
                      value={member.period}
                      onChange={(e) =>
                        handleMemberChange(index, "period", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeMember(index)}
                    disabled={members.length === 1}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addMember}>
              + Add Member
            </button>
          </section>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Update Band
            </button>
            <button
              type="button"
              className="btn-cancel"
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
