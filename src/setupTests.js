// Runs before every test file
import "@testing-library/jest-dom/vitest"; // adds matchers like toBeInTheDocument()
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup(); // remove what the previous test rendered
  vi.clearAllMocks(); // forget the calls recorded by vi.fn() mocks
  vi.restoreAllMocks(); // undo vi.spyOn (alert, confirm...)
});
