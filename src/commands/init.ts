import { RelayPool } from "nostr-relaypool";
import { Kind } from "nostr-tools";

import { nostrRelays, publicKey } from "../constants/config";
import {  doPayment } from "../actions/doPayment";

export const init = (): RelayPool => {
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
      doPayment(event);
    }
  );

  pool.onerror((err, relayUrl) => {
    console.log("RelayPool error", err, " from relay ", relayUrl);
  });

  pool.onnotice((relayUrl, notice) => {
    console.log("RelayPool notice", notice, " from relay ", relayUrl);
  });

  return pool;
}
