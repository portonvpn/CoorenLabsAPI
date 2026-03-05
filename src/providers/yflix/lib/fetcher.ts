export const fetcher = (input: string | URL | Request, init?: RequestInit) => {
  // for flexibility, we can do
  return fetch(input, init);
};
