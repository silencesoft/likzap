import { LndhubRestClient } from "../services/lndhub";

let cachedLndhubClient: LndhubRestClient | null = null;

export const connectToLndhubApi = async () => {
  if (cachedLndhubClient) {
    return cachedLndhubClient;
  }

  const lndhubUrl = process.env.LNDHUB_URL;

  if (!lndhubUrl) {
    console.log('No payment server.');
    return null;
  }

  const client = new LndhubRestClient(lndhubUrl);

  cachedLndhubClient = client;

  return client;
};
