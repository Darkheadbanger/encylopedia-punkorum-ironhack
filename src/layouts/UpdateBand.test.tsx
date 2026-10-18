import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { signedIn, whenSignedIn, expectShell } from "../test/renderPage";
import { captures } from "../test/server";
import { makeBand } from "../test/fixtures";
import UpdateBand from "./UpdateBand";

// The form used to be replaced by a <p> printing the type of its props. That
// checked the layout handed something down — not that the two fit together. The
// real form renders here, which also means the route has to be real: the form
// reads :updateId from the URL to find the band it edits.

const renderAt = (id: string, bands = [makeBand()], setBands = vi.fn()) => {
  signedIn(true);
  return render(
    <MemoryRouter initialEntries={[`/updateBand/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/updateBand/:updateId"
            element={<UpdateBand bands={bands} setBands={setBands} />}
          />
          <Route path="/bands/:bandsId" element={<p>Band page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("UpdateBand", () => {
  it("shows the shell around the update form", async () => {
    renderAt("band-1");
    await whenSignedIn();

    expectShell({ loggedIn: true });
    expect(screen.getByRole("heading", { name: "Edit Band: Sex Pistols" })).toBeInTheDocument();
  });

  // The form finds the band to edit in this list: the layout handing it down is
  // what makes the fields arrive filled in rather than blank.
  it("hands the bands down, so the form opens on the right one", async () => {
    renderAt("band-1");
    await whenSignedIn();

    expect(screen.getByLabelText("Band Name *")).toHaveValue("Sex Pistols");
    expect(screen.getByLabelText("Country")).toHaveValue("GB");
  });

  it("hands setBands down, so an edit reaches the list", async () => {
    const band = makeBand();
    const sent = captures("put", "/bands/band-1", { ...band, name: "The Sex Pistols" });
    const setBands = vi.fn();
    renderAt("band-1", [band], setBands);
    await whenSignedIn();

    const name = screen.getByLabelText("Band Name *");
    await userEvent.clear(name);
    await userEvent.type(name, "The Sex Pistols");
    await userEvent.click(screen.getByRole("button", { name: "Update Band" }));

    expect(sent[0]).toEqual(expect.objectContaining({ name: "The Sex Pistols" }));
    const updated = setBands.mock.calls[0][0]([band]);
    expect(updated[0].name).toBe("The Sex Pistols");
  });
});
