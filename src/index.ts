"use strict";

Object.assign(global, { WebSocket: require('ws') });

import dotenv from 'dotenv';
import { RelayPool } from 'nostr-relaypool';
import { Kind, nip19 } from 'nostr-tools';

dotenv.config();

const nPubKey = process.env.USER_PUBLIC_KEY;
const serverRelays = process.env.NOSTR_RELAYS;

const publicKey = nip19.decode(nPubKey ?? '');
const nostrRelays = serverRelays?.split(',');

const pool = new RelayPool(nostrRelays, {
  autoReconnect: true,
  logErrorsAndNotices: true,
});

pool.subscribe(
  [
    {
      kinds: [Kind.Reaction],
      authors: [publicKey.data.toString()],
      since: Math.floor(new Date().getTime() / 1000 - 30 * 60),
    },
  ],
  nostrRelays,
  (event, _isAfterEose, _relayURL) => {
    console.log('event', event);
  }
);

pool.onerror((err, relayUrl) => {
  console.log("RelayPool error", err, " from relay ", relayUrl);
});

pool.onnotice((relayUrl, notice) => {
  console.log("RelayPool notice", notice, " from relay ", relayUrl);
});