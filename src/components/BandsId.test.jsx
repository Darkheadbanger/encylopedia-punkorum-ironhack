import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BandsId from "./BandsId";
import { APIFromMusicBrainz } from "../services/api";
import { makeLocalBand, makeMusicBrainzBand } from "../test/fixtures";

vi.mock("../services/api", () => ({ APIFromMusicBrainz: { getBandDetails: vi.fn() } }));

// BandsId reads :bandsId from the URL, so it needs a real route
const renderDetails = (bands, id) =>
  render(
    <MemoryRouter initialEntries={[`/bands/${id}`]}>
      <Routes>
        <Route path="/bands/:bandsId" element={<BandsId bands={bands} />} />
      </Routes>
    </MemoryRouter>
  );

// BandsId waits 1 second before calling MusicBrainz
const AFTER_API_CALL = { timeout: 3000 };

describe("BandsId — local band", () => {
  it("shows 'Band not found' for an unknown id", () => {
    renderDetails([makeLocalBand()], "unknown");
    expect(screen.getByText("Band not found")).toBeInTheDocument();
  });

  it("shows the band information", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByRole("heading", { level: 2, name: "Sex Pistols" })).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("1975 - 1978")).toBeInTheDocument();
    expect(screen.getByText("punk rock, proto-punk")).toBeInTheDocument();
    expect(screen.getByText("English punk rock band")).toBeInTheDocument();
  });

  it("shows the albums and members from db.json without calling MusicBrainz", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByText("Never Mind the Bollocks")).toBeInTheDocument();
    expect(screen.getByText("Johnny Rotten")).toBeInTheDocument();
    expect(APIFromMusicBrainz.getBandDetails).not.toHaveBeenCalled();
  });

  it("shows the band photo", () => {
    renderDetails([makeLocalBand()], "local-1");
    expect(screen.getByAltText("Sex Pistols punk band")).toHaveAttribute("src", "https://example.com/pistols.jpg");
  });

  it("shows 'Photos coming soon' when there is no image", () => {
    renderDetails([makeLocalBand({ image: null })], "local-1");
    expect(screen.getByText("Photos coming soon")).toBeInTheDocument();
  });

  it("uses the local Misfits picture for the Misfits", () => {
    renderDetails([makeLocalBand({ name: "Misfits", image: null })], "local-1");
    expect(screen.getByAltText("Misfits punk band")).toBeInTheDocument();
  });
});

describe("BandsId — MusicBrainz band", () => {
  it("loads studio albums and members from MusicBrainz", async () => {
    APIFromMusicBrainz.getBandDetails.mockResolvedValue({
      data: {
        relations: [
          { type: "member of band", artist: { name: "Joey Ramone" }, begin: "1974", end: "1996", attributes: ["lead vocals"] },
          { type: "producer", artist: { name: "Not A Member" } },
        ],
        "release-groups": [
          { id: "r1", title: "Leave Home", "primary-type": "Album", "secondary-types": [], "first-release-date": "1977-01-10" },
          { id: "r2", title: "It's Alive", "primary-type": "Album", "secondary-types": ["Live"] },
          { id: "r3", title: "Blitzkrieg Bop", "primary-type": "Single", "secondary-types": [] },
        ],
      },
    });
    renderDetails([makeMusicBrainzBand()], "mb-1");

    expect(screen.getByText("Loading discography...")).toBeInTheDocument();
    expect(await screen.findByText("Leave Home", {}, AFTER_API_CALL)).toBeInTheDocument();

    expect(APIFromMusicBrainz.getBandDetails).toHaveBeenCalledWith("mb-1");
    expect(screen.queryByText("It's Alive")).not.toBeInTheDocument(); // live album filtered out
    expect(screen.queryByText("Blitzkrieg Bop")).not.toBeInTheDocument(); // single filtered out
    expect(screen.getByText("Joey Ramone")).toBeInTheDocument();
    expect(screen.queryByText("Not A Member")).not.toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("shows empty messages when the MusicBrainz call fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    APIFromMusicBrainz.getBandDetails.mockRejectedValue(new Error("Network error"));
    renderDetails([makeMusicBrainzBand()], "mb-1");

    expect(await screen.findByText("No albums available", {}, AFTER_API_CALL)).toBeInTheDocument();
    expect(screen.getByText("No members information")).toBeInTheDocument();
  });
});
