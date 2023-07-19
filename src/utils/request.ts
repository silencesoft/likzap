import fetch, { RequestInit } from 'node-fetch';

export const request = async <T>(url: string, options: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, options);
    return (await response.json()) as T;
  } catch (error) {
    // Handle the error.
    return {} as T;
  }
};
