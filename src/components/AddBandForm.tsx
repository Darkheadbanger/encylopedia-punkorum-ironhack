import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { localBandsAPI } from "../services/api";
import { RELEASE_TYPES } from "../types";
import type { Album, BandFormData, LocalBand, Member, SetBands } from "../types";
import "../styles/BandForm.css";

function AddBandForm({ setBands }: { setBands: SetBands }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BandFormData>({
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
  });

  const [albums, setAlbums] = useState<Album[]>([{ title: "", year: "", type: "Album" }]);
  const [members, setMembers] = useState<Member[]>([{ name: "", instrument: "", period: "" }]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Never mutate state: build a new object for the edited row instead.
  // (Same rule as UpdateBandForm, where mutating actually corrupted the bands state.)
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

    // No id here: the server generates it and returns the stored band
    const bandToAdd: Omit<LocalBand, 'id'> = {
      ...formData,
      // trim() removes the space in "punk, hardcore" -> ["punk", "hardcore"]
      genre: formData.genre.split(",").map(genre => genre.trim()).filter(genre => genre),
      disbanded: formData.disbanded || null,
      image: null,
      albums: albums.filter(album => album.title),
      members: members.filter(member => member.name),
      source: "local",
      editable: true
    };

    localBandsAPI.create(bandToAdd)
      .then((response) => {
        // Use what the server stored, not what we sent: the id is its decision
        const savedBand: LocalBand = { ...response.data, source: "local", editable: true };
        setBands((existedBands) => [savedBand, ...existedBands]);
        navigate("/bands");
      })
      .catch((error) => {
        console.error(error);
        setError("Could not save the band. Is the local server running?");
      });
  };

  return (
    <div className="band-form-container">
      <h2>Add New Band to Encyclopedia Punkorum</h2>

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

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="themes">Lyrical themes</label>
              <input
                type="text"
                name="themes"
                id="themes"
                value={formData.themes}
                onChange={handleChange}
                placeholder="Anarchy, Boredom, Society"
              />
            </div>

            <div className="input-group">
              <label htmlFor="label">Current label</label>
              <input
                type="text"
                name="label"
                id="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Virgin Records"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="description">History</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="How the band formed, what they did, how it ended..."
            />
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
                    onChange={(e) => albumChange(index, "title", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Year"
                    aria-label="Album year"
                    value={album.year}
                    onChange={(e) => albumChange(index, "year", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <select
                    aria-label="Album type"
                    value={album.type}
                    onChange={(e) => albumChange(index, "type", e.target.value)}
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
                    onChange={(e) => memberChange(index, "name", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Instrument"
                    aria-label="Instrument"
                    value={member.instrument}
                    onChange={(e) => memberChange(index, "instrument", e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Period (e.g. 1975-1978)"
                    aria-label="Period"
                    value={member.period}
                    onChange={(e) => memberChange(index, "period", e.target.value)}
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
            Create Band
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/bands")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBandForm;
