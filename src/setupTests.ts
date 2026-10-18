// Runs before every test file
import "@testing-library/jest-dom/vitest"; // adds matchers like toBeInTheDocument()
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./test/server";

// The backend, intercepted at the HTTP boundary rather than replaced in the
// module graph. "error" and not "warn": a request no handler covers is a test
// about to pass for the wrong reason, or a URL that changed without anyone
// noticing. It should fail loudly.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup(); // remove what the previous test rendered
  server.resetHandlers(); // back to the default answers for the next test
  localStorage.clear(); // no session leaks into the next test
  vi.clearAllMocks(); // forget the calls recorded by vi.fn() mocks
  vi.restoreAllMocks(); // undo vi.spyOn (alert, confirm...)
});

afterAll(() => server.close());
