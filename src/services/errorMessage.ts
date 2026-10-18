// What to show the user when a request fails.
//
// The backend already answers with a precise, readable sentence — "A band needs
// a name.", "\"19\" is not a plausible year (1900-2027).", "The highest rating
// is 5." — and the forms were throwing it away in favour of "Could not save the
// band. Is the local server running?". Someone typed 19 in a year field, read
// that the server was down, and had no idea which field to fix.
//
// The fallback is still there, because a request can fail before any server
// answers: no network, CORS, a server that really is down. That is the only case
// it should ever be shown for.

export const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { error?: string } } })?.response?.data?.error || fallback;
