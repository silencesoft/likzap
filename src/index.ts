"use strict";

Object.assign(global, { WebSocket: require('ws') });

import { RelayPool } from 'nostr-relaypool';

import { init } from './commands/init';

export let pool: RelayPool;

const main = (): void => {
  pool = init();
};

main();
