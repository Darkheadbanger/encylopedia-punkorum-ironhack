import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage, expectShell, whenSignedIn } from "../test/renderPage";
import { captures } from "../test/server";
import { makeBand } from "../test/fixtures";
import AddBand from "./AddBand";

// The form used to be replaced by a <p> that printed the type of its props. That
// checked the layout passed something down — not that the something worked, and
// not that the two fit together. The real form renders here, so "the layout wires
// the form up" is proved by filling it in and watching the band go out.

describe("AddBand", () => {
  it("shows the shell around the creation form", async () => {
    renderPage(<AddBand setBands={vi.fn()} />, "/", { loggedIn: true });
    await whenSignedIn();

    expectShell({ loggedIn: true });
    expect(
      screen.getByRole("heading", { name: "Add New Band to Encyclopedia Punkorum" })
    ).toBeInTheDocument();
  });

  // Without setBands the form could not add the new band to the list, and the
  // table would only catch up on a page reload. The proof is that it arrives.
  it("hands setBands down, so a created band reaches the list", async () => {
    const created = makeBand({ id: "server-id", name: "Crass" });
    const sent = captures("post", "/bands", created);
    const setBands = vi.fn();
    renderPage(<AddBand setBands={setBands} />, "/", { loggedIn: true });
    await whenSignedIn();

    await userEvent.type(screen.getByLabelText("Band Name *"), "Crass");
    await userEvent.click(screen.getByRole("button", { name: "Create Band" }));

    expect(sent[0]).toEqual(expect.objectContaining({ name: "Crass" }));
    // The updater the form hands back adds the stored band to the existing list.
    const existing = makeBand({ id: "band-2", name: "Discharge" });
    const updater = setBands.mock.calls[0][0];
    expect(updater([existing])).toEqual([created, existing]);
  });
});
