import { URL } from "url";

export const getBaseDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return ""; // Return an empty string if the URL is invalid
  }
};
