import { Kind, nip57, relayInit } from 'nostr-tools';

import { nostrRelays } from '../constants/config';

let cachedProfileMetadata: any = {};

export const getMetadata = async (authorId: string, kind: Kind = Kind.Metadata) => {
  if (kind === 0 && cachedProfileMetadata[authorId]) {
    return cachedProfileMetadata[authorId];
  }

  const metadata = await new Promise((resolve, reject) => {
    const relay = relayInit(nostrRelays?.[0] ?? '');

    relay.on('connect', async () => {
      const value = await relay.get({
        ...(kind === 0 && { authors: [authorId] }),
        ...(kind === 1 && { ids: [authorId] }),
        kinds: [kind],
      });

      if (kind === 0) {
        cachedProfileMetadata[authorId] = value;
      }

      resolve(value);

      relay.close();
    });

    relay.on('error', () => {
      reject(`failed to connect to ${relay.url}`);

      relay.close();
    });

    relay.connect();
  });

  if (!metadata) {
    console.log('No metadata');
    return {};
  }

  return metadata;
};

export const extractProfileMetadataContent = (profileMetadata: any) => profileMetadata?.content && JSON.parse(profileMetadata.content) || {};

export const getProfile = async (authorId: string): Promise<any> => {
  const metadataPromise = getMetadata(authorId);
  const user = await extractProfileMetadataContent(await metadataPromise);
  const zapEndpoint = await nip57.getZapEndpoint(await metadataPromise);

  user.zapEndpoint = zapEndpoint;

  return user;
};

export const getEvent = async (eventId: string, kind: Kind = Kind.Text): Promise<any> => {
  const metadataPromise = getMetadata(eventId, kind);
  const event = await metadataPromise;

  return event;
};
