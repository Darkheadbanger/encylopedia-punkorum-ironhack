import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenresList from "./GenresList";

describe("GenresList", () => {
  it("groups the genres into families", () => {
    render(<GenresList />);
    expect(screen.getByRole("heading", { name: "Roots & Proto-Punk" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Anarcho-Punk, Crust & D-Beat" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Metal Edge" })).toBeInTheDocument();
  });

  it("gives each main genre its years, a description and a few bands", () => {
    render(<GenresList />);
    const card = screen.getByRole("heading", { name: "Hardcore Punk" }).closest("li");
    expect(within(card!).getByText(/1978/)).toBeInTheDocument();
    expect(within(card!).getByText(/faster/i)).toBeInTheDocument();
    expect(within(card!).getByText(/Black Flag/)).toBeInTheDocument();
  });

  it("lists the related labels of a family as tags", () => {
    render(<GenresList />);
    // Not every label deserves a card, but the encyclopedia should still know it
    expect(screen.getByText("Kängpunk")).toBeInTheDocument();
    expect(screen.getByText("Burning Spirits")).toBeInTheDocument();
  });

  it("says the labels are hard-coded and not all of them are real genres", () => {
    render(<GenresList />);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent(/hard-coded/i);
    expect(note).toHaveTextContent(/scenes|fan labels/i);
  });

  it("filters the families as you type", async () => {
    render(<GenresList />);
    await userEvent.type(screen.getByLabelText("Filter genres"), "screamo");

    expect(screen.getByRole("heading", { name: "Screamo" })).toBeInTheDocument();
    // A family with no match disappears entirely
    expect(screen.queryByRole("heading", { name: "Oi!" })).not.toBeInTheDocument();
  });

  it("says so when nothing matches, instead of showing an empty page", async () => {
    render(<GenresList />);
    await userEvent.type(screen.getByLabelText("Filter genres"), "jazz fusion bebop");

    expect(screen.getByRole("status")).toHaveTextContent(/no genre/i);
  });
});
