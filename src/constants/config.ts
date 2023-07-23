import dotenv from 'dotenv';
import { nip19 } from 'nostr-tools';

import { Reaction } from 'src/interfaces/config';

dotenv.config();

const nPubKey = process.env.USER_PUBLIC_KEY;
const serverRelays = process.env.NOSTR_RELAYS;

export const secretKey = process.env.USER_SECRET_KEY ?? '';
export const zapValue = process.env.DEFAULT_ZAP_VALUE ?? "0";
export const publicKey = nip19.decode(nPubKey ?? '');
export const nostrRelays = serverRelays?.split(',') || [];

const reactions: Reaction[] = [];

Object.keys(process.env).forEach((element) => {
  if (element.startsWith('REACTION_VALUE') && !!process.env[element]) {
    const value = process.env[element]?.split('|');

    if (value?.[0]) {
      const reaction = { type: value[0], value: parseInt(value[1]) };
      reactions.push(reaction);
    }
  }
});

export const reactionsValues = reactions;

