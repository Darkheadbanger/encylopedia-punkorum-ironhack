import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/RandomInfo.css";

function UpdateBandForm() {
    const navigate = useNavigate();
    const bandId = useParams()

    const band = bandId.find((band) => band.id === bandId)

  return (
    <>
      <div className="add-band-container">
        <h2>Add New Band to Encyclopedia Punkorum</h2>

        <form className="add-band-form">
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
              Create Band
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/bands")}
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
