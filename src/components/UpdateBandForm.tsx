import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { localBandsAPI } from "../services/api";
import { RELEASE_TYPES } from "../types";
import type { Album, Band, BandFormData, LocalBand, Member, SetBands } from "../types";
import "../styles/BandForm.css";

function UpdateBandForm({ bands, setBands }: { bands: Band[]; setBands: SetBands }) {
  const navigate = useNavigate();
  const { updateId } = useParams();
  
  const band = bands.find((band) => band.id === updateId);

  const [formData, setFormData] = useState<BandFormData>(() => {
    if (band && band.source === 'local') {
      return {
        name: band.name || "",
        country: band.country || "",
        location: band.location || "",
        status: band.status || "Active",
        formed: band.formed || "",
        disbanded: band.disbanded || "",
        genre: band.genre.join(", "),
        type: band.type || "Group",
        disambiguation: band.disambiguation || "",
        description: band.description || "",
        themes: band.themes || "",
        label: band.label || ""
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
        disambiguation: "",
        description: "",
        themes: "",
        label: ""
        };
    }
  });

  // `|| []` guards against a local band saved without an albums/members array
  const [albums, setAlbums] = useState<Album[]>(() => {
    if (band && band.source === 'local') {
      return band.albums || [];
    }
    return []
  });

  const [members, setMembers] = useState<Member[]>(() => {
    if (band && band.source === 'local') {
      return band.members || [];
    }
    return []
  });

  const [error, setError] = useState<string | null>(null);

  if (!band) {
    return <p>Band not found</p>;
  }

  if (band.source !== 'local') {
    return (
      <div className="band-form-container">
        <h2>Cannot Edit MusicBrainz Bands</h2>
        <p>This band is from MusicBrainz and cannot be edited.</p>
        <button type="button" onClick={() => navigate("/bands")} className="cancel-btn">
          Back to Bands
        </button>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // [...albums] copies the array but NOT the objects inside it, so writing
  // newAlbums[i][key] = value would edit the very object stored in the `bands`
  // state — and the change would survive "Cancel". map + spread builds a new
  // object for the edited row and leaves every other one untouched.
  const albumChange = (indexAlbums: number, categoryName: keyof Album, value: string) => {
    setAlbums(albums.map((album, i) =>
      i === indexAlbums ? { ...album, [categoryName]: value } : album
    ));
  };

  const memberChange = (indexMember: number, categoryName: keyof Member, value: string) => {
    setMembers(members.map((member, i) =>
      i === indexMember ? { ...member, [categoryName]: value } : member
    ));
  };

  const albumEmpty = { title: "", year: "", type: "Album" };
  const addAlbum = () => {
    setAlbums([...albums, albumEmpty]);
  };

  const removeAlbum = (indexToRemove: number) => {
    setAlbums(albums.filter((_album, i) => i !== indexToRemove));
  };

  const memberEmpty = { name: "", instrument: "", period: "" };
  const addMember = () => {
    setMembers([...members, memberEmpty]);
  };

  const removeMember = (indexToRemove: number) => {
    setMembers(members.filter((_member, i) => i !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name) {
      setError("You must enter the band name!");
      return;
    }
    setError(null);

    const bandToUpdate: Omit<LocalBand, 'id'> = {
      ...band,
      ...formData,
      // trim() removes the space the pre-filled join(", ") adds back on every edit
      genre: formData.genre.split(",").map(genre => genre.trim()).filter(genre => genre),
      disbanded: formData.disbanded || null,
      albums: albums.filter(album => album.title),
      members: members.filter(member => member.name)
    };

    localBandsAPI.update(band.id, bandToUpdate)
      .then((response) => {
        // Use what the server stored, not what we sent
        const savedBand: LocalBand = { ...response.data, source: "local", editable: true };
        setBands((existedBands) =>
          existedBands.map((thisBand) => (thisBand.id === band.id ? savedBand : thisBand)),
        );
        navigate(`/bands/${band.id}`);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not update the band. Is the local server running?");
      });
  };

  return (
    <>
      <div className="band-form-container">
        <h2>Edit Band: {band.name}</h2>

        {error && <p className="form-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="band-form">
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
                <label htmlFor="disbanded">Year Disbanded (if the band is no longer active)</label>
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
                    aria-label="Album title"
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
                    aria-label="Album year"
                      value={album.year}
                      onChange={(e) =>
                        albumChange(index, "year", e.target.value)
                      }
                    />
                  </div>
                  <div className="input-group">
                    <select
                      aria-label="Album type"
                      value={album.type}
                      onChange={(e) =>
                        albumChange(index, "type", e.target.value)
                      }
                    >
                      {RELEASE_TYPES.map((releaseType) => (
                        <option key={releaseType} value={releaseType}>{releaseType}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeAlbum(index)}
                  aria-label="Remove album"
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
                    aria-label="Member name"
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
                    aria-label="Instrument"
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
                    aria-label="Period"
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
                  aria-label="Remove member"
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
            <button type="submit" className="submit-btn">
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
